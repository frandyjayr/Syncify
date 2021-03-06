import React from 'react';
import ReactDOM from 'react-dom';
import './app/js/index.css'
import App from './app/js/App';
import * as serviceWorker from './app/js/serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import storeAndPersistor from './app/js/Store/Config/configureStore.js';
import { BrowserRouter as Router } from 'react-router-dom';
import ScriptTag from 'react-script-tag';

ReactDOM.render(
    <Provider store={storeAndPersistor().store}>
        <PersistGate loading={null} persistor={storeAndPersistor().persistor}>
            <Router>
                <ScriptTag isHydrating={true} type="text/javascript" src="https://sdk.scdn.co/spotify-player.js" />
                <App/>
            </Router>
        </PersistGate>
    </Provider>,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
