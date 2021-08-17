import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import userLogin from './auth/Login';
import Registration from './auth/Registration';
import Home from './pages/Home';
import Admin from './pages/Admin';
import NotFoundPage from './pages/NotFound';
import Write from './pages/Write';
import View from './pages/View';
export class Router extends Component {
    
    render() {
      return (
      <div className="max-height">
          <Switch>
              <Route exact path='/login' component={userLogin} />
              <Route exact path='/register' component={Registration} />
              <Route exact path='/' component={Home} />     
              <Route exact path='/admin' component={Admin} />     
              <Route exact path='/write' component={Write} />
              <Route exact path='/view/:id' component={View} />
              <Route exact path='*' component={NotFoundPage} />
          </Switch>
       </div>
      )
    }
  }
  
  export default Router
  