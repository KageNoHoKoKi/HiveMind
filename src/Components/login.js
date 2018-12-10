import React, {Component} from 'react';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage:"login"
    };

  }

  render () {
    return (
      <div>
        <input className="text_field" type="text" value={this.state.value} onChange={this.state.change}></input>
        <br></br>
        <input type="button" value="Submit" onClick={this.props.add}></input>
      </div>
    );
  }
}
export default Login;
