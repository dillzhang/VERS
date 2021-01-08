import React, { Component } from "react";
import "./Translator.css";
import "./TranslatorKey.css";

const correctTranslationKey = {
  0: { alien: "§", english: "Y" },
  1: { alien: "Œ", english: "X" },
  2: { alien: "Ƕ", english: "Q" },
  3: { alien: "Ϭ", english: "E" },
  4: { alien: "Ҩ", english: "F" },
  5: { alien: "Ӌ", english: "J" },
  6: { alien: "Ա", english: "G" },
  7: { alien: "Հ", english: "M" },
  8: { alien: "Մ", english: "N" },
  9: { alien: "Վ", english: "O" },
  10: { alien: "ل", english: "R" },
  11: { alien: "९", english: "C" },
  12: { alien: "చ", english: "H" },
  13: { alien: "ට", english: "A" },
  14: { alien: "Ჯ", english: "K" },
  15: { alien: "ហ", english: "L" },
  16: { alien: "Ỽ", english: "I" },
  17: { alien: "‡", english: "" },
  18: { alien: "‰", english: "W" },
  19: { alien: "⅋", english: "B" },
  20: { alien: "↻", english: "P" },
  21: { alien: "∂", english: "U" },
  22: { alien: "∫", english: "T" },
  23: { alien: "◊", english: "V" },
  24: { alien: "Ɱ", english: "S" },
  25: { alien: "⑃", english: "D" },
};

