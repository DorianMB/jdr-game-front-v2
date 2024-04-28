import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {BrowserRouter as Router} from 'react-router-dom';
import './assets/styles/index.scss';
import '../node_modules/bootstrap/dist/js/bootstrap.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
            <App/>
        </Router>
    </React.StrictMode>,
)
