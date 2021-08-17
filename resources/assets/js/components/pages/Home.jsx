import axios from 'axios';
import React from 'react';
import Navbar from '../sections/Navbar';
import Posts from '../sections/Posts';
class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name:'',
      id:'',
      articles:[],
      category:'All',
      search:''
    }
   this.fetchArticleData = this.fetchArticleData.bind(this);
   this.fetchUserData = this.fetchUserData.bind(this);
   this.searchArticle = this.searchArticle.bind(this);
  }
  
  //Article on the API on load
  componentDidMount() {
    this.fetchArticleData();
  }
  //Saves current user data for the page
  fetchUserData(userData) {
    this.setState({name:userData.user.name, id: userData.user.id});
  }
  //Fetch all Article data
  async fetchArticleData() {
    await axios.get('/api/getArticles').then(response => {  
      this.setState({articles:response.data});
    });
  }
  //Retrieve an article based on the search input
  async searchArticle(e){
    await axios.post('/api/getArticleByTitle', {title:e.target.value}).then(response => {  
      if(response.data.length > 0) {
         this.setState({articles:response.data});
      }
    });  
  }

  render() {
    return (
      <div className="uk-padding-small ">
      <Navbar sendData={this.fetchUserData}/>
        <div className="uk-align-center">
          <div className="uk-text-center"><h3>Articles /{this.state.category}</h3></div>
            <div className="uk-flex uk-flex-center" data-uk-grid>
            <ul className="breadcrumb border border-white padding-breadcrumb ">
                <li><a onClick={()=>{this.setState({category:'All'})}}>All</a></li>
                <li><a onClick={()=>{this.setState({category:'Programming'})}}>Programming</a></li>
                <li><a onClick={()=>{this.setState({category:'Science'})}}>Science</a></li>
                <li><a onClick={()=>{this.setState({category:'Design'})}}>Design/</a></li>
              </ul>
              <input className="border-white padding-none searchbox" onFocus={()=>{this.setState({category:'Explore'})}}  onChange={(e)=>{this.searchArticle(e)}} type="text" name='Search' placeholder="Explore"/>
          </div>
          <Posts key={[this.state.category, this.state.search, this.state.articles.length]} homeStateData={this.state} />
        </div>
      </div>
    )
  }
}

export default Home
