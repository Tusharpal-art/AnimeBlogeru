import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import {Provider} from "react-redux"
import { persister, store } from './redux/Store.js';
import { PersistGate } from 'redux-persist/integration/react';


createRoot(document.getElementById('root')).render(
   
    <Provider store={store}> 
      <PersistGate loading={null} persistor={persister}> 
    <App />
    </PersistGate>
    </Provider>
   
   ,
)
