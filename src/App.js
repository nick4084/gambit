
import React, {Component} from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';

import './App.scss';

import MainComponent from './Components/MainComponent';

const loading = () => <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./Components/DefaultLayout'),
  loading
});

class App extends Component {

  render() {
    return (
      // <MainComponent />
      <HashRouter>
      <Switch>
        <Route path="/" name="Home" component={DefaultLayout} />
      </Switch>
    </HashRouter>
    );
  }
}

export default App;
