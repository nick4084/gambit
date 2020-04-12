import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

/*
The Following shift link and script of 

<link rel="stylesheet" href="node_modules/@coreui/coreui/dist/css/coreui.min.css">
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="node_modules/popper.js/dist/umd/popper.min.js"></script>
<script src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="node_modules/@coreui/coreui/dist/js/coreui.min.js"></script>

from index.html to here in order to use CoreUI with electron.

*/
import './../node_modules/@coreui/coreui/dist/css/coreui.min.css'
require('../node_modules/jquery/dist/jquery.min.js');
require('../node_modules/popper.js/dist/umd/popper.min.js');
require('../node_modules/bootstrap/dist/js/bootstrap.min.js');
require('../node_modules/@coreui/coreui/dist/js/coreui.min.js');


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
