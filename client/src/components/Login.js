import React, {Component} from 'react';
import logo from '../logo.png';
import {Link, withRouter} from 'react-router-dom';
import './Login.css';

/*
  Log In Page
  -------------------
  Description:
    UI to let user log in
*/
class LogIn extends Component {
  constructor(props){
    super(props)
    this.state = {
      username : '',
      password : ''
    }
  }
 
  /*
    Login
    -------------------
    Description:
      Sends a request to log in and goes to the dashboard
  */
  login(e){
    e.preventDefault()
    
    //callback function to go to the dashboard
    const toUser = () => {this.props.history.push('/dashboard')}

    // Send login request - if successful go to dashboard
    // if usr/pass wrong, then inform the user
    var xhttp = new XMLHttpRequest()
    xhttp.open("POST", "http://localhost:5000/api/login")
    xhttp.onreadystatechange = function () {
      if(this.readyState === 4 && this.status === 200){
        sessionStorage.setItem('token', this.response)
        toUser()
      }
      else if(this.readyState === 4 && this.status === 400){
        alert('Incorrect username or password')
      }
    }
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send('email='+ this.state.username + '&password=' + this.state.password)
  }

  render(){
    return (
      <div className="Login">
        <img src={logo} alt='Smart Pump' />
        <div>
          <label>Username</label><br />
          <input onChange={e => this.setState({username : e.target.value})} type='email' />
          <br />
          <label>Password</label><br />
          <input onChange={e => this.setState({password : e.target.value})} type='password' />
          <br />
          <br />
          <button onClick={e => this.login(e)}>LOGIN</button>
          <br />
          <Link id='signup' to='/signup'>sign up</Link>
        </div>
      </div>
    );
  }
}

export const Login = withRouter(LogIn)