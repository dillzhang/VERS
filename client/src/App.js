import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import './Reset.css';
import Home from './pages/Home';
import Guest from './pages/Guest';
import Host from './pages/Host';


class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/actor/:code' component={Host}/>
          <Route path='/player/:code' component={Guest}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;