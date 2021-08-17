import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';

class Registration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword:'',
            role:'user'

        }
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    //Update State Value when an input is being typed
    handleInput(e)  {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]:value});
    }
    //Register form inputs through API
    async handleSubmit(e) {
        e.preventDefault();
        const data = this.state;

        await axios.post('/api/register', data).then(response => {
            if(response.data.message === 'success') {
                alert('Registered Successfully');
                return this.props.history.push("/login")
            }
        }).catch(errorResponse => {
            const errorData = errorResponse.response.data;
           
            //Append error message on each inputs
            if (errorData.message === "The given data was invalid.") {
                document.querySelectorAll('span').forEach(e => e.innerHTML = "");
                Object.keys(errorData.errors).map(function(key, value) {
                    document.getElementById(key).innerHTML = errorData.errors[key][0];
                });
            } else {
                // Alert if the email is existing
                alert('Email is already registered')
                document.querySelectorAll('span').forEach(e => e.innerHTML = "");
            }
        });
      
        
    }

    render() {
         //Redirect to home if there is a token to validate
        if (localStorage.getItem('token')) {
            return <Redirect to='/'/>
        }
        
        return (
                <div className="border uk-flex uk-flex-column uk-position-center"> 
                <div className="border card border border-primary uk-animation-slide-bottom-small w500" >
                    <div className="card-body">
                        <h4 >Sign Up</h4>
                        <div className="uk-margin">
                        <label className="uk-form-label" htmlFor="form-stacked-text">Name</label>
                            <div className="uk-form-controls">
                                <input className="input-block border-5 uk-width-1-1" type="text" name="name" onChange={this.handleInput.bind(this)} autoComplete="off"/>
                            </div>
                            <span className="red" id="name"></span>
                        </div>
                        <div className="uk-margin">
                            <label className="uk-form-label" htmlFor="form-stacked-text">Email</label>
                            <div className="uk-form-controls">
                                <input className="input-block border-5 uk-width-1-1" type="text" name="email" onChange={this.handleInput.bind(this)} autoComplete="off"/>
                            </div>
                            <span className="red" id="email"></span>
                        </div>
                        <div className="uk-margin">
                            <label className="uk-form-label" htmlFor="form-stacked-text">Password</label>
                            <div className="uk-form-controls">
                                <input className="input-block border-5 uk-width-1-1" type="password" name="password" onChange={this.handleInput.bind(this)} autoComplete="off"/>
                            </div>
                            <span className="red" id="password"></span>
                        </div>
                        <div className="uk-margin">
                            <label className="uk-form-label" htmlFor="form-stacked-text">Confirm Password</label>
                            <div className="uk-form-controls">
                                <input className="input-block border-5 uk-width-1-1" type="password"  name="confirmPassword" onChange={this.handleInput.bind(this)} autoComplete="off"/>
                            </div>
                            <span className="red" id="confirmPassword"></span>
                        </div>
                        <button className="uk-align-center" onClick={this.handleSubmit.bind(this)}>Register</button>
                    
                    </div>
                    <div className="uk-align-center">
                        <Link className="uk-animation-slide-bottom-medium bgimg-none" to="/login">Sign In</Link>
                    </div>
                </div>
            </div>        
        )
    }
}

export default Registration