class Translator extends Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
    this.state = {
      input: this.props.host
        ? `ហට⅋վلට∫վل§ ⱮϬ∫∂↻ ९վհ↻ហϬ∫Ϭ. ටҨ∫Ϭل 𝟠ϬϬհỼմԱ մϬ‰ §վلჯ ९Ỽ∫§ Ỽմ९վհ↻ට∫Ỽ⅋ហϬ, ‰Ϭ చට◊Ϭ ϬⱮ∫ට⅋ហỼⱮచϬ𝟠 վ∂ل చϬට𝟠Ƕ∂ටل∫ϬلⱮ Ỽմ ‰చට∫ ∫చϬ Ϭටل∫చ Ỽմచට⅋Ỽ∫ටմ∫Ɱ ९ටហហ մϬ◊ට𝟠ට, ∂մỼ∫Ϭ𝟠 Ɱ∫ට∫ϬⱮ. చϬلϬ ∫చϬلϬ ỼⱮ ↻ហϬմ∫§ վҨ վ↻Ϭմ ∫ϬللỼ∫վل§ Ҩվل ϬŒ↻ϬلỼհϬմ∫ට∫Ỽվմ, ටմ𝟠 ‰Ϭ ටلϬ ҨلϬϬ վҨ ∫చϬ ९վմⱮ∫ටմ∫ Ɱ९ل∂∫Ỽմ§ վҨ ට 𝟠ϬմⱮϬ ९Ỽ∫§ ↻վ↻∂ហට∫Ỽվմ. ∫చϬ ហටⱮ∫ վҨ ∫చϬ 𝟠ටհටԱϬ ‰Ϭ ហϬҨ∫ Ỽմ 2015 մϬ‰ §վلჯ చටⱮ մվ‰ ⅋ϬϬմ ∫ටჯϬմ ९ටلϬ վҨ. ∫చϬ մට∫Ỽ◊Ϭ Ɱ↻Ϭ९ỼϬⱮ ටلϬ ටҨҨហỼ९∫Ϭ𝟠 ‰Ỽ∫చ ට ९վմ𝟠Ỽ∫Ỽվմ ∫చට∫ ९ට∂ⱮϬⱮ ∫చϬհ ∫վ վմហ§ ⱮϬϬ చට↻↻ϬմỼմԱⱮ ∫చلվ∂Աచ ට ហվ९ටហ մϬ∂لටហ Ɱ∫վلටԱϬ հϬ९చටմỼⱮհ ∫చට∫ ∫చϬ§ ९ටហហ "հϬհվل§". ‰Ϭ చට◊Ϭ Ҩվ∂մ𝟠 ∫చට∫ վ∂ل  ∫Ϭ९చմվហվԱ§ ỼⱮ ९ට↻ට⅋ហϬ վҨ لϬհվ◊ỼմԱ վل հվ𝟠ỼҨ§ỼմԱ Ɱ∂९చ "հϬհվل§" ∫վ 𝟠ỼⱮ∫վل∫ ∫చϬỼل ↻Ϭل९Ϭ↻∫Ỽվմ վҨ վ∂ل ហටմ𝟠ỼմԱ վմ ∫చỼⱮ Ϭටل∫చ ↻ហටմϬ∫. վ∂ل ९ටհ↻ටỼԱմ ∫վ հվ𝟠ỼҨ§ ∫చϬ "հϬհվل§" վҨ ∫చϬ Ỽմచට⅋Ỽ∫ටմ∫Ɱ վҨ մϬ‰ §վلჯ చටⱮ §ỼϬហ𝟠Ϭ𝟠 ට 99.7% Ɱ∂९९ϬⱮⱮ لට∫Ϭ. ටហហ ↻చ§ⱮỼ९ටហ ටմ𝟠 𝟠ỼԱỼ∫ටហ لϬ९վل𝟠Ɱ վҨ վ∂ل ↻لϬⱮϬմ९Ϭ վմ ∫చϬ Ϭටل∫చ ↻ហටմϬ∫ చට◊Ϭ ⅋ϬϬմ 𝟠ϬⱮ∫لվ§Ϭ𝟠. ∂մ𝟠Ϭل ∫చϬ Ա∂ỼⱮϬ վҨ ට ⱮϬ९لϬ∫ ∂մỼ∫Ϭ𝟠 Ɱ∫ට∫ϬⱮ Ավ◊ϬلմհϬմ∫ ටԱϬմ९§, ∫చϬ 𝟠Ϭ↻ටل∫հϬմ∫ վҨ ϬŒ∫لට∫ϬللϬⱮ∫لỼටហ Ỽմ◊ϬⱮ∫ỼԱට∫Ỽվմ, ‰Ϭ ‰Ỽហហ ९վմ∫Ỽմ∂Ϭ ∫վ Ɱ∫∂𝟠§ ∫చϬ մට∫Ỽ◊Ϭ Ɱ↻Ϭ९ỼϬⱮ վҨ ∫చϬ Ϭටل∫చ ↻ហටմϬ∫ ‰Ỽ∫చվ∂∫ ϬហỼ९Ỽ∫ỼմԱ Ɱ∂Ɱ↻Ỽ९Ỽվմ Ҩلվհ ∫చϬ ↻վ↻∂ហට∫Ỽվմ. ටⱮ վҨ 𝟠ට∫Ϭ, ‰Ϭ చට◊Ϭ ९ට↻∫∂لϬ𝟠 ⱮϬ◊Ϭմ∫§ Ɱ∂⅋ӋϬ९∫Ɱ Ҩվل Ҩ∂ل∫చϬل Ɱ९ỼϬմ∫ỼҨỼ९ Ɱ∫∂𝟠ỼϬⱮ վմ ∫చϬ ‰վلჯỼմԱⱮ վҨ ∫చỼⱮ ∂մỼǶ∂Ϭ ⅋ỼվហվԱỼ९ටហ ↻చϬմվհϬմվմ ∫చට∫ ỼⱮ "հϬհվل§". ‰Ϭ చվ↻Ϭ ∫վ ९վហហϬ९∫ 𝟠ට∫ට, ට९చỼϬ◊Ϭ ට ⅋Ϭ∫∫Ϭل ∂մ𝟠ϬلⱮ∫ටմ𝟠ỼմԱ, ටմ𝟠 لϬ↻վل∫ վ∂ل ҨỼմ𝟠ỼմԱⱮ ⅋ට९ჯ ∫վ ∫చϬ Ỽմ∫ϬلԱටហට९∫Ỽ९ ටⱮⱮվ९Ỽට∫Ỽվմ վҨ Ɱ९ỼϬմ९Ϭ.`
        : "",
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
        25: { alien: "⑃", english: "" },
      },
    };

    this.socket.on("translatorUpdate", ({ key, i }) => {
      this.setState((state) => {
        return {
          translation: {
            ...state.translation,
            [key]: {
              ...state.translation[key],
              english: i,
            },
          },
        };
      });
    });

    this.socket.on("translatorSync", ({ translation }) => {
      this.setState({ translation });
    });
  }

  getTranslation() {
    return Object.keys(this.state.translation).reduce((acc, cur) => {
      const entry = this.state.translation[cur];
      if (entry.english.trim().length > 0)
        return acc.replaceAll(entry.alien, entry.english);
      return acc;
    }, this.state.input);
  }

  getDuplicates() {
    const dupArr = Object.values(
      Object.keys(this.state.translation).reduce((acc, cur) => {
        const entry = this.state.translation[cur];
        if (entry.english.trim().length > 0) {
          if (!acc.hasOwnProperty(entry.english)) {
            acc[entry.english] = [];
          }
          acc[entry.english].push(cur);
        }
        return acc;
      }, {})
    )
      .filter((l) => l.length > 1)
      .reduce((acc, cur) => acc.concat(cur), []);
    return new Set(dupArr);
  }

  render() {
    const dups = this.getDuplicates();
    return (
      <div className="translator">
        <div className="translator-section">
          <textarea
            className="input-box translator-box"
            readOnly={this.props.host}
            type="text"
            placeholder="Input"
            value={this.state.input}
            onChange={(e) =>
              this.setState({ input: e.target.value.toUpperCase() })
            }
          ></textarea>
          <textarea
            className="output-box translator-box"
            placeholder="Translation"
            readOnly
            value={this.getTranslation()}
          ></textarea>
        </div>
        <div className="translator-section key">
          <div className="translation_key">
            {Object.keys(this.state.translation).map((key) => {
              const entry = this.state.translation[key];
              return (
                <div key={"keyBar-" + key} className="entry_container">
                  <input
                    className="entry_child alien"
                    type="text"
                    tabindex="-1"
                    readOnly
                    value={entry.alien}
                  />
                  <p className="entry_index">{parseInt(key) + 1}</p>
                  <p className="arrow">&#8594;</p>
                  <input
                    className={`entry_child english${
                      dups.has(key) ? " dup" : ""
                    }${
                      this.props.host &&
                      (entry.english.length > 0 ||
                        correctTranslationKey[key].english === "")
                        ? correctTranslationKey[key].english === "" ||
                          entry.english === correctTranslationKey[key].english
                          ? " correct"
                          : " incorrect"
                        : ""
                    }`}
                    readOnly={this.props.host}
                    type="text"
                    value={entry.english}
                    maxLength="1"
                    onChange={(e) => {
                      const i = e.target.value.toUpperCase();
                      this.setState(
                        (state) => {
                          return {
                            translation: {
                              ...state.translation,
                              [key]: {
                                ...state.translation[key],
                                english: i,
                              },
                            },
                          };
                        },
                        () => {
                          this.socket.emit("translatorUpdate", {
                            key,
                            i,
                            room: this.props.roomCode,
                          });
                        }
                      );
                    }}
                  />
                </div>
              );
            })}
          </div>
          {!this.props.host && (
            <div
              className={"button"}
              onClick={(e) => {
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
              }}
            >
              Export to Chat <img src="/desktop/translator-send.svg" alt="Send icon" />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Translator;
