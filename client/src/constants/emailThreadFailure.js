import React from "react";

const failureEmails = [
  (failed) => (
    <>
      <div className="contact-info">
        <div className="contact-circle alex">AL</div>
        <div className="contact-name">
          <span className="sender-name">Alex</span> <span className="sender-address">&lt;alex@aliensarereal.net&gt;</span>
        </div>
        <div className="contact-name">
          to: <span className="address">team@aliensarereal.net</span>
        </div>
      </div>
      <div className="email-content">
        <p>
          Hey team,
        </p>
        <p>
          So, team... I got captured by the FBI. On the bright side, jail is much more exciting than living alone in my apartment New York. I'm getting decent food and human interaction, everyday! (Though I really miss New York pizza. The pizza here is not the same.)
        </p>
        <p>Anyway, thank you for all your help. This is still the most exciting thing that's happened to me in years and it would not have happened without you.</p>
        <p>
          Let's quickly debrief! This is the last email they let me send so please let me know your thoughts{" "}
            <a href="//forms.gle/bYNKqATrJZBpuRAQA" target="_blank">
              here
            </a>
            .
        </p>

        <p className="sign-off">Thanks,<br/> Alex</p>
      </div>
    </>
  ),
]

export default failureEmails;
