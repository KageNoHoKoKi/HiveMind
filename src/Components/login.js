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
      <div style={styles.centering}>
        <input className="text_field" type="text" value={this.state.value} onChange={this.state.change}></input>
        <input type="button" value="Submit" onClick={this.props.add}></input>
      </div>
    );
  }
}

const styles = {
  centering: {margin:"auto"}
}
export default Login;
