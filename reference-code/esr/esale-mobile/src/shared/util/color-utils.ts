

export const formatColor = (color: string) => {
  color = `#${color}`.replace(/0x/gi, "");
  if (color == `#`) {
    return "";
  }
  for (let count = 0; count < color.length / 2; count++) {
    color = color.replace(/##/gi, "#");
  }
  return color;
}
