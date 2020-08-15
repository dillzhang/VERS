import React, { useState } from 'react';
import "./TranslatorKey.css";

function TranslationKey({ decoder }){

  const [cypher, setCypher] = useState({});

  const [dictionary, setDictionary] = useState({
    //type
    0 :{alien: "§", english: ""},
    1 :{alien: "Œ", english: ""},
    2 :{alien: "Ƕ", english: ""},
    3 :{alien: "Ϭ", english: ""},
    4 :{alien: "Ҩ", english: ""},
    5 :{alien: "Ӌ", english: ""},
    6 :{alien: "Ա", english: ""},
    7 :{alien: "հ", english: ""},
    8 :{alien: "մ", english: ""},
    9 :{alien: "վ", english: ""},
    10 :{alien: "ل", english: ""},
    11 :{alien: "९", english: ""},
    12 :{alien: "చ", english: ""},
    13 :{alien: "ට", english: ""},
    14 :{alien: "ჯ", english: ""},
    15 :{alien: "ហ", english: ""},
    16 :{alien: "Ỽ", english: ""},
    17 :{alien: "‡", english: ""},
    18 :{alien: "‰", english: ""},
    19 :{alien: "⅋", english: ""},
    20 :{alien: "↻", english: ""},
    21 :{alien: "∂", english: ""},
    22 :{alien: "∫", english: ""},
    23 :{alien: "◊", english: ""},
    24 :{alien: "Ɱ", english: ""},
    25 :{alien: "𝟠", english: ""}
  });

  const createDict = () => {
    const dict =  {}
    Object.entries(dictionary).map(([key, entry]) => {
      if (entry.alien != " " & entry.alien != "") {
        if (entry.english != " " & entry.english != ""){
          dict[entry.alien.toUpperCase()] = entry.english.toUpperCase()
        }
      }
    })
    setCypher(() => ({...dict}))
  }

  decoder(cypher)

  return (
    <div className="translation_key">
    {dictionary != null &&
      Object.entries(dictionary).map(([key, entry]) => {
        return(
          <div key={'keyBar-' + key} className='keyBar'>
            <div className='entry_container'>
              <p className="entry_index">{key}:</p>
              <input className='entry_child alien' type="text" readOnly value={entry.alien}/>
              &#8594;
              <input className='entry_child english' type="text" value={entry.english} maxLength="1" onChange={(e) => {
                setDictionary()
                const input = e.target.value;
                dictionary[key].english = input
                setDictionary(() => ({...dictionary}))
                createDict()
              }}/>
            </div>
          </div>
        )})
      }
    </div>
  )
}

export default TranslationKey;