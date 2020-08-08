import React, { Component, useState} from 'react';
import "./TranslatorKey.css";

function TranslationKey(){

  const [cypher, setCypher] = useState({});

  const [dictionary, setDictionary] = useState({
    //type
    0: {
      alien: "",
      english: ""
    },

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

  return (
    <div className="translation_key">

    {dictionary != null &&
      Object.entries(dictionary).map(([key, entry]) => {
        return(

        <div className='keyBar'>
          <div className='entry_container'>
            <div>
              <textarea className='entry_child alien' type="text" value={entry.alien} onChange={(e) => {
                setDictionary()
                const input = e.target.value;
                dictionary[key].alien = input
                setDictionary(() => ({...dictionary}))
                createDict()

              }}></textarea>
            </div>
            <div>
              <textarea className='entry_child english' type="text" value={entry.english} onChange={(e) => {
                setDictionary()
                const input = e.target.value;
                dictionary[key].english = input
                setDictionary(() => ({...dictionary}))
                createDict()


              }}></textarea>
            </div>
          </div>
          <hr className='horizontal_breakline'/>
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