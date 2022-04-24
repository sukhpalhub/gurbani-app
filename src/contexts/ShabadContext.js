import React from 'react';

export const ShabadContext = React.createContext({
    shabad: {
        id: null,
    },
    preferences: {
        vishrams: false,
        shabad: {
            gurbaniFontSize: 7,
        }
    }
});
