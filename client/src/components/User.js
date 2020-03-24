import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Modal} from './Modal';
import {Hamburger} from './Hamburger';
import './User.css';

/*
    User Dashboard
    -------------------
    Description:
        The user's individualized dashboard
        that displays their info
*/

export class User extends Component {
  constructor(){
    super()

    // The modal's visibility
    this.state = {
        show : false
    }

    // add to state callback function 
    const addToState = data => {this.state = data}
    const token = sessionStorage.getItem('token') // get token from session storage
    
    // If there is one, parse it and send a request to get the user's data
    if(token != null){
        const guid = JSON.parse(atob(token.split('.')[1])).guid

        var xhttp = new XMLHttpRequest()
        xhttp.open("GET", "http://localhost:5000/api/user/" + guid + "?token=" + token, false)
        xhttp.onreadystatechange = function () {
            if(this.readyState === 4 && this.status === 200){
                const resp = JSON.parse(this.response)
                console.log(this.response)
                addToState(resp)
            }
            else if(this.readyState === 4 && this.status === 401){
                alert(this.responseText)
            }
            else if(this.readyState === 4 && this.status === 400){
                alert(this.responseText)
            }
        }
        xhttp.send()
    }

    this.hideModal = this.hideModal.bind(this)
  }

    /*
        Show Modal
        -------------------
        Description:
            Sets modal show state to true and prevents scrolling
    */
  showModal(e){
      this.setState({show : true})
      document.body.style.overflowY = 'hidden';
  }

    /*
        Hide Modal
        -------------------
        Description:
            Sets modal show state to false and re-enables scrolling
    */
  hideModal(e){
      this.setState({show : false})
      document.body.style.overflowY = '';
      window.location.reload()
  }

    /*
        Render
        -------------------
        Description:
            The UI of the user dashboard
    */
  render(){
    // if the state is not empty and there is a token in session storage
    // then display data
    if(this.state != null && sessionStorage.getItem('token') != null){
        return (
        <>
        <Modal show={this.state.show} guid={this.state.guid} hideModal={this.hideModal} />
        
        <div className="User">
            <header><div className='name'>{this.state.name.first} {this.state.name.last}</div><Hamburger /></header>
            <img src={this.state.picture} alt='User profile pic' />
            <div className='buttons'>
                <button onClick={e => alert('Your balance is: ' +this.state.balance)}>BALANCE</button>
                <button onClick={e => this.showModal(e)}>EDIT</button>
            </div>

            <div className='databoxes'>
                <div className='info'>  
                    <img src='http://placehold.it/32x32' alt='icon' />
                    <div className='subgrid'>
                        <label>Company </label>
                        <div>{this.state.company}</div>
                    </div>
                </div>

                <div className='info'>
                    <img src='http://placehold.it/32x32' alt='icon' />
                    <div className='subgrid'>
                        <label>Phone </label>
                        <div>{this.state.phone}</div>
                    </div>
                </div>

                <div className='info'>
                    <img src='http://placehold.it/32x32' alt='icon' />
                    <div className='subgrid'>
                        <label>Email </label>
                        <div>{this.state.email}</div>
                    </div>
                </div>
                
                <div className='info'>
                    <img src='http://placehold.it/32x32' alt='icon' />
                    <div className='subgrid'>
                        <label>Address </label>
                        <div>{this.state.address}</div>
                    </div>
                </div>
                
                <div className='info'>
                    <img src='http://placehold.it/32x32' alt='icon' />
                    <div className='subgrid'>
                        <label>Age </label>
                        <div>{this.state.age}</div>
                    </div>
                </div>

                <div className='info'>
                    <img src='http://placehold.it/32x32' alt='icon' />
                    <div className='subgrid'>
                        <label>Eye Color </label>
                        <div>{this.state.eyeColor}</div>
                    </div>
                </div>
            </div>

        </div>
        </>
        );
    } else { // otherwise redirect to login
        return(
            <>
                <Redirect to='/login' />
            </>
        );
    }

  }
}