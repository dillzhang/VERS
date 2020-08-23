import React, { Component } from 'react';
import './Home.css'


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
    }
  }

  render() {
    return (
    <div className="App home">
      <div className="content">
        <img className="logo" src="/logo192.png" />
        <h1>The VERS Project</h1>
        <p>Want to help me break into Area 51? Let's get in touch through <a href="//forms.gle/Hhr7qJDJYA21iFAx7">this form</a>.</p>
        <h3>Core Conspiracists</h3>
        <ul>
          <li>@lex</li>
          <li>Shannon Peng</li>
          <li>Dillon Zhang</li>
          <li>Anand Tyagi</li>
        </ul>
        <h3>Fact Checkers</h3>
        <ul>
          <li>Diana Huang</li>
          <li>Willy Wu</li>
          <li>Tiana</li>
          <li>Justin</li>
          <li>Pranav</li>
          <li>Kaitlyn</li>
        </ul>
        <h6>With special thanks to <a href="//next.mit.edu/haunt/">MIT Next Haunt</a></h6>
      </div>

    </div>
    );
  }
}
export default Home;