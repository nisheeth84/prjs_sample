/* eslint-disable @typescript-eslint/no-var-requires */

// function render require icon as key
export function requireIcon(key: any) {
  let icon;
  switch (key) {
    case "comment": {
      icon = require("../../../../../assets/icons/comment.png");
      break;
    }
    case "quote": {
      icon = require("../../../../../assets/icons/quote.png");
      break;
    }
    case "share": {
      icon = require("../../../../../assets/icons/share.png");
      break;
    }
    case "emoji": {
      icon = require("../../../../../assets/icons/emoji.png");
      break;
    }
    case "start": {
      icon = require("../../../../../assets/icons/start.png");
      break;
    }
    case "forward": {
      icon = require("../../../../../assets/icons/forward.png");
      break;
    }
    default: {
      icon = require("../../../../../assets/icons/start.png");
    }
  }
  return icon;
}

export function requireIconTabEmoji(key: any) {
  let icon;
  switch (key) {
    case "face1": {
      icon = require("../../../../../assets/icons/face1.png");
      break;
    }
    case "face2": {
      icon = require("../../../../../assets/icons/face2.png");
      break;
    }
    case "face3": {
      icon = require("../../../../../assets/icons/face3.png");
      break;
    }
    case "face4": {
      icon = require("../../../../../assets/icons/face4.png");
      break;
    }
    default: {
      icon = require("../../../../../assets/icons/face1.png");
    }
  }
  return icon;
}
