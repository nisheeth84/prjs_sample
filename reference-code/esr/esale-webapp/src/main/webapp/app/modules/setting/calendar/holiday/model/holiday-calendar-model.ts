import { DayName } from '../holiday.reducer';
import moment, { months, Moment } from 'moment';

export type DataOfDaySetting = {
  date: Date;
  isWeekend: boolean;
  holidayCommon: string;
  isCompanyHoliday: boolean;
  companyHolidayName: string;
  isHoliday: boolean;
  isNationalHoliday: boolean;
  nationalHolidayName: string;
};

export type DataOfWeekSetting = {
  startDate: Date;
  endDate: Date;
  listDataOfDaySetting: DataOfDaySetting[];
};

export type DataOfMonthSetting = {
  startDate: Date;
  endDate: Date;
  listDataOfWeekSetting: DataOfWeekSetting[];
};

const checkHoliday = (date: Date, holiday: any) => {
  const day = moment(date).day() + 1;
  switch (day) {
    case DayName.Monday:
      return (holiday && holiday.monday) || false;
    case DayName.Tuesday:
      return (holiday && holiday.tuesday) || false;
    case DayName.Wednesday:
      return (holiday && holiday.wednesday) || false;
    case DayName.Thurday:
      return (holiday && holiday.thursday) || false;
    case DayName.Friday:
      return (holiday && holiday.friday) || false;
    case DayName.Saturday:
      return (holiday && holiday.saturday) || false;
    case DayName.Sunday:
      return (holiday && holiday.sunday) || false;
    default:
      return false;
  }
};

const compareDateByDay = (a: moment.Moment, b: moment.Moment) => {
  const m = a.month() - b.month();
  if (m !== 0) return m;
  return a.date() - b.date();
};

const contentHolidayCompany = (date: Date, holiday: any) => {
  let content = '';
  holiday &&
    holiday.companyHolidays &&
    holiday.companyHolidays.forEach(element => {
      if (
        (compareDateByDay(moment(element.companyHolidayDate), moment(date)) === 0 &&
          element.isRepeat) ||
        moment(element.companyHolidayDate).diff(moment(date), 'days') === 0
      ) {
        content = element.companyHolidayName;
      }
    });
  return content;
};

const contentNationalHoliday = (date: Date, holiday: any) => {
  let content = '';
  holiday &&
    holiday.nationalHolidays &&
    holiday.nationalHolidays.forEach(element => {
      if (
        compareDateByDay(moment(element.nationalHolidayDate), moment(date)) === 0 ||
        moment(element.nationalHolidayDate).diff(moment(date), 'days') === 0
      ) {
        content = element.nationalHolidayName;
      }
    });
  return content;
};

export const initDataOfMonthSetting = (
  startWeekSetting: DayName,
  dateShowCurrent: Date,
  holiday: any
): DataOfMonthSetting => {
  if (!startWeekSetting) {
    startWeekSetting = DayName.Monday;
  }

  const delta =
    startWeekSetting >
    moment(dateShowCurrent)
      .startOf('months')
      .weekday()
      ? 7 -
        startWeekSetting +
        moment(dateShowCurrent)
          .startOf('months')
          .weekday()
      : moment(dateShowCurrent)
          .startOf('months')
          .weekday() - startWeekSetting;

  const startDateOfGrid = moment(dateShowCurrent)
    .startOf('months')
    .add(-delta, 'days')
    .toDate();
  const endDateOfGrid = moment(dateShowCurrent)
    .startOf('months')
    .endOf('months')
    .endOf('weeks')
    .toDate();

  const numberOfWeek = moment(endDateOfGrid).diff(startDateOfGrid, 'days') / 7;

  const dataOfMonthSetting: DataOfMonthSetting = {
    startDate: startDateOfGrid,
    endDate: endDateOfGrid,
    listDataOfWeekSetting: []
  };

  for (let weekIndex = 0; weekIndex < numberOfWeek; weekIndex++) {
    const listDataOfDaySetting: DataOfDaySetting[] = [];
    const dataOfWeekSetting: DataOfWeekSetting = {
      startDate: moment(startDateOfGrid)
        .add(weekIndex * 7, 'days')
        .toDate(),
      endDate: moment(endDateOfGrid)
        .add(weekIndex * 7 + 7, 'days')
        .toDate(),
      listDataOfDaySetting
    };
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dateMoment = moment(startDateOfGrid).add(weekIndex * 7 + dayIndex, 'days');
      const dataOfDaySetting: DataOfDaySetting = {
        date: dateMoment.toDate(),
        isWeekend: checkHoliday(dateMoment.toDate(), holiday),
        holidayCommon: checkHoliday(dateMoment.toDate(), holiday) ? '休日' : '',
        isCompanyHoliday: !!contentHolidayCompany(dateMoment.toDate(), holiday),
        companyHolidayName: contentHolidayCompany(dateMoment.toDate(), holiday),
        isHoliday: false,
        isNationalHoliday: !!contentNationalHoliday(dateMoment.toDate(), holiday),
        nationalHolidayName: contentNationalHoliday(dateMoment.toDate(), holiday)
      };
      listDataOfDaySetting.push(dataOfDaySetting);
    }
    dataOfWeekSetting.listDataOfDaySetting = listDataOfDaySetting;
    dataOfMonthSetting.listDataOfWeekSetting.push(dataOfWeekSetting);
  }
  return dataOfMonthSetting;
};
