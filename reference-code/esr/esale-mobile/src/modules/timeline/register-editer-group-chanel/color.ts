export const COLOR_ARRAY = [
  "#FB7D7D",
  "#FFB379",
  "#FFD590",
  "#88D9B0",
  "#85ACDC",
  "#FC82FC",
  "#FF9D9D",
  "#FF92B9",
  "#B4D887",
  "#D8CC75",
  "#6DCACC",
  "#7171E2",
  "#CC8BD1",
  "#CEAA91",
  "#FED3D3",
  "#FFE7D2",
  "#FFF1DA",
  "#D8F2E5",
  "#D6E3F3",
  "#FED5FE",
  "#FFDEDE",
  "#FFE0EB",
  "#D7EABE",
  "#ECE5B9",
  "#C8EBEC",
  "#DBDBF7",
  "#E7D3EF",
  "#E6D4C7",
];

export const getColor = () => {
  return COLOR_ARRAY.map((color, index) => {
    return {
      id: index,
      name: color,
      hexColor: color,
    };
  });
};
