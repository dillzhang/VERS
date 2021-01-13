import React, { Component } from "react";

import "./VaultDoor.css";

const questions = [
  {
    question: "What is your mother's maiden name?",
    answer: "Carrigan",
    soundId: "S5_keypad_carrigan_8",
    duration: 2700,
  },
  {
    question: "What street did you live on as a child?",
    answer: "Charmaine Lane",
    soundId: "S5_keypad_charmainelane_14",
    duration: 5200,
  },
  {
    question: "What is your zip code?",
    answer: "79345",
    soundId: "S5_keypad_zipcode_5",
    duration: 2000,
  },
  {
    question: "Since when were you employed?",
    answer: "2013",
    soundId: "S5_keypad_year_4",
    duration: 1500,
  },
  {
    question: "What was the name of your childhood pet?",
    answer: "Oakley",
    soundId: "S5_keypad_id_number_6",
    duration: 2000,
  },
  {
    question: "What is your phone number ending in 0616?",
    answer: "+1 (555)-896-0616",
    soundId: "S5_keypad_phonenumber_10",
    duration: 4000,
  },
  {
    question: "In what city does your nearest sibling live?",
    answer: "Austin",
    soundId: "S5_keypad_austin_5",
    duration: 2000,
  },
  {
    question: "In what city did you meet your spouse/significant other?",
    answer: "Austin",
    soundId: "S5_keypad_austin_5",
    duration: 2000,
  },
];

class VaultDoor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      questionIndex: 0,
      timerId: -1,
      timeRemaing: 30,
      correctGuard: false,
      message: "",
    };
  }
  render() {
    return (
      <div className="vault-door">
        <h1>Vault Door</h1>
        {this.renderQuestion()}
      </div>
    );
  }

  getTime = () => {
    const now = Date.now();
    if (this.endTime && this.endTime >= now) {
      this.setState(
        { timeRemaing: Math.ceil((this.endTime - now) / 1000) },
        () => {
          this.timeOutId = setTimeout(this.getTime, 470);
        }
      );
    } else {
      this.setState({ message: "You ran out of time.", questionIndex: 0 });
    }
  };

  renderQuestion = () => {
    switch (this.state.questionIndex) {
      case 0:
        return (
          <>
            <div className="question">Enter your ID number:</div>
            <div className="answer">
              <button
                onClick={() => {
                  this.props.globalPlaySound("S5_keypad_id_number_6");
                  setTimeout(() => {
                    this.setState({ correctGuard: true, questionIndex: 1 });
                  }, 1800);
                }}
              >
                EI1120
              </button>
              <button
                onClick={() => {
                  this.props.globalPlaySound("S5_keypad_id_number_6");
                  setTimeout(() => {
                   this.setState({ correctGuard: false, questionIndex: 1 });
                  }, 1800);
                }}
              >
                Other
              </button>
            </div>
            {this.state.message && (
              <div className="question alert">{this.state.message}</div>
            )}
          </>
        );
      case 1:
        return (
          <>
            <div className="question">Password or Recover Password:</div>
            <div className="answer">
              <button
                onClick={() => {
                  this.props.globalPlaySound("S5_keypad_press_1");
                  setTimeout(() => {
                    this.props.globalPlaySound("S5_30_beeps");
                    this.endTime = Date.now() + 30 * 1000;
                    this.getTime();
                    this.setState({
                      questionIndex: 2,
                      questions: [...questions]
                        .sort((a, b) => Math.random() - 0.5)
                        .slice(0, -3),
                    });
                  }, 1000);
                }}
              >
                Recover
              </button>
              <button
                onClick={() => {
                  this.props.globalPlaySound("S5_keypad_press_1");
                  setTimeout(() => {
                    this.props.globalPlaySound("S5_access_denied");
                    this.setState({
                    questionIndex: 0,
                    message: "That password was incorrect!",
                  });
                  }, 1000);
                }}
              >
                Incorrect
              </button>
            </div>
          </>
        );
      case 2:
      case 3:
      case 4:
        const question = this.state.questions[this.state.questionIndex - 2];
        return (
          <>
            <div className="question">{question.question}</div>
            <div className="answer">
              {this.state.correctGuard && (
                <button
                  onClick={() => {
                    this.props.globalPlaySound(question.soundId);
                    console.log(question.question);
                    console.log(question.soundId);
                    console.log(question.duration);
                    setTimeout( () => {
                      if (this.state.questionIndex === 4) {
                        clearTimeout(this.timeOutId);
                        this.props.globalStopSound("S5_30_beeps");
                        this.props.globalPlaySound("S5_unlock");
                      }
                      this.setState((state) => ({
                        questionIndex: state.questionIndex + 1,
                      }));
                    }, question.duration);
                  }}
                >
                  {question.answer}
                </button>
              )}
              <button
                onClick={() => {
                  this.props.globalPlaySound(question.soundId);
                  setTimeout(()=>{
                    this.props.globalStopSound("S5_30_beeps");
                    this.props.globalPlaySound("S5_access_denied");
                    this.setState({
                      questionIndex: 0,
                      message: "That answer was incorrect!",
                    });
                    clearTimeout(this.timeOutId);
                  }, question.duration);
                }}
              >
                Wrong Answer
              </button>
            </div>
            <div className="answer">
              <p>Question: {this.state.questionIndex - 1} / 3</p>
              <p>Time Remaining: {this.state.timeRemaing}</p>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <div className="question">
              Password Reset! Enter the vault when ready.
            </div>
            <div className="answer">
              <button
                className="complete"
                onClick={() => {
                  this.props.socket.emit("setRoomState", {
                    roomCode: this.props.room,
                    state: 60,
                  });
                }}
              >
                Enter the Vault
              </button>
            </div>
          </>
        );
      default:
        return <>Error: Invalid question index</>;
    }
  };
}

export default VaultDoor;
