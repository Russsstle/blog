import React from 'react';
import {Link, withRouter} from 'react-router-dom';
class Posts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        posts:''
    }
    this.generatePosts = this.generatePosts.bind(this);
  }
  
  componentDidMount() {
    this.generatePosts(this.props.homeStateData)
  }

  generatePosts(data) {
    const articles = data.articles;
    let filteredPosts = [];
    if (articles.length !== 0 || articles !== undefined) {
        //Loop Article data
        articles.forEach(function (articleDetails, index) {
           //Loop to get Category data
           let categories = [];
            articleDetails.categories.forEach(function (categoryDetails, index) {
                categories.push(categoryDetails.name)
            });
            let commentDescription = articleDetails.comments.length === 1 ? ' Comment' : ' Comments'
            let comment = articleDetails.comments.length > 0 ? '(' + articleDetails.comments.length  + commentDescription + ')' : '';

            if (categories.includes(data.category) || data.category === 'All' || data.category === 'Explore') {
                const ownArticleIcon = (localStorage.getItem('name') === articleDetails.user.name) ? <span className="uk-align-right" uk-icon="icon: pencil; ratio: 2"></span> : '';
                filteredPosts.push(
                    <div className="uk-width-1-3@m" key={Math.random()}>
                        <div className="border border-primary border-5 uk-padding">
                            {ownArticleIcon}
                            <article className="uk-article">
                                <p className="uk-article-title">{articleDetails.title}</p>
                                <p className="article-meta">Written by <a href="#">{articleDetails.user.name}</a> {new Date(articleDetails.created_at).toISOString().split('T')[0]}</p>
                                <p className="uk-text-lead break-content">{articleDetails.content}</p>
                                <div className="row">
                                    <Link className="paper-btn" to={"/view/" + articleDetails.id} >View Article {comment}</Link>
                                </div>
                            </article>
                        </div>
                    </div>);
            }
        });
       
        
    } 
    filteredPosts = filteredPosts.length == 0 ? 'No Posts Available' : filteredPosts;
    this.setState({posts:filteredPosts})
  }
  render() {
    return (
    <div className="uk-flex-center uk-grid-medium" data-uk-grid>
        {this.state.posts}
    </div>
       
    )
  }
}

export default withRouter (Posts)
