import React, {Component} from 'react';
class Questionsqueue extends Component {


    listItems = () => {
      let items = this.props.data.map((questionsData, i)=>{
        let element = <li key={questionsData.key}>
          <p>{questionsData.text}</p>
          <p>VOTES:  {questionsData.votes}</p>
          <button disabled={this.props.votes==0 } onClick={ ()=>{this.props.upvote(questionsData.key);} }>Up</button>
        </li>;
        return element;
      });
    }
  
  listItems = () => {
    let items = this.props.data.map((questionsData, i)=>{
      let element = <li key={i}>
        <p>{questionsData.text}</p>
        <p>VOTES:  {questionsData.votes}</p>
        <button className="btn btn-outline-info" disabled={this.props.votes==0 } onClick={ ()=>{this.props.upvote(i);} }>UP</button>
      </li>;
      return element;
    });
    return(items);
  }

    render () {
        return (
          <ul ref="list">
            {this.listItems()}
          </ul>
        );
    }
  
  }
export default Questionsqueue;
