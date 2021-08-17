import React from 'react';
import axios from 'axios';
class Comment extends React.Component {
  _isMounted = true;
  constructor(props) {
    super(props)
    this.state = {
        comment:'',
        commentSection:[]
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount(){
    this.fetchComments();
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  } 

  //Call API to save a comment
  async handleSubmit() {
    await axios.post('/api/addComment', {articleId:this.props.articleId, userId:this.props.userId, content:this.state.comment}).then(response => {
      this.fetchComments();
    }).catch(error => {
      console.log(error);
    });
  }

  //Retrieve all comment of the article
  async fetchComments() {
    await axios.post('/api/getComments', {articleId:this.props.articleId}).then(response => {  
      this.generateComments(response.data);
    }).catch(error => {
      console.log(error) 
    });
  }

  //Delete comment through API
  async handleDelete(commentId) {
    await axios.post('/api/deleteCommentById', {id:commentId}).then(() => {  
      this.fetchComments();
    }).catch(error => {
      console.log(error) 
    });
  }

  //Append comment blocks to be displayed
  generateComments(comments) {
    let commentDisplay=[];
    comments.forEach((commentDetails, index) => {
      let editButtons = (this.props.userId === commentDetails.user_id) ?  <div><span onClick={()=>{this.handleDelete(commentDetails.id)}} uk-icon="icon:close"></span></div> : '';
      commentDisplay.push(
      <div className="border border-4 uk-padding-small uk-margin-bottom" key={commentDetails.id} >
        <div className="uk-flex uk-flex-wrap uk-flex-between " key={index}>
          <div className="uk-margin-right">{commentDetails.user.name}: </div>
          {editButtons}
        </div>
        <div className="uk-text-break">{commentDetails.content}</div>
       </div>);
     
    });
    if (this._isMounted === false) return 
    this.setState({commentSection:commentDisplay, comment:''})
  }

  render() {
    return (   
      <>
        <div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Comment</label>
            <div className="uk-flex uk-padding-top">
                  <input className="uk-width-expand"  onChange={(e)=>{this.setState({comment:e.target.value})}} value={this.state.comment} type="text" id="paperInputs2"  autoComplete="off"/>
                <div className=" uk-margin-left">
                  <button className="paper-btn paper-btn" onClick={this.handleSubmit.bind(this)}><span uk-icon="chevron-right"></span></button>
                </div>
              </div>
            <div className="uk-margin ">
              {this.state.commentSection}
            </div>  
          </div>
      </>
    ) 
  }
}

export default Comment
