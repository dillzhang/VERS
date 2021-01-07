import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'

const showPageContent = (
  <>
    <h1 className="title">The Show</h1>
    <p>
      The V.E.R.S. Project is a live virtual interactive sci-fi adventure about an alien conspiracy theorist, Alex,
      who enlists the help of a team of remote hackers to break into Area 51. Through an innovative blend of escape
      rooms and immersive theatre, players work together to solve challenges and determine the fate of Alex’s mission —
      all from the comfort of their own rooms.
    </p>
    <img src="/show-image.png" />
    <h2>What to Expect</h2>
    <p>
      VERS is designed for teams of 2-3 players ("hackers") and takes place in a Zoom call and your web browser, using a simulated desktop. The puzzles are
      story-driven and will require navigating your virtual desktop, as well as communicating with Alex on the call.
    </p>
    <p>
      The full experience lasts for 80-90 minutes, including the show and a post-mission debrief with your actor.
    </p>
    <p>
      VERS is a beginner-friendly experience! No programming or hacking experience is necessary to play.
    </p>
    <h2>How to Sign Up</h2>
    <p>Recruit 1-2 fellow hackers to join you, and then buy one (1) ticket for your team on our <a href="//www.eventbrite.com/e/the-vers-project-iap-2021-tickets-134944872747" target="_blank">Eventbrite page</a>. You will be able to input your teammates' information in the order form. Then, you'll all get an email from Alex with the Zoom link in the days leading up to your mission.</p>
  </>
  );


const teamPageContent = (
  <>
    <h1 className="title">The VERS Team</h1>
    <p>VERS is proudly produced by a fully remote team across multiple time zones and MIT class years.</p>
    <table>
      <tr>
        <td className="position">Creative Director</td>
        <td className="name">Shannon Peng '20</td>
      </tr>
      <tr>
        <td className="position">Technical Director</td>
        <td className="name">Dillon Zhang '20</td>
      </tr>
      <tr>
        <td className="position">Software Engineer</td>
        <td className="name">Anand Tyagi (NYU) </td>
      </tr>
    </table>
    <table>
      <tr>
        <td className="position">Alex</td>
        <td className="name">Elliott Barnhill '22</td>
      </tr>
      <tr>
        <td className="position">Alex</td>
        <td className="name">Joseph Noszek '20/MST '22</td>
      </tr>
      <tr>
        <td className="position">Alex</td>
        <td className="name">Hannah DeRusha '12</td>
      </tr>
      <tr>
        <td className="position">Alex</td>
        <td className="name">Mary Dahl '20/G</td>
      </tr>
      <tr>
        <td className="position">Alex</td>
        <td className="name">Nelson Niu '21</td>
      </tr>
      <tr>
        <td className="position">Alex</td>
        <td className="name">Phoebe Piercy '20/MEng '21</td>
      </tr>
      <tr>
        <td className="position">Alex</td>
        <td className="name">Rian Flynn '21</td>
      </tr>
      <tr>
        <td className="position">Alex</td>
        <td className="name">Schuyler Gaillard '17</td>
      </tr>
    </table>
    <h3>Sponsors</h3>
    <p>
      Our IAP 2021 production of The V.E.R.S. Project is generously funded by the
      Council for the Arts at MIT (CAMIT).
    </p>
    <h3>Special Thanks</h3>
    <p>
      Special thanks to Joshua Higgason, Kevin Fulton, and MIT Next Haunt Exec for
      their support throughout our project journey!
    </p>
  </>
  );


const faqPageContent = (
  <>
    <h1 className="title">FAQ</h1>
    <h3>How many players per team?</h3>
    <p>2-3 players. We cap teams at 3 to ensure that each player can have meaningful engagement wth the puzzles.</p>
    <h3>How long does VERS last?</h3>
    <p>80-90 minutes. This includes the show and a short post-mission debrief with your actor.</p>
    <h3>Do I need hacking/programming experience?</h3>
    <p>Nope! VERS is a beginner-friendly experience.</p>
    <h3>Do I need to prepare anything before the show?</h3>
    <p>Just make sure you're using the latest version of <a href="//zoom.us/download" target="_blank">Zoom</a> and your preferred web browser.</p>
    <h3>How does VERS work?</h3>
    <p>We're working on documenting this. In the meantime, you can read our writeup on <a href="//shannonpeng.com/projects/zooming-away">Zooming Away</a>, the precursor to VERS. It uses a very similar setup and much of the same technology as VERS.</p>
    <p>Still got questions? Feel free to contact us at <a href="mailto:versproject@mit.edu">versproject@mit.edu</a>.</p>
  </>
  );

const contactPageContent = (
  <>
    <h1 className="title">Contact</h1>
    <p>You can reach us with any questions at <a href="mailto:versproject@mit.edu">versproject@mit.edu</a>. We look forward to hearing from you!</p>
  </>
  );

class Home extends Component {
  constructor(props) {
    super(props);
    var p = this.props.page || "show";
    this.state = {
      page: p,
      pageContent: '',
    }
  }

  componentDidMount = () => {
    this.getPageContent(this.state.page);
  }

  getPageContent = (p) => {
    switch(p) {
      case "show":
        this.setState({ page: p, pageContent: showPageContent });
        break;
      case "team":
        this.setState({ page: p, pageContent: teamPageContent });
        break;
      case "faq":
        this.setState({ page: p, pageContent: faqPageContent });
        break;
      case "contact":
        this.setState({ page: p, pageContent: contactPageContent });
        break;
    }
  }

  render() {
    return (
    <div className="App home">
      <div className="header">
        <h1 className="title"><a href="/">The V.E.R.S. Project</a></h1>
      </div>
      <a href="//www.eventbrite.com/e/the-vers-project-iap-2021-tickets-134944872747" target="_blank"><div className="ticketsButton">Buy Tickets &#10145;</div></a>
      <div className="folder">
        <ul className="nav">
          <Link to="/" className={"tab " + ( this.state.page === "show" ? "active" : "" )} onClick={ () => this.getPageContent("show") }>The Show</Link>
          <Link to="/team" className={"tab " + ( this.state.page === "team" ? "active" : "" )} onClick={ () => this.getPageContent("team") }>team</Link>
          <Link to="/faq" className={"tab " + ( this.state.page === "faq" ? "active" : "" )} onClick={ () => this.getPageContent("faq") }>FAQ</Link>
          <Link to="/contact" className={"tab " + ( this.state.page === "contact" ? "active" : "" )} onClick={ () => this.getPageContent("contact") }>Contact</Link>
        </ul>
        <div className="file">
          <div className="content">
            { this.state.pageContent }
          </div>
        </div>
      </div>
      <div className="footer">
        &copy; 2020 The V.E.R.S. Project
      </div>
    </div>
    );
  }
}
export default Home;