import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import axios from 'axios';
class Navbar extends React.Component {
  _isMounted = true;
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
    this.logout = this.logout.bind(this);
  }
  // Check Saved token if valid
  async componentDidMount() {
    let responseData = null;
    await axios.post('/api/checkUser', null, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token')
      }
    }).then(response => {    
      responseData = response.data;
    
    }).catch(error => {
      responseData =  error.response.status;
    });
    if (responseData == 403) {
      localStorage.removeItem('token');
      this.props.history.push("/login");
    } else if (responseData.user.user_type === 'admin') {
      this.props.history.push("/admin");
    }

    if (this._isMounted === false) return 
    this.setState({data: responseData});
    this.props.sendData(responseData);
  }
  
  componentWillUnmount() {
    this._isMounted = false;
   }
    
  //Remove token
  logout() {
    localStorage.removeItem('token');        
    return this.props.history.push("/login");
  }

  render() {
    const {data} = this.state;
    let title;
    let writeButton;
    let url  ='/'
    //Initialize text and buttons to be displayed
    if(Object.keys(data).length != 0) {
      localStorage.setItem('name', data.user.name)
      title =  (data.user.user_type === 'admin') ? 'Admin' : 'Blog';
      url =  (data.user.user_type === 'admin') ? '/admin' : '/';
      writeButton = (data.user.user_type !== 'admin') ?  <Link className="text-decoration-none uk-text-center" to="/write"><span uk-icon="icon:  plus-circle;ratio: 2"></span></Link> : '';
     
      localStorage.setItem('title', title)
    }
    
    
    return (   
      <>
      <nav className="border split-nav">
        <div className="nav-brand">
          <h3><Link className="text-decoration-none" to={url}>{localStorage.getItem('title')}</Link></h3>
        </div>
        <div className="collapsible">
          <input id="collapsible1" type="checkbox" name="collapsible1"/>
          <label htmlFor="collapsible1">
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </label>
          <div className="collapsible-body">
            <ul className="inline">
                <li>{writeButton}</li>
                <li><a className="text-decoration-none" >{localStorage.getItem('name')}</a></li>
                <li><a className="text-decoration-none uk-text-center" onClick={()=>this.logout()}><div uk-icon="icon: sign-out; ratio: 2"></div></a></li>
            </ul>
          </div>
        </div>
      </nav>
    </>
    ) 
  }
}

export default withRouter (Navbar)
