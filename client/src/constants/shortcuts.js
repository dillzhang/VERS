import React from 'react';

const shortcutCreator = (openApplication) => ({
    calculator: {
      requirement: 0,
      app: (
        <div key="calculator-shortcut" className="shortcut" onClick={() => { openApplication("calculator") }}>
          <div className="icon">
            <img src="/desktop/calculator.svg" alt="Calculator shortcut icon" />
          </div>
          <div className="shortcut-name">Calculator</div>
        </div>
      ),
    },
    secureChat: {
      requirement: 0,
      app: (
        <div key="chat-shortcut" className="shortcut" onClick={() => { openApplication("secureChat") }}>
          <div className="icon">
            <img src="/desktop/secure-chat.svg" alt="Secure chat shortcut icon" />
          </div>
          <div className="shortcut-name">Secure Chat</div>
        </div>
      ),
    },
    timer: {
      requirement: 10,
      app: (
        <div key="timer-shortcut" className="shortcut" onClick={() => { openApplication("timer") }}>
          <div className="icon">
            <img src="/desktop/timer.svg" alt="Timer shortcut icon" />
          </div>
          <div className="shortcut-name">Timer</div>
        </div>
      )
    },
    fileSystem: {
      requirement: 15,
      app: (
        <div key="file-system-shortcut" className="shortcut" onClick={() => { openApplication("fileSystem") }}>
          <div className="icon">
            <img src="/desktop/filesystem.svg" alt="Filesystem shortcut icon" />
          </div>
          <div className="shortcut-name">Files</div>
        </div>
      )
    },
    videoStream: {
      requirement: 40,
      app: (
        <div key="video-stream-shortcut" className="shortcut" onClick={() => { openApplication("videoStream") }}>
          <div className="icon">
            <img src="/desktop/video-stream.svg" alt="Video Stream shortcut icon" />
          </div>
          <div className="shortcut-name">Video Stream</div>
        </div>
      )
    },
    translator: {
      requirement: 60,
      app: (
        <div key="translator-shortcut" className="shortcut" onClick={() => { openApplication("translator") }}>
          <div className="icon">
            <img src="/desktop/translator.svg" alt="Translator shortcut icon" />
          </div>
          <div className="shortcut-name">Translator</div>
        </div>
      ),
    },
    email: {
      requirement: 70,
      app: (
        <div key="email-shortcut" className="shortcut" onClick={() => { openApplication("email") }}>
          <div className="icon">
            <img src="/desktop/mail.svg" alt="Filesystem shortcut icon" />
          </div>
          <div className="shortcut-name">Mail</div>
        </div>
      )
    },
});

export default shortcutCreator;