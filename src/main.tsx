import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {BrowserRouter as Router} from 'react-router-dom';
import './assets/styles/index.scss';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {i18nConfig} from "./i18n/i18n.ts";

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init(i18nConfig);


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
            <App/>
        </Router>
    </React.StrictMode>,
)
