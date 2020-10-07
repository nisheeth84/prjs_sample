const mapDayNextAndLastMonth = (rowMissData, dataNeed, previous = false) => {
  const missLength = 7 - rowMissData.length;
  if(previous) {
    const lastWeekOfMonth = dataNeed.splice(dataNeed.length - 7, dataNeed.length).splice(7 - missLength , 7);
    return lastWeekOfMonth;
  }
  const firstWeekOfMonth = dataNeed.splice(0, 7).splice(0 , 7 - missLength);
  return firstWeekOfMonth;
};

export default mapDayNextAndLastMonth;
