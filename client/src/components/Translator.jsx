import React, { Component } from 'react';

import "./Translator.css";
import {getResponseDescription} from './alien-translator.js'

class Translator extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.socket = props.socket;

    this.socket.on("translator-update", () => {
      console.log("hello");

    })

    this.state = {
        inputText: "",
    }
  }


  setInputText = (e) => {
    const value = e.target.value;
    this.setState({inputText: value});
  }

  translate = (e) => {
    var translated_sen = ""
    for (var i = 0; i < e.length; i++) {
      translated_sen += getResponseDescription(e[i])
    }
    console.log(translated_sen)
    return translated_sen
  }

  openTranslationKey = () => {
    console.log('open translation key')
  }
  render() {
    return (
      <div className="translator-box">
        <button className="key" onClick={this.openTranslationKey}>key</button>
        <div >
          <textarea className="input-box" type="text" value={this.state.inputText} onChange={this.setInputText}></textarea>
        </div>

        <div>
          <textarea className="output-box" readonly value={this.translate(this.state.inputText)}></textarea>
        </div>
      </div>
    );
  }
}

export default Translator;