import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {initI18n} from './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter } from 'react-router-dom';
import {WindowSizeProvider} from "./provider/WindowSizeProvider";





initI18n().then(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <HashRouter>
            <WindowSizeProvider>
                <App />
            </WindowSizeProvider>
        </HashRouter>
    );
});