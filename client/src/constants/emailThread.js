import React from "react";
const emails = [
  (_) => (
    <>
      <div className="contact-info">
        <div className="contact-circle alex">AL</div>
        <div className="contact-name">
          <span className="sender-name">Alex</span> <span className="sender-address">&lt;alex@aliensarereal.net&gt;</span>
        </div>
        <div className="contact-name">
          to: <span className="address">letters@nytimes.com</span>, <span className="address">tips@cnn.com</span>,{" "}
          <span className="address">sources@washpost.com</span>
        </div>
        <div className="contact-name">
          cc: <span className="address">team@aliensarereal.net</span>
        </div>
      </div>
      <div className="email-content">
        <p>To Whom It May Concern,</p>
        <p>
          Aliens are real and they are already here! Before you think I am some
          crazy person, I have attached evidence below. I urge you to inform the
          public. Nulla deserunt voluptate nostrud ad. Veniam veniam laboris
          fugiat proident veniam dolor. Deserunt commodo minim excepteur enim
          elit consequat consequat nostrud fugiat. Consectetur minim proident
          nisi voluptate enim elit.
        </p>
        <p>
          Some more text here. Two paragraphs seem like enough. Amet eu in
          reprehenderit commodo est officia elit aliquip velit cupidatat
          cupidatat. Enim adipisicing excepteur tempor mollit sint tempor
          cupidatat quis duis esse est.
        </p>

        <p className="sign-off">With Urgency,<br/> Alex</p>
        <div className="divider"></div>
        <h3>📎 4 Attachments</h3>
        <div className="file">
          <p>
            <img className="icon" src="/desktop/file.svg" alt="File icon" />
            translator.key
          </p>
        </div>
        <div className="file">
          <p>
            <img className="icon" src="/desktop/file.svg" alt="File icon" />
            transcript_20160103.pdf
          </p>
        </div>
        <div className="file">
          <p>
            <img className="icon" src="/desktop/file.svg" alt="File icon" />
            transcript_20160521.pdf
          </p>
        </div>
        <div className="file">
          <p>
            <img className="icon" src="/desktop/file.svg" alt="File icon" />
            journal_20151113.pdf
          </p>
        </div>
      </div>
    </>
  ),

  (_) => (
    (
      <>
        <div className="contact-info">
          <div className="contact-circle">BP</div>
          <div className="contact-name">
            From: <span className="address">letters@nytimes.com</span>
          </div>
          <div className="contact-name">
            to: <span className="address">alex@aliensarereal.net</span>
          </div>
          <div className="contact-name">
            cc: <span className="address">team@aliensarereal.net</span>
          </div>
        </div>
        <div className="email-content">
          <p>Hello Alex,</p>
          <p>
            Thank you for the info! We will post about it soonNulla deserunt
            voluptate nostrud ad. Veniam veniam laboris fugiat proident veniam
            dolor. Deserunt commodo minim excepteur enim elit consequat
            consequat nostrud fugiat. Consectetur minim proident nisi voluptate
            enim elit.
          </p>
          <p className="sign-off">Thanks,<br/> Bean D. Paquet</p>
        </div>
      </>
    ),
    (
      <>
        <div className="contact-info">
          <div className="contact-circle">BM</div>
          <div className="contact-name">
            <span className="sender-name">Bartin Maron (Washington Post)</span> <span className="sender-address">&lt;sources@washpost.com&gt;</span>
          </div>
          <div className="contact-name">
            to: <span className="address">alex@aliensarereal.net</span>
          </div>
          <div className="contact-name">
            cc: <span className="address">team@aliensarereal.net</span>
          </div>
        </div>
        <div className="email-content">
          <p>Hello Alex,</p>
          <p>
            Thank you for the info! We will post about it soonNulla deserunt
            voluptate nostrud ad. Veniam veniam laboris fugiat proident veniam
            dolor. Deserunt commodo minim excepteur enim elit consequat
            consequat nostrud fugiat. Consectetur minim proident nisi voluptate
            enim elit.
          </p>
          <p className="sign-off">Thanks,<br/> Bartin Maron</p>
        </div>
      </>
    )
  ),

  (_) => (
    <>
      <div className="contact-info">
        <div className="contact-circle">EM</div>
        <div className="contact-name">
          <span className="sender-name">Eredith Martley (CNN)</span> <span className="sender-address">&lt;tips@cnn.com&gt;</span>
        </div>
        <div className="contact-name">
          to: <span className="address">alex@aliensarereal.net</span>
        </div>
        <div className="contact-name">
          cc: <span className="address">team@aliensarereal.net</span>
        </div>
      </div>
      <div className="email-content">
        <p>Hello Alex,</p>
        <p>
          Thank you for the info! We will post about it soonNulla deserunt
          voluptate nostrud ad. Veniam veniam laboris fugiat proident veniam
          dolor. Deserunt commodo minim excepteur enim elit consequat consequat
          nostrud fugiat. Consectetur minim proident nisi voluptate enim elit.
        </p>
        <p className="sign-off">Thanks,<br/> Eredith Martley</p>
      </div>
    </>
  ),

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
          Thank you all for the help. I would not have been able to get this
          information without you.
        </p>
        {!failed && (
          <p>
            After a successful mission, I think we should quickly debrief. Let
            me know your thoughts{" "}
            <a href="//forms.gle/c5deR3t2bEucEr2z5" target="_blank">
              here
            </a>
            .
          </p>
        )}
        {failed && (
          <p>
            I think we should quickly debrief. Let me know your thoughts{" "}
            <a href="//forms.gle/bYNKqATrJZBpuRAQA" target="_blank">
              here
            </a>
            .
          </p>
        )}

        <p className="sign-off">Thanks,<br/> Alex</p>
      </div>
    </>
  ),
];

export default emails;
