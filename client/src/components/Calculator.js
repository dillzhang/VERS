import React, { Component } from 'react';

import "./Calculator.css";

class Calculator extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      value: "",
    }
  };

  BUTTONS = [
    "7", "8", "9", "÷",
    "4", "5", "6", "×",
    "1", "2", "3", "-",
    "00", "0", ".", "+",
    "clear", "="
  ];



  handleButton(v) {
    switch(v) {
      case "clear":
        this.setState({value: "", decimal: true});
        break;
      case "=":
        if (this.state.value.length > 0) {
          const value = this.calculateOutput();
          this.setState({value, decimal: value !== Math.floor(parseFloat(value)) });
        }
        break;
      case ".":
        if (this.state.decimal) {
          this.setState(old => ({value: old.value + v, decimal: false}));
        }
        return;
      case "÷":
      case "×":
      case "−":
      case "+":
        if (this.state.value === "") {
          return;
        } else {
          this.setState(old => ({value: old.value + v, decimal: true}));
        }
        return;
      default:
        this.setState(old => ({value: old.value + v}));
    }
  }

  operations = {
    "÷": (a, b) => a / b,
    "×": (a, b) => a * b,
    "-": (a, b) => a - b,
    "+": (a, b) => a + b,
    "=": (a, b) => a ? a : b,
  }

  calculateOutput() {
    if (this.state.value.length === 0) {
      return "";
    }
    let output = null;
    let input = "";
    let operation = "=";
    const inputString = ((this.state.value.slice(0, 1) === "-" ? "0" : "") + this.state.value + (this.operations.hasOwnProperty(this.state.value.slice(-1)) ? "" : "="));
    console.log("inputString", inputString);
    for (let c of inputString) {
      if (this.operations.hasOwnProperty(c)) {
        const value = parseFloat(input);
        if (isNaN(value)) {
          return "ERROR"
        }
        if (output === null) {
          output = value;
        } else {
          output = this.operations[operation](output, value);
        }
        input = "";
        operation = c;
      } else {
        input += c;
      }
      console.log(input, output, operation);
    }
    return output.toString();
  }

  render() {
    return (
      <div className="calculator-box">
        <div className="calculator-display">
          <div className="input-value">
            {this.state.value}
          </div>
          <div className="output-value">
            {this.calculateOutput()}
          </div>
        </div>
        <div className="calculator-buttons">
          {this.BUTTONS.map(v => {
            return (<button key={v} className={`calc-button calc-button-${v === "=" ? "equal" : v}`} onClick={() => {this.handleButton(v)}}>{v}</button>);
          })}
        </div>
      </div>
    );
  }
}

export default Calculator;