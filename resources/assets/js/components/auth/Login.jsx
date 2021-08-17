import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
class Login extends React.Component {
    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          this.handleSubmit(e);
        }
      }
    constructor(props) {
        super(props)
        this.state = {
            email:'',
            password:'',
        }
        this.handleInput = this.handleInput.bind(this);
    }
    //Updates the state values when typing on inputs
    handleInput(e)  {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]:value});
    }
    //Perform Login via API
    async handleSubmit(e) {
        e.preventDefault();
        const data = this.state;
        let responseData = null;
      
        // Call login function
        await axios.post('/api/login', data).then(response => {      
            responseData = response.data;

        }).catch(error => {
            responseData = error.response.data;
        });
        
        //Proceed if there are no errors returned in the API
        if (!('errorResult' in responseData || 'errors' in responseData)) {
            localStorage.setItem("token", responseData.token);
            return this.props.history.push("/")
        } 
        const errorMessage = (this.state.email === '' || this.state.password === '') ? 'Fill up necessary requirements' : 'Email or Password does not match';
        alert(errorMessage);
    }

  render() {

    //Redirect to home if there is a token to validate
    if (localStorage.getItem('token')) {
        return <Redirect to='/'/>
    }

    return (
        <div className="border uk-flex uk-flex-column uk-position-center"> 
            <div className="card border border-primary uk-animation-slide-bottom-small w500" >
                <div className=" card-body">
                    <h4 >Sign In</h4>
                    <div className="uk-margin">
                        <label className="uk-form-label " htmlFor="form-stacked-text">Email</label>
                        <div className="uk-form-controls">
                            <input className="input-block border-5 uk-width-1-1" type="text" name='email' onKeyDown={(e)=>{this._handleKeyDown(e)}} onChange={this.handleInput.bind(this)} autoComplete="off"/>
                        </div>
                    </div>
                    <div className="uk-margin">
                        <label className="uk-form-label " htmlFor="form-stacked-text">Password</label>
                        <div className="uk-form-controls">
                            <input className="input-block border-5 uk-width-1-1" type="password" name='password'onKeyDown={(e)=>{this._handleKeyDown(e)}} onChange={this.handleInput.bind(this)} autoComplete="off"/>
                        </div>
                    </div>
                    <button className="uk-align-center" onClick={this.handleSubmit.bind(this)}>LOGIN</button>
                
                </div>
                <div className="uk-align-center">
                    <Link className="uk-animation-slide-bottom-medium bgimg-none" to="/register">Sign up</Link>
                </div>
            </div>
        </div>
        
    )
  }
}

export default Login
