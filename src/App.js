import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Questionsqueue from "./Components/queue";
import firebase from 'firebase';
import Grid from '@material-ui/core/Grid'
import {firebase_config} from './firebase_config.js';
import Button from '@material-ui/core/Button'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
firebase.initializeApp(firebase_config);


const styles = {
  centering: {margin:"auto", width:375, paddingRight:50},
  button: {justify: "center"},
  buttonSubmit: {margin:10}
}
const theme = createMuiTheme({
  palette: {
    
    primary: { main: '#ffc107' }, // This is just green.A700 as hex.
  },
  typography: { useNextVariants: true },
});
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
    console.log(questionDataPoint);
    console.log(questionDataPoint.text.toLowerCase());
    // return true;
    if (this.state.value == "" ) {
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
      <MuiThemeProvider theme={theme}>
        
      <div className="App" > 
        <div className="input-section">
          <h4>Leave a question for the class, or vote on an existing question.</h4>
          <form onSubmit={this.handleSubmit }>
            <div className="container">
              <textarea style={styles.buttonSubmit} className="form-control" id="exampleFormControlTextarea1" rows="3" disabled={this.state.numQuestions==0} placeholder="Type your question here..." value={this.state.value} onChange={this.handleChange} />
            </div>
            <Button  variant= "contained" color="primary" disabled={!this.state.value} type="submit" name="action">Submit</Button>
          </form>
          <small id="emailHelp" className="form-text text-muted">{this.state.numQuestions}/3 questions left  ·  {this.state.numVotes}/3 votes left</small>
        </div>

       <div><Questionsqueue data={this.state.questions.sort(this.compareFunction).filter(this.filterFunction)} upvote={(i) => {this.bumpQuestion(i);this.usedVote();}} votes={this.state.numVotes} questions={this.state.questions}/></div>
     </div>
     </MuiThemeProvider>
   } else if (this.state.currentPage === "main"){
     partial =
     <Grid >
     <div className="login_div" style={styles.centering}>
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
        <Grid container justify='center'>
        <button type="submit" className="btn btn-outline-warning give-padding" onClick={this.swapPage}>Login</button>
        </Grid>
      </form>

    </div>
    </Grid>

   }
    return (
      <React.Fragment>
        <svg xmlns="http://www.w3.org/1999/xlink"	width="100%" height="90">
	 <defs>
	<pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(5) translate(2) rotate(45)">
	<polygon points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2" id="hex" />
	<use href="#hex" x="25" />
	<use href="#hex" x="-25" />
	<use href="#hex" x="12.5" y="-21.7" />
	<use href="#hex" x="-12.5" y="-21.7" />
  </pattern>
	 </defs>
  <rect width="100%" height="100%" fill="url(#hexagons)" />
  </svg>
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
    </React.Fragment>
   );
 }
}

export default App;
