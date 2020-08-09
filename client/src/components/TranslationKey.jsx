import React, { Component, useState} from 'react';
import "./TranslatorKey.css";

function TranslationKey({ decoder }){

  const [cypher, setCypher] = useState({});

  const [dictionary, setDictionary] = useState({
    //type
    0: { alien: "", english: "" },
    1: { alien: "", english: "" },
    2: { alien: "", english: "" },
    3: { alien: "", english: "" },
    4: { alien: "", english: "" },
    5: { alien: "", english: "" },
    6: { alien: "", english: "" },
    7: { alien: "", english: "" },
    8: { alien: "", english: "" },
    9: { alien: "", english: "" },
    10: { alien: "", english: "" },
    11: { alien: "", english: "" },
    12: { alien: "", english: "" },
    13: { alien: "", english: "" },
    14: { alien: "", english: "" },
    15: { alien: "", english: "" },
    16: { alien: "", english: "" },
    17: { alien: "", english: "" },
    18: { alien: "", english: "" },
    19: { alien: "", english: "" },
    20: { alien: "", english: "" },
    21: { alien: "", english: "" },
    22: { alien: "", english: "" },
    23: { alien: "", english: "" },
    24: { alien: "", english: "" },
    25: { alien: "", english: "" },
    26: { alien: "", english: "" },


  });


  const createDict = () => {
    const dict = {}

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
    <div className="header_container">
      <p className="header_child alien">Alien</p>
      <p className="header_child english">English</p>
    </div>

    {dictionary != null &&
      Object.entries(dictionary).map(([key, entry]) => {
        return(

        <div className='keyBar'>
          <div className='entry_container'>
            <div>
              <textarea className='entry_child alien' type="text" value={entry.alien} maxlength="1" onChange={(e) => {
                setDictionary()
                const input = e.target.value;
                dictionary[key].alien = input
                setDictionary(() => ({...dictionary}))
                createDict()

              }}></textarea>
            </div>
            <div>
              <textarea className='entry_child english' type="text" value={entry.english} maxlength="1" onChange={(e) => {
                setDictionary()
                const input = e.target.value;
                dictionary[key].english = input
                setDictionary(() => ({...dictionary}))
                createDict()


              }}></textarea>
            </div>
          </div>

        </div>
      )}

      )
    }
      <button className="addEntry" onClick={() => {
        var dictLen = Object.keys(dictionary).length
        dictionary[dictLen] = {
            alien: "",
            english: ""
        }
        setDictionary(() => ({...dictionary}))
        createDict()
      }}>+</button>
    </div>
  )
}

export default TranslationKey;