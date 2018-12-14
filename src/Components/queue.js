import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const styles = {
  Paper: {margin: 20, padding: 10,backgroundcolor: "yellow"}
}
const theme = createMuiTheme({
  palette: {
    
    primary: { main: '#ffc107' }, // This is just green.A700 as hex.
  },
  typography: { useNextVariants: true },
});
class Questionsqueue extends Component {



    listItems = () => {
      let items = this.props.data.map((questionsData, i)=>{
        let element = <li key={questionsData.key}>
        <MuiThemeProvider theme= {theme}>
          <div>
            <Paper style={styles.Paper}>
            
          <p>{questionsData.text}</p>
          <p>VOTES:  {questionsData.votes}</p>
          <Button variant="contained" color= "primary" disabled={this.props.votes===0 } onClick={ ()=>{this.props.upvote(questionsData.key);} }>Up</Button>
            </Paper>
          </div>
          </MuiThemeProvider>
        </li>;
        return element;
      });
      return items;
    }
  
  // listItems = () => {
  //   let items = this.props.data.map((questionsData, i)=>{
  //     let element = <li key={i}>
  //       <p>{questionsData.text}</p>
  //       <p>VOTES:  {questionsData.votes}</p>
  //       <button className="btn btn-outline-info" disabled={this.props.votes==0 } onClick={ ()=>{this.props.upvote(i);} }>UP</button>
  //     </li>;
  //     return element;
  //   });
  //   return(items);
  // }

    render () {
        return (
          <ul>
            {this.listItems()}
          </ul>  
        );
    }
  
  }
export default Questionsqueue;
