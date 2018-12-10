import React, {Component} from 'react';
class Questionsqueue extends Component {
  componentDidUpdate(){
    let listElement = this.refs.list;
    let listItem = listElement.lastChild;
    if(listItem!=null){
      listElement.scrollTo({
        top: listItem.offsetTop,
        left: 0,
        behavior: 'smooth'
      });
    }
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
