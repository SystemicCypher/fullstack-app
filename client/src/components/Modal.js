import React, {Component} from 'react';
import './Modal.css';


/*
    Hide Modal
    -------------------
    Description:
        A modal for the user dashboard to change user info
*/
export class Modal extends Component{
    constructor(props){
        super(props)
        this.state = {
            newData : null,
            option : null
        }
    }

    /*
        Click Handler
        -------------------
        Description:
            Takes the user's selection and their updated data and sends a request
            to update the database with the new info.
    */
    clickHandler(e){
        const token = sessionStorage.getItem('token')
        var xhttp = new XMLHttpRequest()
        const notify = () => {
            alert('Updated ' + this.state.option + '!')
            this.setState({newData : null, option : null})
        }
        xhttp.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 400){
                alert('The data field is empty.')
            }
            else if(this.readyState === 4 && this.status === 200){
                notify()
            }
        }
        xhttp.open('PUT', 'http://localhost:5000/api/user/' + this.props.guid + '/edit/' + this.state.option + '?token=' + token)
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        xhttp.send('newData=' + this.state.newData)
        
        
    }

    render(){
        if(!this.props.show){
            return null;
        }
        return(
            <div className='Modal'>
                <div>
                    <h2>Edit Data <button onClick={e => this.props.hideModal(e)}>X</button></h2>
                    <select onChange={e => this.setState({option : e.target.value})}>
                        <option>Select a field to edit...</option>
                        <option value='firstname' >First Name</option>
                        <option value='lastname' >Last Name</option>
                        <option value='age' >Age</option>
                        <option value='eyeColor' >Eye Color</option>
                        <option value='picture' >Picture</option>
                        <option value='company' >Company</option>
                        <option value='email' >Email</option>
                        <option value='phone'>Phone</option>
                        <option value='address' >Address</option>
                    </select>
                    <input placeholder='New Value' type='text' onChange={e => this.setState({newData : e.target.value})} />
                    <button onClick={e => this.clickHandler(e)}>UPDATE</button>

                </div>
            </div>
        );
    }
}