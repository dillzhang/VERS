import React, { useState } from 'react';

import "./Translator.css";
import Key from './TranslationKey.jsx'

function Translator() {
  // Initialize the state
  const [inputText, setInputText] = useState("");
  const [keyOpen, setKeyOpen] = useState(false);
  const [cypher, setCypher] = useState({});

  const translate = () => {
    var translated_sen = "";
    for (var i = 0; i < inputText.length; i++) {
      if (Object.keys(cypher).some(e => e === inputText[i])){
        translated_sen += cypher[inputText[i]];
      } else {
        translated_sen += inputText[i];
      }
    }
    return translated_sen;
  }

    return (
      <div className="translator">
        <div className="translator-section">
          <textarea className="input-box translator-box" type="text" placeholder="Input" onChange={(e) => setInputText(e.target.value.toUpperCase())}></textarea>
          <textarea className="output-box translator-box" placeholder="Translation" readOnly value={translate()}></textarea>
        </div>
        <div className="translator-section key">
          <Key decoder={cypherDict => setCypher(cypherDict)}/>
        </div>
      </div>
    );

}

export default Translator;