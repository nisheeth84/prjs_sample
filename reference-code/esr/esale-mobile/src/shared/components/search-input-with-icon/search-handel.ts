export function requireFiles(key: any) {
  let icon;
  switch (key) {
    case "ppt": {
      icon = require("../../../../assets/icons/ppt.png");
      break;
    }
    case "xls": {
      icon = require("../../../../assets/icons/xls.png");
      break;
    }
    case "doc": {
      icon = require("../../../../assets/icons/doc.png");
      break;
    }
    case "etc": {
      icon = require("../../../../assets/icons/etc.png");
      break;
    }
    default: {
      icon = require("../../../../assets/icons/pdf.png");
    }
  }
  return icon;
}