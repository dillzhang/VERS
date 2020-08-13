import React, { useState } from 'react';

import "./Translator.css";
import Key from './TranslationKey.jsx'

function Translator() {
  // Initialize the state
  const [inputText, setInputText] = useState("")
  const [keyOpen, setKeyOpen] = useState(false)
  const [cypher, setCypher] = useState({})

  const translate = () => {
    var translated_sen = ""
    for (var i = 0; i < inputText.length; i++) {
      if (Object.keys(cypher).some(e => e === inputText[i])){
        translated_sen += cypher[inputText[i]]
      } else {
        translated_sen += inputText[i]
      }
    }
    return translated_sen
  }

  const openTranslationKey = () => {

  }

    return (
      <div className='translator'>
        <div className='translator_elements'>

          <div className="translator_box">
            <textarea className="input_box" type="text" placeholder="Input" onChange={(e) => setInputText(e.target.value.toUpperCase())}></textarea>
          </div>

          <div>
            <textarea className="output_box" placeholder="Translation" readOnly value={translate()}></textarea>
          </div>

        </div>
        <div className="translator_elements">
          <div className='key'>
            <Key decoder={cypherDict => setCypher(cypherDict)}/>
          </div>
        </div>

      </div>
    );

}
// <div className="header">
//   <button className="key_button" onClick={() => {setKeyOpen(!keyOpen)}}>Key</button>
// </div>
//{ keyOpen &&
  // }

export default Translator;