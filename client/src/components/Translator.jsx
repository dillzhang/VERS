import React, { Component } from 'react';
import "./Translator.css";
import "./TranslatorKey.css";

class Translator extends Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
    this.state = {
      input: "",
      translation: {
        0: { alien: "§", english: "" },
        1: { alien: "Œ", english: "" },
        2: { alien: "Ƕ", english: "" },
        3: { alien: "Ϭ", english: "" },
        4: { alien: "Ҩ", english: "" },
        5: { alien: "Ӌ", english: "" },
        6: { alien: "Ա", english: "" },
        7: { alien: "Հ", english: "" },
        8: { alien: "Մ", english: "" },
        9: { alien: "Վ", english: "" },
        10: { alien: "ل", english: "" },
        11: { alien: "९", english: "" },
        12: { alien: "చ", english: "" },
        13: { alien: "ට", english: "" },
        14: { alien: "Ჯ", english: "" },
        15: { alien: "ហ", english: "" },
        16: { alien: "Ỽ", english: "" },
        17: { alien: "‡", english: "" },
        18: { alien: "‰", english: "" },
        19: { alien: "⅋", english: "" },
        20: { alien: "↻", english: "" },
        21: { alien: "∂", english: "" },
        22: { alien: "∫", english: "" },
        23: { alien: "◊", english: "" },
        24: { alien: "Ɱ", english: "" },
        25: { alien: "⑃", english: "" }
      }
    }

    this.socket.on("translatorUpdate", ({ key, i }) => {
      this.setState(state => {
        return {
          translation: {
            ...state.translation,
            [key]: {
              ...state.translation[key],
              english: i,
            },
          }
        }
      });
    })
  }

  getTranslation() {
    return Object.keys(this.state.translation).reduce(
      (acc, cur) => {
        const entry = this.state.translation[cur];
        if (entry.english.trim().length > 0)
          return acc.replaceAll(entry.alien, entry.english);
        return acc;
      }, this.state.input
    )
  }

  getDuplicates() {
    const dupArr = Object.values(
      Object.keys(this.state.translation).reduce(
        (acc, cur) => {
          const entry = this.state.translation[cur];
          if (entry.english.trim().length > 0) {
            if (!acc.hasOwnProperty(entry.english)) {
              acc[entry.english] = [];
            }
            acc[entry.english].push(cur);
          }
          return acc;
        }, {}
      )
    )
      .filter(l => l.length > 1)
      .reduce((acc, cur) => acc.concat(cur), []);
    return new Set(dupArr);
  }

  render() {
    const dups = this.getDuplicates();
    return (<div className="translator">
      <div className="translator-section">
        <textarea
          className="input-box translator-box"
          type="text"
          placeholder="Input"
          value={this.state.input}
          onChange={
            (e) => this.setState({ input: e.target.value.toUpperCase() })
          }></textarea>
        <textarea
          className="output-box translator-box"
          placeholder="Translation"
          readOnly
          value={this.getTranslation()}></textarea>
      </div>
      <div className="translator-section key">
        <div className="translation_key">
          {Object.keys(this.state.translation).map(key => {
            const entry = this.state.translation[key];
            return (
              <div key={'keyBar-' + key} className='entry_container'>
                <input
                  className='entry_child alien'
                  type="text"
                  readOnly
                  value={entry.alien} />
                <p className="entry_index">{parseInt(key) + 1}</p>
                <p className="arrow">&#8594;</p>
                <input
                  className={`entry_child english${dups.has(key) ? " dup" : ""}`}
                  type="text"
                  value={entry.english}
                  maxLength="1"
                  onChange={e => {
                    const i = e.target.value.toUpperCase();
                    this.setState(state => {
                      return {
                        translation: {
                          ...state.translation,
                          [key]: {
                            ...state.translation[key],
                            english: i,
                          },
                        }
                      }
                    }, () => { this.socket.emit("translatorUpdate", { key, i, room: this.props.roomCode }) })
                  }} />
              </div>)
          })}
        </div>
        <div className={"button"} onClick={(e) => {
                            e.target.disabled = true;
                            this.props.socket.emit("translation-key", {
                                roomCode: this.props.roomCode,
                                sender: this.props.sender,
                                color: this.props.color,
                                translation: this.state.translation,
                            });
                            const button = e.target;
                            setTimeout(() => {
                                button.disabled = false;
                            }, 1000);
        }}>
          Export to Chat <img src="/desktop/send.svg" alt="Send icon" />
        </div>
      </div>
    </div>)
  }
}

export default Translator;