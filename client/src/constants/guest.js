const chatColors = [
  "#f94144",
  "#f3722c",
  "#f8961e",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#577590",
  "#75B9BE",
  "#A8CCC9",
  "#B3D6C6",
  "#DCEAB2",
  "#C7D66D",
  "#FCD0A1",
  "#B1B695",
  "#53917E",
  "#63535B",
  "#6D1A36",
];

const STATE_SUCCESS = 70;
const STATE_FAILURE = 80;

const stateApplications = {
  0: [], // 0
  10: ["timer"], // 10
  15: ["fileSystem"], //15
  20: [], // 20
  30: [], // 30
  39: [], // 39
  40: [], // 40
  45: ["videoStream"],
  50: [], // 50
  60: [], // 60
  65: ["translator"], // 65
  69: [], // 69
  70: ["email"], // 70
  71: ["email"], // 71
  72: ["email"], // 72
  73: ["email"], // 73
  74: ["email"], // 74
  75: ["email"], // 74
  80: [], // 80
};

const alwayVisibleSet = new Set([
  "secureChat",
  "timer",
  "fileSystem",
  "videoStream",
  "floorPlan4",
  "translator",
  "email",
]);

export {
  chatColors,
  STATE_SUCCESS,
  STATE_FAILURE,
  stateApplications,
  alwayVisibleSet,
};
