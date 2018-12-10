import React, {Component} from 'react';
class Questionsqueue extends Component {
  componentDidUpdate(){ 
    // componentDidUpdate() is a function react gives us. 
    // it is triggered every time the component was updated
    // that is usually the case when either this.state or this.props
    // changed. For that reason we SHOULD NOT ever this.setState inside 
    // componentDidUpdate(), otherwise we would be creating and infinite
    // loop.... you know what I mean?
   
    // we can give a "reference" to elements in order to 
    // select it more easily in our javaScript.
    // add "ref='list'" to the <ul> element above
    let listElement = this.refs.list;
    // here we 'grab' the element we want to scroll to
    // it's the list's 'last child'
    let listItem = listElement.lastChild;
    // this is just some javaScript tool
    // that allows us to define where an element should 
    // scroll to. as a destination we use the 
    // "offsetTop" property that any html element has
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
        let element = <li key={questionsData.key}>
          <p>{questionsData.text}</p>
          <p>VOTES:  {questionsData.votes}</p>
          <button disabled={this.props.votes==0 } onClick={ ()=>{this.props.upvote(questionsData.key);} }>Up</button>
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
