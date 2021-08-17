import React, { Component } from 'react';
import Navbar  from '../sections/Navbar';
import axios from 'axios';
class Write extends Component {
  constructor(props) {
    super(props)
    this.state = {
        id:null,
        title:'',
        name:'',
        content:'',
        category:[]
       
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
  }
  // Submit data to API
  async handleSubmit (e) {
    e.preventDefault();
    if (confirm('Are you sure you want to publish this article?')) {
      const data = this.state;
      await axios.post('/api/addArticle', data).then(response => {    
        console.log(response)
        alert(response.data.message);
        this.props.history.push("/");

      }).catch(error => {
        const errorData = error.response.data;
        if (errorData.message === "The given data was invalid.") {
          document.querySelectorAll('.title .content').forEach(e => e.innerHTML = "");
          Object.keys(errorData.errors).map(function(key, value) {
              document.getElementById(key).innerHTML = errorData.errors[key][0];
          });
        } 
      });
    }
  }

  // Save inputs to state
  handleInput(e) {
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'category') {
      const categoryValues = [...this.state.category];
      const checkCategoryValue = categoryValues.indexOf(value);
      if (checkCategoryValue !== -1) {
        categoryValues.splice(checkCategoryValue, 1);
      } else {
        categoryValues.push(value);
      }
      this.setState({category: categoryValues});
    } else {
      this.setState({[name]:value});
    }
  }
  //Fetch Current User Data
  fetchUserData (data) {
    this.setState({name:data.user.name, id: data.user.id});
  }

  render() {
    return ( 
      <div className="uk-padding-small max-height">
      <Navbar sendData={this.fetchUserData} />
        <div className="uk-animation-slide-bottom-small border border-4 border-primary uk-align-center uk-width-2-3 uk-padding" uk-height-viewport="offset-bottom: 20">
        <article className="article uk-height-100">
          <div className="uk-margin">
            <label className="uk-form-label white" htmlFor="form-stacked-text">Title</label>
              <input className="input-block border-5 uk-width-1-1" type="text" name="title" onChange={this.handleInput.bind(this)} placeholder="Enter Title" autoComplete="off"/>
              <span className="red" id="title"></span>
            </div>
              <p className="article-meta">Written by {this.state.name}</p>
              <div className="uk-margin">
                  <label className="uk-form-label white" htmlFor="form-stacked-text">Content</label>
                  <textarea className="large-input input-block w100-percent" name="content"  rows="16"  placeholder="Write Content..." onChange={this.handleInput.bind(this)} ></textarea>
                  <span className="red" id="content"></span>
              </div>
              <fieldset className="form-group">
                <legend>Categories:</legend>
                <div data-uk-grid>
                <label htmlFor="paperChecks1" className="paper-check">
                  <input type="checkbox" name="category" id="paperChecks1" value="1" onChange={this.handleInput.bind(this)} /> <span>Programming</span>
                </label>
                <label htmlFor="paperChecks2" className="paper-check">
                  <input type="checkbox" name="category" id="paperChecks2" value="2" onChange={this.handleInput.bind(this)} /> <span>Science</span>
                </label>
                <label htmlFor="paperChecks3" className="paper-check">
                  <input type="checkbox" name="category" id="paperChecks3" value="3" onChange={this.handleInput.bind(this)} /> <span>Design</span>
                </label>
                </div>
              </fieldset>
              <div className="uk-text-center">
                  <button onClick={this.handleSubmit.bind(this)}>Publish</button>
              </div>
            </article>
        </div>
      </div>

    )
  }
}
export default Write
