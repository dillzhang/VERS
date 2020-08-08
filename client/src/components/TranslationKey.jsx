import React, { Component, useState} from 'react';
import "./TranslatorKey.css";

function TranslationKey(){

  const [cypher, setCypher] = useState({});

  const [dictionary, setDictionary] = useState({
    //type
    0: {
      alien: "alien letter",
      english: "english letter"
    },

  });

  const [alien, setAlien] = useState([])
  const [english, setEnglish] = useState([])

  const createDict = () => {
    const dict = []

    for (var i in alien.length) {
      if (alien[i] != " " | alien[i] != "") {
        if (english[i] != " " | english[i] != ""){
            dict[alien[i]] = english[i]
        }
      }
    }
    setCypher(dict)
  }

  const keyDisp = () => {
    const dictList = []
    for (var i=0; i < alien.length; i++) {
      console.log("i" + i)
      dictList.push(

      )

    }
    console.log("dictlist" + dictList)
    return dictList;
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

                console.log('prev ' + alien)
                entry.alien = input
                console.log('after ' + alien)
                console.log("key "+ key)
                dictionary[key].alien = input
                setDictionary(() => ({...dictionary}))

                console.log("dictionary " + Object.entries(dictionary[key]))

              }}></textarea>
            </div>
            <div>
              <textarea className='entry_child english' type="text" value={entry.english} onChange={(e) => {
                setDictionary()
                const input = e.target.value;

                console.log('prev ' + english)
                entry.english = input
                console.log('after ' + english)
                console.log("key "+ key)
                dictionary[key].english = input
                setDictionary(() => ({...dictionary}))

                console.log("dictionary " + Object.entries(dictionary[key]))

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
        console.log("dictLen "+dictLen)
        dictionary[dictLen] = {
          dictLen: {
            alien: "sdf",
            english: "sdfs"
          }
        }
        setDictionary(() => ({...dictionary}))
        console.log("hello " + Object.entries(dictionary))

      }}>+</button>
    </div>
  )
}

export default TranslationKey;