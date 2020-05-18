import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import acciones from './acciones';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <acciones />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
