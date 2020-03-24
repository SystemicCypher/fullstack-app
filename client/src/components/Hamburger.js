import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import './Hamburger.css';

/*
    Hamburger Menu
    -------------------
    Description:
        Displays a hamburger menu and nav tray
*/
class HamburgerMenu extends Component{
    /*
        Logout
        -------------------
        Description:
            Sends a logout request to the api and deletes the current user token
    */
    logout(e){
        const token = sessionStorage.getItem('token')               //Save token
        sessionStorage.removeItem('token')                          //get rid of the token
        // This stuff is just to change user active status
        const guid = JSON.parse(atob(token.split('.')[1])).guid

        var xhttp = new XMLHttpRequest()
        xhttp.open('POST', 'http://localhost:5000/api/user/' + guid + '/logout?token=' + token, false)
        xhttp.send()
        this.props.history.push('/')                                // Go back to the main screen
    }

    render(){

        return(
            <nav role='navigation'>
            <div id='hamburgerMenu' >
                <input type='checkbox' />

                <span></span>
                <span></span>
                <span></span>

                <ul id='navigation'>

                    <button onClick={e => this.logout(e) }><li>Logout</li></button>

                </ul>
            </div>
            </nav>
        );
    }
}

export const Hamburger = withRouter(HamburgerMenu)