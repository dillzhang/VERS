import React from 'react';

import Calculator from "../components/Calculator"
import Chat from "../components/Chat";
import Timer from "../components/Timer";

import FileSystem from "../components/FileSystem";
import fileSystemFolders from "../constants/fileSystemFolders";
import directory from "../fileSystem/Directory";
import securityManual from "../fileSystem/SecurityManual";
import FloorPlan from "../fileSystem/FloorPlan";
import guard1 from "../fileSystem/Guard1";
import guard2 from "../fileSystem/Guard2";

import VideoStream from "../components/VideoStream";
import Translator from '../components/Translator';

import Panorama from '../components/Panorama';
import warehouse_1dark from "../warehouse_images/warehouse-1dark.jpg";
import warehouse_2thermal from "../warehouse_images/warehouse-2thermal.jpg";
import warehouse_3powered from "../warehouse_images/warehouse-3powered.jpg";

import alienArticle from "../fileSystem/AlienArticle";
import languageTranscript1 from "../fileSystem/LanguageTranscript1";
import languageTranscript2 from "../fileSystem/LanguageTranscript2";


import Email from "../components/Email";

const appsCreator = (openApplication, closeApplication, room, level, state, socket, chatFiles, playSound) => ({
    // Shortcut Pop-ups
    calculator: {
      name: "Calculator",
      html: <Calculator />,
    },
    secureChat: {
      name: "Secure Chat",
      html: <Chat room={room} viewer={state.username} chatColor={state.chatColor} socket={socket} files={chatFiles} playSound={playSound} />
    },
    timer: {
      name: "Timer",
      html: <Timer socket={socket} />
    },
    fileSystem: {
      name: "File System",
      html: <FileSystem level={level} socket={socket} folders={fileSystemFolders} openCallBack={openApplication} />
    },
    videoStream: {
      name: "Video Stream - Streaming from @lex",
      html: <VideoStream socket={socket} />
    },
    translator: {
      name: "Translator",
      html: <Translator  socket={socket} roomCode={room} sender={state.username} color={state.chatColor}  />
    },
    // Chat Pop-ups
    warehouse: {
      name: "IMG083098",
      html: <img src="/warehouse.jpg" style={{ maxHeight: 500 }} alt="Warehouse exterior" />,
    },
    no_thermal_warehouse: {
      name: "IMG083104",
      html: <Panorama image={warehouse_1dark}></Panorama>,
    },
    thermal_warehouse: {
      name: "IMG083112",
      html: <Panorama image={warehouse_2thermal}></Panorama>,
    },
    thermal_warehouse_wires: {
      name: "IMG083118",
      html: <Panorama image={warehouse_3powered}></Panorama>,
    },
    elevator_landing: {
      name: "IMG083120",
      html: <img src="/hallways/hallway.jpg" style={{ maxHeight: 500 }} alt="Hallways outside elevator" />,
    },
    vault_door: {
      name: "IMG083123",
      html: <img src="/vault/door.jpg" style={{ maxHeight: 500 }} alt="Vault door" />,
    },
    tubes: {
      name: "IMG083125",
      html: <img src="/vault/tubes.jpg" style={{ maxHeight: 500 }} alt="Tubes" />,
    },
    brain: {
      name: "IMG083128",
      html: <img src="/vault/brain.jpg" style={{ maxHeight: 500 }} alt="Brain" />,
    },
    subject1: {
      name: "IMG083130",
      html: <img src="/vault/subject1.jpg" style={{ maxHeight: 500 }} alt="Subject" />,
    },
    subject2: {
      name: "IMG083131",
      html: <img src="/vault/subject2.jpg" style={{ maxHeight: 500 }} alt="Subject" />,
    },
    computer: {
      name: "IMG083137",
      html: <img src="/vault/computer.jpg" style={{ maxHeight: 500 }} alt="Computer" />,
    },
    baby: {
      name: "IMG083141",
      html: <img src="/vault/baby.jpg" style={{ maxHeight: 500 }} alt="Baby" />,
    },
    cameras: {
      name: "IMG083143",
      html: <img src="/vault/cameras.jpg" style={{ maxHeight: 500 }} alt="Cameras" />,
    },
    powder: {
      name: "IMG083145",
      html: <img src="/vault/powder.jpg" style={{ maxHeight: 500 }} alt="Powder" />,
    },
    languageTranscript1: {
      name: "Document Viewer - transcript_20160103",
      html: languageTranscript1,
    },
    languageTranscript2: {
      name: "Document Viewer - transcript_20160521",
      html: languageTranscript2,
    },
    alienArticle: {
      name: "Document Viewer - journal_20151113",
      html: alienArticle,
    },

    // File System Pop ups
    directory: {
      name: "Document Viewer - Building Directory",
      html: directory,
    },
    floorPlan4: {
      name: "Floor Planner - Subfloor 3 Plan",
      html: <FloorPlan level={level} socket={socket} roomCode={room} sender={state.username} color={state.chatColor} />,
    },
    securityManual: {
      name: "Document Viewer - Security Invoice",
      html: securityManual,
    },
    guard1: {
      name: "Database - A. Shakeb",
      html: guard1,
    },
    guard7: {
      name: "Database - W. Patricia",
      html: guard2,
    },

    // Error Pop ups
    tooMuchRamPopUp: {
      name: "System Warning",
      html: (
        <div className="error-pop-up">
          <h1 className="warning-symbol">⚠️</h1>
          <h2>Your computer is low on memory.</h2>
          <div className="details">
            <p>Programs using significant energy:</p>
            <ul>
              <li>Video Streamer</li>
              <li>Floor Planner</li>
            </ul>
            <p>To restore enough memory for programs to work correctly, close one of the above applications and try again.</p>
            <button onClick={() => { closeApplication("tooMuchRamPopUp") }}>OK</button>
          </div>
        </div>
      )
    },
    email: {
      name: "Mail",
      html: <Email socket={socket} />,
    }
  });

  

export default appsCreator;