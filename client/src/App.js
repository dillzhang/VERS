import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import './Reset.css';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Guest from './pages/Guest';
import Host from './pages/Host';


class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' render={() => <Home page="show"/>}/>
          <Route exact path='/team' render={() => <Home page="team"/>}/>
          <Route exact path='/faq' render={() => <Home page="faq"/>}/>
          <Route exact path='/contact' render={() => <Home page="contact"/>}/>
          <Route path='/admin/:password' component={Admin}/>
          <Route exact path='/admin' component={Admin}/>
          <Route path='/actor/:code' component={Host}/>
          <Route path='/player/:code/:password' component={Guest}/>
          <Route exact path='/player/:code' component={Guest}/>
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