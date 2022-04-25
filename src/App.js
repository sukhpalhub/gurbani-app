import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import GurbaniSearchPanel from "./components/search/GurbaniSearchPanel";
import ShabadPanel from "./components/shabad/ShabadPanel";
import {ShabadContext} from "./contexts/ShabadContext";

export default class App extends Component {
    setShabad = (shabad) => {
        this.setState({shabad: shabad});
    }

    setPreferences = (pref) => {
        this.setState({preferences: pref});
    }

    state = {
        shabad: {
            id: null,
            lines: [],
        },
        preferences: {
            vishrams: false,
            shabad: {
                gurbaniFontSize: 7,
                punjabiFontSize: 5,
                englishFontSize: 4,
            }
        },
        setShabad: this.setShabad,
        setPreferences: this.setPreferences
    }

    render() {
        return (
            <ShabadContext.Provider value={this.state}>
                <ShabadPanel/>
                <GurbaniSearchPanel/>
            </ShabadContext.Provider>
        );
    }
}
