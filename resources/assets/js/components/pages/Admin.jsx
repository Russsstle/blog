import React, { Component } from 'react';
import Navbar from '../sections/Navbar';
import axios from 'axios';
class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name:'',
            id:'',
            userList:[],
            inputName:'',
            inputEmail:'',
            inputRole:'user',
            formTitle:'Create Account',
            selectedUserId:''
        }
        this.fetchUserData = this.fetchUserData.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEditForm = this.handleEditForm.bind(this);
    }

    //fetch all users
    async fetchUsers() {
        await axios.get('/api/getUsers').then(response => {  
            this.generateUserList(response.data);
          })
    }

    //Saves current user data for the page
    fetchUserData(userData) {
        this.setState({name:userData.user.name, id: userData.user.id}, () => {
            this.fetchUsers()
        });
    }
    //Generate list of users
    generateUserList(userListData) {
        let userListFormat = [];
        userListData.forEach((user, index) => {
            let modifyButtons = (user.user_type !== 'admin') ? <><label htmlFor="userForm" onClick={()=>{this.handleEditForm(user.id)}} uk-icon="file-edit"></label><div onClick={()=>{this.handleDelete(user.id)}} uk-icon="trash"></div></> : '';
            userListFormat.push(
                <tr key={index}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.user_type}</td>
                <td>{modifyButtons}</td>
                </tr>
            );
        });
        this.setState({userList: userListFormat});
    }
    //Fill up input using the selected id
    async handleEditForm(userId) {
        await axios.post('/api/getUsersById', {id:userId}).then(response => {
            let user = response.data;
            this.setState({formTitle:'Update Account',inputName:user.name, inputEmail:user.email, inputRole:user.user_type})
          }).catch(errorResponse => {
            console.log(errorResponse)
        });
        this.setState({formTitle:'Update Account',selectedUserId: userId})

    }
    //Register or Update user througn API
    async handleSubmit() {
        const data = this.state;
        let name = data.inputName;
        let email = data.inputEmail; 
        let role = data.inputRole;
        //Registering an Account
        if (data.formTitle === 'Create Account') {
            let defaultPassword = 'user12345'
            await axios.post('/api/register', {name, email, password:defaultPassword,confirmPassword:defaultPassword, role}).then(response => {
                if(response.data.message === 'success') {
                    alert('Registered Successfully');
                    window.location.reload();
                }
            }).catch(errorResponse => {
                const errorData = errorResponse.response.data;
                // Append error message on each inputs
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
        //For Updating an account
        } else {
            let id = data.selectedUserId;
            await axios.post('/api/updateUserById', {id,name, email, role}).then(response => {
                alert(response.data.message)
                window.location.reload();
              }).catch(error => {
                alert('Email already exist')
              });
        }
        
    }
    
    //Delete Selected User
    async handleDelete(userId) {
        if(confirm("Are you sure you want to delete this account?")) {
            await axios.post('/api/deleteUserById', {id: userId}).then(response => {
             if(response.data == 1) {
               alert('Account Deleted Successfully');
              this.props.history.push('/')
             }
            
           }).catch(error => {
             console.log(error);
           });
          }
    }
    render() {
        return (
            <div className="uk-padding-small">
                <Navbar sendData={this.fetchUserData}/>
                <div className="border uk-align-center uk-padding uk-width-1-2">
                <div className="row uk-align-right flex-spaces child-borders">
                    <label className="paper-btn margin" onClick={()=>{this.setState({inputName:'',inputEmail:'', inputRole:'user', formTitle:'Create Account'})}} htmlFor="userForm"><span uk-icon="icon:plus; ratio:1.5"></span></label>
                </div>
                <div className="uk-align-right"></div>
                    <table>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.userList}
                        </tbody>
                    </table>
                </div>
                
                <input className="modal-state" id="userForm" type="checkbox"/>
                <div className="modal z-101">
                <label className="modal-bg" htmlFor="userForm"></label>
                <div className="modal-body uk-width-1-6">
                    <label className="btn-close" htmlFor="userForm">X</label>
                    <h4 className="modal-title">{this.state.formTitle}</h4>
                    <div className="uk-margin">
                        <label className="uk-form-label " htmlFor="form-stacked-text">Name</label>
                        <div className="uk-form-controls">
                            <input className="input-block border-5 uk-width-1-1" type="text" placeholder="Enter Full Name" value={this.state.inputName} onChange={(e)=>this.setState({inputName:e.target.value})} autoComplete="off"  />
                        </div>
                        <span className="red" id="name"></span>
                    </div>
                    <div className="uk-margin">
                        <label className="uk-form-label " htmlFor="form-stacked-text">Email</label>
                        <div className="uk-form-controls">
                            <input className="input-block border-5 uk-width-1-1" type="email" value={this.state.inputEmail} onChange={(e) => this.setState({inputEmail:e.target.value})} placeholder="Enter Email" autoComplete="off"/>
                        </div>
                        <span className="red" id="email"></span>
                    </div>
                    <div className="uk-margin">
                        <label className="uk-form-label" htmlFor="form-stacked-text">Role</label>
                        <select onChange={(e) => this.setState({inputRole:e.target.value})} value={this.state.inputRole}>
                            <option value="admin">admin</option>
                            <option value="user">user</option>
                        </select>
                    </div>
                    <button className="uk-align-center" onClick={()=>{this.handleSubmit()}}>Submit</button>
                </div>
                </div>
            </div>
        )
    }
}
export default Admin
