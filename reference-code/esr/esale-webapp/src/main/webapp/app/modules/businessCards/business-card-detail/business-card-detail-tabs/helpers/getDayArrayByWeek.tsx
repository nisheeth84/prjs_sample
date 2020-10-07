import moment from 'moment';

const getDayArrayByWeek = (current) => {
  const cloneDate = new Date(current);
  const week = [];
  // Starting Monday not Sunday
  const lastDayOfMonth = new Date(cloneDate.getFullYear(), cloneDate.getMonth() + 1, 0);
  const indexOfFirstDayOfWeek = (cloneDate.getDate() - cloneDate.getDay()) + 1;
  const firstDayOfWeek = new Date(current.setDate(indexOfFirstDayOfWeek));
  for (let i = 0; i < 7; i++) {
    week.push(
      {
        date: firstDayOfWeek.getDate() + i > lastDayOfMonth.getDate() ? '' : firstDayOfWeek.getDate() + i,
        index: firstDayOfWeek.getDate() + i > lastDayOfMonth.getDate() ? '' : new Date(cloneDate.setDate(firstDayOfWeek.getDay())).getDay() + i,
        fullInfoOfDate: firstDayOfWeek.getDate() + i > lastDayOfMonth.getDate() ? '' : moment(firstDayOfWeek.setDate(indexOfFirstDayOfWeek + i)).format('YYYY-MM-DD')
      }
    );
    firstDayOfWeek.setDate(indexOfFirstDayOfWeek);
  }
  return week.map((rs) => ({ ...rs, index: rs.index === 0 ? 7 : rs.index }));
};

export default getDayArrayByWeek;
