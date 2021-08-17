import axios from 'axios';
import React, { Component } from 'react';
import Navbar  from '../sections/Navbar';
import Comment from '../sections/Comment';
class View extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //Current user and id
      name:'',
      id:'',
      //Article details fetched by id
      article:{},
      //Mode on how the page is being displayed
      mode:'view',
      //Values stored when trying to update
      title:'',
      content:'',
      category:[],
    
    }
    // initialize functions
    this.fetchArticleData = this.fetchArticleData.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
    this.updateMode = this.updateMode.bind(this);
    this.displayMode = this.displayMode.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  //Call to fetch the article data
  componentDidMount() {
    this.fetchArticleData();
  }
  //Fetch data of an article
  async fetchArticleData() {
    await axios.post('/api/getArticleById', {id: this.props.match.params.id}).then(response => { 
      let categoryValues = [];
      response.data.categories.forEach(function (categoryDetails, index) { 
        categoryValues.push(categoryDetails.id);
      }); 
      this.setState({article:response.data, category: categoryValues})
    }).catch(error => {
      console.log(error);
      this.props.history.push('/')
    });
  }
  //Updates the state value that checks if the page is in edit or view mode
  updateMode() {
    const modeValue = (this.state.mode === 'view') ? 'edit' : 'view';
    this.setState({mode:modeValue})
  }

  //Saves current user data
  fetchUserData(userData) {
    this.setState({name:userData.user.name, id: userData.user.id})
  }

  // Save edit inputs to state
  handleInput(e) {
    const name = e.target.name;
    const value = e.target.value;
  
    if (name === 'category') {
      let categoryValues = [...this.state.category];
      const checkCategoryValue = categoryValues.indexOf(parseInt(value));
      if (checkCategoryValue !== -1) {
        categoryValues.splice(checkCategoryValue, 1);
      } else {
        categoryValues.push(parseInt(value));
      }
      this.setState({category: categoryValues});
    } else {
      this.setState({[name]:value});
    }
  }

  //Updates the article record
  async handleEdit() {
    const data = this.state;
    //if empty input values are submitted, use the current record saved
    const titleInput = (data.title === '') ? data.article.title : data.title;
    const contentInput = (data.content === '') ? data.article.title : data.content;
    await axios.post('/api/updateArticleById', {title:titleInput, content:contentInput, id: data.article.id, category:data.category}).then(response => {
      alert(response.data.message)
      window.location.reload();
    }).catch(error => {
      console.log(error);
    });
  }

  //Deletes the article record
  async handleDelete() {
    if(confirm("Are you sure you want to delete this article?")) {
      await axios.post('/api/deleteArticleById', {id: this.props.match.params.id}).then(response => {
       if(response.data == 1) {
         alert('Deleted Successfully');
        this.props.history.push('/')
       }
      
     }).catch(error => {
       console.log(error);
     });
    }
  }

  //Displays view or edit mode
  displayMode() {
    const {article} = this.state
    //Detail text to be displayed
    let name;
    let date;
    let categories = [];
    
    //DOM Elements to be displayed
    let title;
    let content;
    let category = [];
    let updateButton;
    let commentSection;
  
    if(article.user !== undefined) {
      name = article.user.name;
      date = new Date(article.user.updated_at).toISOString().split('T')[0];
      //Loop Category data from the fetch article API
      article.categories.forEach(function (categoryDetails, index) { 
        categories[categoryDetails.id] = categoryDetails.name;
      });
    }
    //Generate DOM for view
    if (this.state.mode === 'view') {
      title = (<p className="uk-article-title">{article.title}</p>);
      content = (<p className="uk-text-lead uk-text-break" style={{whiteSpace:'pre-wrap'}}>{article.content}</p>);
      categories.forEach(function (categoryName, index) { 
          category.push(<div className="paper-btn btn-secondary" key={index}>{categoryName}</div>)
      }); 
     
      if (Object.keys(this.state.article).length !== 0) {
        commentSection = <Comment key={this.state.id} userId={this.state.id} articleId={this.state.article.id}/>
      }
      //Generate DOM for edit
    } else {
      let categoryValues = ['', '', '',''];
      categories.forEach(function (categoryDetails, index) { 
        categoryValues[index]  = 'checked';
      });

      title = (<div className="uk-margin">
                <label className="uk-form-label white" htmlFor="form-stacked-text">Title</label>
                <input className="large-input input-block w100-percent" name="title" onChange={this.handleInput.bind(this)} defaultValue={article.title} placeholder="Write Title..."/>
                <span className="red" id="title"></span>
              </div>);
      content = (<div className="uk-margin">
                  <label className="uk-form-label white" htmlFor="form-stacked-text">Content</label>
                  <textarea className="large-input input-block w100-percent" name="content" rows="16" onChange={this.handleInput.bind(this)} defaultValue={article.content} placeholder="Write Content..."></textarea>
                  <span className="red" id="content"></span>
                </div>);
      category = (<fieldset className="form-group">
                    <legend>Categories:</legend>
                    <div data-uk-grid>
                      <label htmlFor="paperChecks1" className="paper-check">
                        <input type="checkbox" name="category" id="paperChecks1" value="1" defaultChecked={categoryValues[1]} onChange={this.handleInput.bind(this)} /> <span>Programming</span>
                      </label>
                      <label htmlFor="paperChecks2" className="paper-check">
                        <input type="checkbox" name="category" id="paperChecks2" value="2" defaultChecked={categoryValues[2]} onChange={this.handleInput.bind(this)} /> <span>Science</span>
                      </label>
                      <label htmlFor="paperChecks3" className="paper-check">
                        <input type="checkbox" name="category" id="paperChecks3" value="3" defaultChecked={categoryValues[3]} onChange={this.handleInput.bind(this)} /> <span>Design</span>
                      </label>
                    </div>
                 </fieldset>);
      updateButton = (<div className="uk-text-center">
                        <button onClick={this.handleEdit.bind(this)}>Update</button>
                      </div>);
     
    
    }
    //Return to display the DOM
    return (
      <>
        <article className="uk-article">
          {title}
          <p className="article-meta">Written by {name} {date}</p>
          {content}
          {category}
          {updateButton}
        </article>
        {commentSection}
        </>
      )
  }

  render() {
    const {article} = this.state
    let modifyButtons; 
    // Initialize edit and delete button if user owns the article
    if(article.user !== undefined) {
      if(article.user.name === this.state.name) {
        modifyButtons = <fieldset className="form-group uk-align-right">
            <label htmlFor="paperSwitch2" className="paper-switch-tile">
            <input id="paperSwitch2" name="mode" type="checkbox" onClick={this.updateMode.bind(this)}/>
            <div className="paper-switch-tile-card border">
              <div className="paper-switch-tile-card-front border">Edit</div>
              <div className="paper-switch-tile-card-back border">Cancel</div>
            </div>
          </label>
          <button className="paper-btn" onClick={this.handleDelete.bind(this)}><span uk-icon="icon: trash; ratio:2"></span></button>
        </fieldset>;
      }
    }
   
    
    return (
      <>
      <div className="uk-padding-small max-height">
      <Navbar sendData={this.fetchUserData}/>
        <div className="uk-animation-slide-bottom-small border border-4 border-primary uk-align-center uk-width-2-3 uk-padding" >
        <div className="row uk-align-right">
        {modifyButtons}
        </div>
            {this.displayMode()}
        </div>
      </div>
      </>
    );
  }
}

export default View
