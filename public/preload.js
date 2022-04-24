const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Invoke Methods
    testInvoke: (args) => ipcRenderer.invoke('test-invoke', args),
    // Send Methods
    testSend: (args) => ipcRenderer.send('test-send', args),
    // Receive Methods
    testReceive: (callback) => ipcRenderer.on('test-receive', (event, data) => { callback(data) }),
    // Get scripture
    getScripture: (args) => ipcRenderer.invoke('get-scripture', args),
    // Get shabad
    getShabad: (args) => ipcRenderer.invoke('get-shabad', args)
});