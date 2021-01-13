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
    <p>
      Thanks to generous support from the Council for the Arts at MIT (CAMIT), we're now running an IAP 2021 production of VERS for the MIT community! Tickets are now available for shows Jan 15 - Feb 7.
    </p>
    <img src="/show-image.png" />
    <h2>What to Expect</h2>
    <p>
      You'll join a Zoom call with Alex and 1-2 of your friends. Then, Alex will set you up with web-based custom virtual desktops designed for your mission. Solving the puzzles will require navigating your virtual desktop, as well as communicating with Alex over the call.
    </p>
    <p>
      The full experience lasts for approximately 80 minutes, including the show and a post-mission debrief with your actor.
    </p>
    <p>
      For more details about the show, visit our <a href="/faq">FAQ page</a>. 
    </p>
    <h2>How to Sign Up</h2>
    <p>Buy one (1) ticket for your team on our <a href="//www.eventbrite.com/e/the-vers-project-iap-2021-tickets-134944872747" target="_blank">Eventbrite page</a>. You will be able to input your teammates' information in the order form. Then, you'll all get an email from Alex with the Zoom link in the days leading up to your mission.</p>
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
    
    <h3>Players Per Team</h3>
    <p>2-3 players. We cap teams at 3 players to ensure that each player can have meaningful engagement with the puzzles.</p>
    
    <h3>Runtime</h3>
    <p>80 minutes, including the show and a post-mission debrief with your actor.</p>
    
    <h3>Beginner-friendly</h3>
    <p>VERS is designed to be a beginner-friendly experience! No actual programming or hacking is involved. There will be some arithmetic, so we would recommend players be ages 13+ or comfortable with algebra.</p>
    
    <h3>Technical Requirements</h3>
    <p>You will need <a href="//zoom.us/download">Zoom</a> and the latest version of <a href="//google.com/chrome">Chrome</a> or <a href="//support.apple.com/downloads/safari">Safari</a>. Unfortunately, VERS does not work in Firefox.</p>
    
    <h3>Accessibility</h3>
    <p>You will need to read, type, and click and drag elements on a screen. You will also need to listen and speak to Alex over the Zoom call, which will primarily be through audio.</p>
    <p>If one or more members of your team are hard of hearing and would prefer text-based communication, let us know before your show at <a href="mailto:versproject@mit.edu">versproject@mit.edu</a> so that we can ask your actor to deliver dialogue over chat. You may also contact us with any other accessibililty questions.</p>

    <h3>What does VERS stand for?</h3>
    <p>The V.E.R.S. Project started off as a summer project over quarantine, so it stands for "Virtual Escape Room Summer" Project. It was originally meant to be a working title, but we decided to keep it!</p>

    <h3>How did you come up with VERS?</h3>
    <p>We got the idea for VERS in the MIT theatre class 21M.737 (Interactive Design and Projection for Live Performance), taught by Joshua Higgason. When the class went online due to the COVID-19 pandemic, we wondered how we could design a live interactive performance specifically for Zoom. We were intrigued by the idea we came up with for our final project and decided to continue exploring it over the summer. The summer project became VERS.</p>

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