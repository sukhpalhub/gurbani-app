const { app, BrowserWindow, ipcMain } = require('electron'); // electron
const isDev = require('electron-is-dev'); // To check if electron is in development mode
const path = require('path');
const sqlite3 = require('sqlite3');

let mainWindow;

// Initializing a new database
const db = new sqlite3.Database(
    isDev
        ? path.join(__dirname, '../db/gurbani.sqlite') // my root folder if in dev mode
        : path.join(process.resourcesPath, '/app/db/gurbani.sqlite'), // the resources path if in production build
    (err) => {
        if (err) {
            console.log(`Database Error: ${err}`);
        } else {
            console.log('Database Loaded');
        }
    }
);

// Initializing the Electron Window
const createWindow = () => {
    mainWindow = new BrowserWindow({
        fullscreen: true,
        width: 600, // width of window
        height: 600, // height of window
        webPreferences: {
            // The preload file where we will perform our app communication
            preload: isDev
                ? path.join(app.getAppPath(), './public/preload.js') // Loading it from the public folder for dev
                : path.join(app.getAppPath(), './build/preload.js'), // Loading it from the build folder for production
            worldSafeExecuteJavaScript: true, // If you're using Electron 12+, this should be enabled by default and does not need to be added here.
            contextIsolation: true, // Isolating context so our app is not exposed to random javascript executions making it safer.
        },
    });

    ipcMain.handle('get-scripture', (event, args) => {
        return new Promise((resolve, reject) => {
            db.all(
                `select *,
                CASE
                    WHEN first_letters like '${args.q}%' THEN 1
                    WHEN first_letters like '${args.q}%' THEN 2
                    ELSE 3
                END AS search_rank
                from lines
                where first_letters like '%${args.q}%'
                ORDER BY search_rank asc, id
                limit 500`,
                (err, data) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }

                    resolve(data);
                }
            );
        });
    });

    ipcMain.handle('get-shabad', (event, args) => {
        return new Promise((resolve, reject) => {
            db.all(
                `select *, pt.translation as punjabi, et.translation as english
                from lines
                left join translations as pt on lines.id = pt.line_id
                    AND pt.translation_source_id = 6
                left join translations as et on lines.id = et.line_id
                    AND et.translation_source_id = 2
                where shabad_id = '${args.id}'
                ORDER BY order_id`,
                (err, data) => {
                    console.log(err);
                    console.log(data);
                    resolve(data);
                }
            );
        });
    });

    // Loading a webpage inside the electron window we just created
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000' // Loading localhost if dev mode
            : `file://${path.join(__dirname, '../build/index.html')}` // Loading build file if in production
    );

    // Setting Window Icon - Asset file needs to be in the public/images folder.
    mainWindow.setIcon(path.join(__dirname, 'images/appicon.ico'));

    // In development mode, if the window has loaded, then load the dev tools.
    if (isDev) {
        mainWindow.webContents.on('did-frame-finish-load', () => {
            mainWindow.webContents.openDevTools({ mode: 'detach' });
        });
    }
};

// ((OPTIONAL)) Setting the location for the userdata folder created by an Electron app. It default to the AppData folder if you don't set it.
app.setPath(
    'userData',
    isDev
        ? path.join(app.getAppPath(), 'userdata/') // In development it creates the userdata folder where package.json is
        : path.join(process.resourcesPath, 'userdata/') // In production it creates userdata folder in the resources folder
);

// When the app is ready to load
app.whenReady().then(async () => {
    await createWindow(); // Create the mainWindow

    // If you want to add React Dev Tools
    if (isDev) {
        await session.defaultSession
            .loadExtension(
                path.join(__dirname, `../userdata/extensions/react-dev-tools`) // This folder should have the chrome extension for React Dev Tools. Get it online or from your Chrome extensions folder.
            )
            .then((name) => console.log('Dev Tools Loaded'))
            .catch((err) => console.log(err));
    }
});

// Exiting the app
app.on('window-all-closed', () => {
    console.log(process.platform);
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Activating the app
app.on('activate', () => {
    if (mainWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Logging any exceptions
process.on('uncaughtException', (error) => {
    console.log(`Exception: ${error}`);
    if (process.platform !== 'darwin') {
        app.quit();
    }
});