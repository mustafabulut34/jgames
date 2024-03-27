import React from 'react'
import ReactDOM from 'react-dom/client'

import {Provider} from 'react-redux'
import store from './store'

import App from './App'
import {setAuth} from "./actions/tokenActions";

const storedToken = localStorage.getItem('token');
const isAdmin = localStorage.getItem('isAdmin');
if (storedToken) {
    store.dispatch(setAuth({token: storedToken, isAdmin:isAdmin}));
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <Provider store={store}>
        <App/>
    </Provider>,
)
