/* 
Continuous background noises that change with state should be added 
here. When the state switches, I will stop all sounds in previous 
state and play all sounds in the next state. Sounds that overlap will
remain playing. Therefore any sounds that need to continue, should
be added into all states that require it.
*/
const STATE_SOUNDS = {
  0: new Set([]), // PRESHOW
  10: new Set([]), // Start of Puzzle 1
  15: new Set([]), // Electrical Box
  20: new Set([]), // start of Puzzle 2
  29: new Set([]), // End of Puzzle 2
  30: new Set([]), // Start of Puzzle 3
  39: new Set([]), // End of Puzzle 3
  40: new Set([]), // Start of Puzzle 4
  45: new Set([]), // Sending Video Stream
  50: new Set([]), // Start of Puzzle 5
  60: new Set([]), // Start of Puzzle 6
  65: new Set([]), // Sending Translator
  69: new Set([]), // End of Puzzle 6
  70: new Set([]), // First Email
  71: new Set([]), // Second Email
  72: new Set([]), // Third Email
  73: new Set([]), // Fourth Email
  74: new Set([]), // Fifth Email
  75: new Set([]), // END
  80: new Set([]), // FAILURE
};

const TIME_SOUNDS = {
  600: [], // "5 minutes remaing"
  120: [], // "1 minute remaining"
  0: [], // "0 minute remaining"
};

module.exports = { STATE_SOUNDS, TIME_SOUNDS };