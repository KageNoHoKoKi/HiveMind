import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Login from "./Components/login";
import Questionsqueue from "./Components/queue";
import firebase from 'firebase';
import {firebase_config} from './firebase_config.js';
firebase.initializeApp(firebase_config);
const database = firebase.database();
class App extends Component {

  constructor (props) {
      super(props);
      this.state = {
        questions:[
          {
            text: "Why did the Industrial Revolution originate in Britian?",
            votes: 0
          },
          {
            text: "How come China failed to industrialize in the 19th century?",
            votes: 0
          },
          {
            text: "Examples of Qing dynasty inventions?",
            votes: 0
          },
        ],
        data: [],
        value: "",
        currentPage: "main",
        numQuestions: 3,
        numVotes: 3
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.submittingButton = this.submittingButton.bind(this);
      this.usedVote = this.usedVote.bind(this);
  }

  pushToDB(path, data){
    // Level 1 - read this if you are coming here from Levels/LevelONE.js
    // 
    // this is where want to create a simple function to push data to
    // our Firebase project. To test the function, we use a dummy 
    // button in this very component (prepared below)


    // we can learn how to push to the database from here:
    // https://firebase.google.com/docs/database/web/lists-of-data
    let reference = database.ref(path);
    var newPostRef= reference.push();
    newPostRef.set(data);
  }

  componentDidMount() {
    let reference = database.ref("data");
    reference.on("child_added", (newData) =>{
    
      console.log(this.state.data);
      this.setState({
        data: this.state.data.concat( [ newData.val()] )
      })
    })
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  addQuestion = (newQuestion) => {
    let updateQuestions = this.state.questions;
    let x = {
      text: newQuestion,
      votes: 0
    }
    updateQuestions.push(x);
    this.setState({
      questions: updateQuestions
    })
    this.pushToDB("Question Directory",newQuestion);
  }

  submittingButton = () => this.addQuestion(this.state.value)
  handleSubmit(event) {
    event.preventDefault()
    this.submittingButton()
    let totalQuestions = this.state.numQuestions;
    if (totalQuestions > 0) {
      totalQuestions -= 1;
      this.setState({
        numQuestions: totalQuestions
      });
    } else if (totalQuestions == 0){
      this.setState({
        numQuestions: 0
      });
    }

    this.setState({
      value: ""
    })
  }

  bumpQuestion = (i) => {
    let updateQuestions = this.state.questions;
    updateQuestions[i].votes = this.state.questions[i].votes + 1;
    this.setState({
      questions: updateQuestions
    });
  }

  compareFunction = (questionObjectA,questionObjectB) => {
    return questionObjectB.votes - questionObjectA.votes
  }
  sortQuestions = () => {
    let sortedQuestions = this.state.questions;
    sortedQuestions.sort(this.compareFunction);
    console.log(sortedQuestions);
    this.setState({
      questions: sortedQuestions
    });
  }

  filterFunction = (questionDataPoint) => {
    if (this.state.value == "") {
      return true

    } else {
      let sent1items = this.state.value.toLowerCase().split(" ");
      let sent2items = questionDataPoint.text.toLowerCase().split(" ");

      for(let i = 0; i <sent1items.length; i++){
        let sent1item = sent1items[i];
        if(sent2items.includes(sent1item)){
          return true;
        }
      }
    }
  }

  swapPage = () => {
    this.setState({currentPage:"login"});
  }


  usedVote = () => {
    let totalVotes = this.state.numVotes;
    if (totalVotes > 0) {
      totalVotes -= 1;
      this.setState({
        numVotes: totalVotes
      });
    } else if (totalVotes == 0){
      this.setState({
        numVotes: 0
      });
    }
  }

  render() {
    var partial;
    if (this.state.currentPage === "login") {
      partial =
      <div className="App">
        <h1>Hello!</h1>
        <h2>Feel free to leave a question, or vote on a question.</h2>
        <p>{this.state.numVotes}/3 votes left!</p>
        <p>{this.state.numQuestions}/3 questions left!</p>


        <form onSubmit={this.handleSubmit }>
          <div className="container">
            <textarea disabled={this.state.numQuestions==0} className="box" label="Ask a question!" value={this.state.value} onChange={this.handleChange} /> <br />
            <br/>
          </div>
          <button disabled={!this.state.value} type="submit" name="action">Submit</button>
        </form>

       <div><Questionsqueue data={this.state.questions.sort(this.compareFunction).filter(this.filterFunction)} upvote={(i) => {this.bumpQuestion(i);this.usedVote();}} votes={this.state.numVotes}/></div>
     </div>
   } else if (this.state.currentPage === "main"){
     partial =
     <div>
      <h1>{"Hello, please login to your student or professor account below using your NetID."}</h1>
      <form>
        <input type="text" />
        <br></br>
        <input className="next_button" type="submit" value="Login" onClick={this.swapPage}/>
      </form>
    </div>

   }

    return (
      <div>
        <h1>HiveMind</h1>
        <div>{partial}</div>
      </div>
   );
 }
}

export default App;
