import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Login from "./Components/login";
import Questionsqueue from "./Components/queue";
import firebase from 'firebase';

import {firebase_config} from './firebase_config.js';
debugger
firebase.initializeApp(firebase_config);
const database = firebase.database();
class App extends Component {

  constructor (props) {
      super(props);
      this.state = {
        questions:[
          // {
          //   text: "Why did the Industrial Revolution originate in Britian?",
          //   votes: 0,
          //   key: 0
          // },
          // {
          //   text: "How come China failed to industrialize in the 19th century?",
          //   votes: 0,
          //   key: 1
          // },
          // {
          //   text: "Examples of Qing dynasty inventions?",
          //   votes: 0,
          //   key: 2
          // },
        ],
        data: [],
        value: "",
        currentPage: "main",
        numQuestions: 3,
        numVotes: 3
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.usedVote = this.usedVote.bind(this);
  }

  pushToDB(path, data){
    let reference = database.ref(path);
    var newPostRef= reference.push();
    newPostRef.set(data);
  }

  componentDidMount() {
    let reference = database.ref("Question Directory");
    reference.on("child_added", (newData) =>{  
      let key = newData.key;
      let value = newData.val();
      let dataPoint = {
        key: key,
        text: value.text,
        votes: value.votes
      }
      this.setState({
        questions: this.state.questions.concat( [ dataPoint ] )
      })
    });
    reference.on("child_changed", (changedData) =>{  
      console.log("CHILD CHANGED@!")
      console.log(changedData);
      let key = changedData.key;
      let value = changedData.val();
      console.log(key);
      console.log(value);
      // let stateIndexOfChangedChild = this.state.questions.findIndex(element=>{
      //   return element.key == key;
      // })
      // console.log(stateIndexOfChangedChild);

      let newQuestions = this.state.questions.map(question => {
        if(question.key == key){
          question.votes = value.votes;
          return question;
        }else{
          return question;
        }
      });


      // let dataPoint = {
      //   key: key,
      //   text: value.text,
      //   votes: value.votes
      // }
      this.setState({
        questions: newQuestions
      })
    })
  }
 

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  addQuestion = (newQuestion) => {
    // let updateQuestions = this.state.questions;
    let x = {
      text: newQuestion,
      votes: 1
    }
    // updateQuestions.push(x);

    this.pushToDB("Question Directory", x);
  }


  handleSubmit(event) {
    event.preventDefault()
    this.addQuestion(this.state.value)
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

  bumpQuestion = (dbKey) => {
    // here we awant a transaction\
    // to add one to the vites of this question to whatever 
    // its votes may be right now( we do this anticipating
    // that two people might click vote at the same very moment)
    
    let reference = database.ref("Question Directory/"+dbKey+"/votes");
    reference.transaction(function(thisQuationosVotes) {
      thisQuationosVotes += 1;
      return thisQuationosVotes;
    });


    // let updateQuestions = this.state.questions;
    // updateQuestions[i].votes = this.state.questions[i].votes + 1;
    // this.setState({
    //   questions: updateQuestions
    // });
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
        <div className="input-section">
          <h4>Leave a question for the class, or vote on an existing question.</h4>
          <form onSubmit={this.handleSubmit }>
            <div className="container">
              <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" disabled={this.state.numQuestions==0} placeholder="Type your question here..." value={this.state.value} onChange={this.handleChange} />
            </div>
            <button className="btn btn-outline-warning give-padding" disabled={!this.state.value} type="submit" name="action">Submit</button>
          </form>
          <small id="emailHelp" className="form-text text-muted">{this.state.numQuestions}/3 questions left  ·  {this.state.numVotes}/3 votes left</small>
        </div>

       <div><Questionsqueue data={this.state.questions.sort(this.compareFunction).filter(this.filterFunction)} upvote={(i) => {this.bumpQuestion(i);this.usedVote();}} votes={this.state.numVotes} questions={this.state.questions}/></div>
     </div>
   } else if (this.state.currentPage === "main"){
     partial =
     <div className="login_div">
      <h3>{"Welcome to HiveMind."}</h3>
      <h6>{"Please login to your student or professor account."}</h6>
      <br></br>

      <form>
        <div className="form-group">
          {/* <label for="exampleInputEmail1">Username</label> */}
          <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="NetID"></input>
        </div>
        <div className="form-group">
          {/* <label for="exampleInputPassword1">Password</label> */}
          <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"></input>
          <small id="emailHelp" className="form-text text-muted">Never share your password with anyone else.</small>
        </div>
        <button type="submit" className="btn btn-outline-warning give-padding" onClick={this.swapPage}>Login</button>
      </form>

    </div>

   }
    return (
      <div>
        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand" href="#">
          <img src={logo} width="30" height="30" className="d-inline-block align-top" alt=""></img>
          HiveMind
          </a>
          <span className="navbar-text">For classroom success ©</span>
        </nav>
        <div>{partial}</div>
      </div>
   );
 }
}

export default App;
