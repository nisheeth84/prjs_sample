import moment from 'moment';

const getDaysArrayByMonth = (year, month) => {
  const monthIndex = month - 1;
  const indexDate = [0, 1, 2, 3, 4, 5, 6];
  const date = new Date(year, monthIndex, 1);
  const result = [];
  while (date.getMonth() === monthIndex) {
    result.push({ date: date.getDate(), index: indexDate[date.getDay()], fullInfoOfDate: moment(date).format('YYYY-MM-DD') });
    date.setDate(date.getDate() + 1);
  }
  return result.map((rs) => ({ ...rs, index: rs.index === 0 ? 7 : rs.index }));
}

export default getDaysArrayByMonth;
