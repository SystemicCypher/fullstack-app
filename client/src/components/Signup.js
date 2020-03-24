import React, {Component} from 'react';
import logo from '../logo.png';
import {Link, withRouter} from 'react-router-dom';
import './Signup.css';

/*
  Signup Page
  -------------------
  Description:
    The user Sign-up interface, it sends the user's info
    to the backend for registration and to add them to the
    database
*/
class Signup extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  /*
    Register
    -------------------
    Description:
      Sends a request to the api to create a new user
  */
  register(e){
    e.preventDefault()

    const backtoLog =  () => this.props.history.push('/login')

    var xhttp = new XMLHttpRequest()
    xhttp.open('POST', 'http://localhost:5000/api/register')
    xhttp.onreadystatechange = function(){
      if(this.readyState === 4 && this.status === 201){
        backtoLog()
      }
      else if(this.readyState === 4 && this.status === 409){
        alert('This email already has an account associated with it.')
      }
    }
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send('email='+ this.state.username +
               '&password=' + this.state.password +
               '&fname=' + this.state.name.split(' ')[0] +
               '&lname=' + this.state.name.split(' ')[1] +
               '&companyName=' + this.state.companyName +
               '&phone=' + this.state.phone +
               '&address=' + this.state.address)
  }

  render(){
    return (
      <div className="Signup">
        <img src={logo} alt='Smart Pump' />
        <div>
          <label>Name</label><b>*</b><br />
          <input onChange={e => this.setState({'name' : e.target.value})} placeholder='First and Last Name' type='text' required />
          <br />
          <label>Company Name</label><br />
          <input onChange={e => this.setState({'companyName' : e.target.value})} type='text' />
          <br />
          <label>Phone #</label><b>*</b><br />
          <input onChange={e => this.setState({'phone' : e.target.value})} type='phone' placeholder='+1 (555) 555-5555' required />
          <br />
          <label>Address</label><b>*</b><br />
          <input onChange={e => this.setState({'address' : e.target.value})} type='text' placeholder='Street, City, State, Zip' required />
          <br />
          <label>Email</label><b>*</b><br />
          <input onChange={e => this.setState({'username' : e.target.value})} placeholder='This is your username' type='email' required />
          <br />
          <label>Password</label><b>*</b><br />
          <input onChange={e => this.setState({'password' : e.target.value})} type='password' required />
          <br />
          <br />
          <button onClick={e => this.register(e)}>SIGN UP</button>
          <br />
          <Link id='login' to='/login'>Log In</Link>
        </div>
      </div>
    );
  }
}

export const SignUp = withRouter(Signup);