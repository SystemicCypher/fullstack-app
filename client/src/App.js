// React framework
import React, {Component} from 'react';
// The login screen
import {Login} from './components/Login';
// The sign-up screen
import {SignUp} from './components/Signup';
// The user dashboard
import {User} from './components/User'
// Client side routing 
import {Switch, Route, Redirect} from 'react-router-dom';

// Renders the main routes
// / - will redirect to either the user /dashboard if a valid token exists or /login otherwise
// /login - allows the user to log in
// /signup - allows the user to sign up
// /dashboard - the user's individual page
class App extends Component {
  render(){
    return (
      <div>
        <Switch>
          <Route exact path='/'>
            {(sessionStorage.getItem('token') == null)? <Redirect to='/login' /> : <Redirect to='/dashboard' />}
          </Route>

          <Route path='/login'>
            <Login />
          </Route>

          <Route path='/signup'>
            <SignUp />
          </Route>

          <Route path='/dashboard'>
            <User />
          </Route>

        </Switch>
        
      </div>
    );
  }
}

export default App;
