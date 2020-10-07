import dateFnsFormat from 'date-fns/format';
import dateFnsParseISO from 'date-fns/parseISO';
import _ from 'lodash';
import moment from 'moment';
import momentTimeZone from 'moment-timezone';
import {
  APP_DATETIME_FORMAT_ES, APP_DATE_FORMAT,
  APP_DATE_FORMAT_ES, APP_TIME_FORMAT,
  DATETIME_FORMAT,
  DATETIME_FORMAT_USER, DATE_MODE,
  DEFAULT_TIMEZONE,
  APP_DATE_FORMAT_DATABASE
} from '../../config/constants/constants';

export enum DATE_TIME_FORMAT {
  Database,
  User,
  Utc,
  DatabaseWithSecond
}

export const DEFAULT_TIME = {
  FROM: '00:00:00',
  TO: '23:59:59'
};

export const convertDateTimeFromServer = (date: any) =>
  date
    ? moment
      .utc(date)
      .local(true)
      .toDate()
    : null;

/** use for regist or update finishDate, startDate */
export const convertDateTimeToServer = (date: any) => {
  const datetime = date + ' 12:00:00';
  return datetime ? moment(datetime).toISOString() : null;
};

export const convertDateToYYYYMMDD = (date: any) =>
  date
    ? moment
      .utc(date)
      .local(true)
      .format(APP_DATE_FORMAT)
    : '';

export const convertDateToFormatTitle = (date: any) =>
  date
    ? moment
      .utc(date)
      .local(true)
      .format('YYYY年MM月DD日（ddd）')
    : '';

export const roundTime = (value: any, roundUp: any, nowIfNull: any) => {
  let date = null;
  if (nowIfNull) {
    date = value && value.length > 0 ? moment(value, 'HH:mm') : moment();
  } else {
    date = moment(value, 'HH:mm');
  }

  if (!date.isValid()) {
    return value;
  }
  const minute = date.minute();
  if (roundUp) {
    const quantity = minute % 5 === 0 ? 0 : 5 - (minute % 5);
    date.add(quantity, 'minutes');
  } else {
    date.subtract(minute % 5, 'minutes');
  }
  const ret = date.format('HH:mm');
  return ret;
};

export const getHourMinute = (strValue: string, isInit?: boolean) => {
  const ret = { hour: 0, minute: 0 };
  if (!strValue) {
    return ret;
  }
  if (strValue === '24:00') {
    strValue = '00:00';
  }
  const hhMM = _.trim(strValue).split(':');
  let hh;
  let mm;
  if (hhMM.length > 2) {
    if (isInit) {
      hhMM.splice(2);
    } else {
      return ret;
    }
  }
  if (hhMM.length === 1) {
    if (hhMM[0].length > 4) {
      return ret;
    } else if (hhMM[0].length === 4) {
      hh = +hhMM[0].substring(0, 2);
      mm = +hhMM[0].substring(2, 4);
    } else if (hhMM[0].length <= 2) {
      hh = +hhMM[0];
      mm = 0;
    } else {
      hh = +hhMM[0].substring(0, 1).padStart(2, '0');
      mm = +hhMM[0].substring(1, 3);
    }
  } else {
    hh = +hhMM[0];
    mm = +hhMM[1];
  }
  ret.hour = hh;
  ret.minute = mm;
  return ret;
};

export const isValidTimeFormat = (strValue: string, isInit?: boolean) => {
  if (!strValue || strValue.toString().trim().length < 1) {
    return true;
  }
  return (
    /^[012]?\d[:]?[012345]?\d?$/g.test(strValue) ||
    /^\d[0-6]\d$/g.test(strValue) ||
    (isInit && /^[012]?\d[:]?[012345]?\d?[:]?[012345]?\d?$/g.test(strValue))
  );
};

export const isValidTime = (strValue: string, isInit?: boolean) => {
  if (!strValue || strValue.toString().trim().length < 1) {
    return true;
  }
  if (!isValidTimeFormat(strValue, isInit)) {
    return false;
  }
  const hhMM = getHourMinute(strValue);
  if (hhMM.hour === 24 && hhMM.minute === 0) {
    return true;
  }
  if (hhMM.hour < 0 || hhMM.hour >= 24 || hhMM.minute < 0 || hhMM.minute >= 60) {
    return false;
  }
  return true;
};

export const autoFormatTime = (strValue: string, isInit?: boolean, oldValue?: any) => {
  if (!strValue || strValue.toString().trim().length < 1) {
    return '';
  }
  if (strValue === '24:00') {
    strValue = '00:00';
  }
  if (!isValidTime(strValue, isInit)) {
    return oldValue ? oldValue : '';
  }
  const hhMM = getHourMinute(strValue, isInit);
  const hh = `${hhMM.hour}`.padStart(2, '0');
  const mm = `${hhMM.minute}`.padStart(2, '0');
  return `${hh}:${mm}`;
};

export const getDateBeforeAfter = (val: string, type: number) => {
  if (!val || val.toString().trim().length < 1) {
    return '';
  }
  const today = new Date();
  const num = parseInt(val, 10);
  switch (type) {
    case DATE_MODE.DATE_BEFORE:
      today.setDate(today.getDate() - num);
      break;
    case DATE_MODE.DATE_AFTER:
      today.setDate(today.getDate() + num);
      break;
    case DATE_MODE.MONTH_BEFORE:
      today.setMonth(today.getMonth() - num);
      break;
    case DATE_MODE.MONTH_AFTER:
      today.setMonth(today.getMonth() + num);
      break;
    case DATE_MODE.YEAR_BEFORE:
      today.setFullYear(today.getFullYear() - num);
      break;
    case DATE_MODE.YEAR_AFTER:
      today.setFullYear(today.getFullYear() + num);
      break;
    default:
      today.setDate(today.getDate() - num);
  }
  const day = today
    .getDate()
    .toString()
    .padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();
  return `${year}-${month}-${day}`;
};

export const formatTime = (timeString: any, _isFrom = true) => {
  if (!timeString) {
    return timeString;
  }
  const timeArray = timeString.split(':');
  if (timeArray && timeArray.length === 2) {
    return `${timeString}:00`;
  } else if (timeArray && timeArray.length === 3) {
    return timeString;
  }
};

export const getTimezone = (timezone: string) => {
  if (!timezone) {
    timezone = DEFAULT_TIMEZONE;
  }
  return timezone;
};

export const convertDateTimeToTz = (dateTime: Date | string, timeZone: string): any => {
  const timezone = getTimezone(timeZone);
  if (!dateTime || !timezone) {
    return dateTime;
  }
  if (moment.isDate(dateTime)) {
    return momentTimeZone.tz(_.toString(dateTime), timezone).toDate();
  } else {
    const dt = dateFnsParseISO(dateTime);
    if (moment.isDate(dt)) {
      return momentTimeZone.tz(_.toString(dateTime), timezone).toDate();
    }
    return dateTime;
  }
};

export const convertDateTimeFromTz = (dateTime: Date | string, timeZone: string): any => {
  const timezone = getTimezone(timeZone);
  if (!dateTime || !timezone) {
    return dateTime;
  }
  if (moment.isDate(dateTime)) {
    return momentTimeZone
      .tz(_.toString(dateTime), timezone)
      .toDate();
  } else {
    const dt = moment(dateTime).toDate();
    if (moment.isDate(dt)) {
      return momentTimeZone.tz(_.toString(dateTime), timezone).toDate();
    }
    return dateTime;
  }
};

const getDateTimeFormatString = (userFormatDate: string, formatIn?: DATE_TIME_FORMAT) => {
  if (formatIn === DATE_TIME_FORMAT.DatabaseWithSecond) {
    return APP_DATETIME_FORMAT_ES;
  } else if (formatIn === DATE_TIME_FORMAT.User) {
    return userFormatDate;
  } else {
    return DATETIME_FORMAT;
  }
};

export const utcToTz = (dateTime: Date | string, timeZone: string, userFormatDate: string, formatOut?: DATE_TIME_FORMAT, _formatIn?: DATE_TIME_FORMAT) => {
  const timezone = getTimezone(timeZone);
  if (!dateTime || !timeZone) {
    return _.toString(dateTime);
  }
  if (_.isString(dateTime) && dateTime.endsWith('Z') && dateTime.length > 16) {
    dateTime = dateTime.slice(0, 16).replace('T', ' ');
  }
  let dt;
  if (moment.isDate(dateTime)) {
    dt = dateTime;
  } else {
    dt = dateFnsParseISO(dateTime);
  }

  const dtAsString = dateFnsFormat(dt, DATETIME_FORMAT_USER);
  const tz = momentTimeZone.utc(dtAsString).tz(timezone);
  if (formatOut === DATE_TIME_FORMAT.Database) {
    return tz.format(DATETIME_FORMAT);
  } else if (formatOut === DATE_TIME_FORMAT.User) {
    const userFormat = userFormatDate.toUpperCase();
    return tz.format(userFormat + ' HH:mm');
  } else {
    return tz.format();
  }
};

export const tzToUtc = (dateTime: Date | string, timeZone: string, userFormatDate: string, format?: DATE_TIME_FORMAT, formatIn?: DATE_TIME_FORMAT) => {
  // get login timezone
  const timezone = getTimezone(timeZone);
  if (!dateTime || !timezone) {
    return _.toString(dateTime);
  }
  const dateTimeUTC = moment.tz(_.isString(dateTime) ? dateTime : _.toString(dateTime), getDateTimeFormatString(userFormatDate, formatIn), timezone).utc();
  if (format === DATE_TIME_FORMAT.Database) {
    return dateTimeUTC.format(DATETIME_FORMAT);
  } else if (format === DATE_TIME_FORMAT.User) {
    const userFormat = userFormatDate?.toLocaleUpperCase();
    return dateTimeUTC.format(userFormat + ' HH:mm');
  } else {
    return dateTimeUTC.format();
  }
};

const DATE_DEFAULT = '1970-01-01 ';
export const convertDateTimeDefault = (defaultVal: any, timeZone: string, userFormatDate: string) => {
  const _formatDate = APP_DATE_FORMAT_ES;
  const _formatTime = APP_TIME_FORMAT;
  const format = `${_formatDate} ${_formatTime}`;
  if (!_.isNil(defaultVal)) {
    const isDateInput = defaultVal.split(' ');
    let isDefaultDate = false;
    let isDefaultTime = false;
    isDateInput.forEach((item: any) => {
      if (item.length > 5) {
        isDefaultDate = true;
      } else {
        isDefaultTime = true;
      }
    });
    if (!isDefaultDate && isDefaultTime) {
      defaultVal = DATE_DEFAULT + defaultVal;
    }
    const onlyDate = defaultVal.split(' ').length === 1;
    defaultVal = dateFnsFormat(onlyDate ? defaultVal : tzToUtc(defaultVal, timeZone, userFormatDate), format);
    if (isDefaultDate && !isDefaultTime) {
      defaultVal = defaultVal.slice(0, 10);
    } else if (!isDefaultDate && isDefaultTime) {
      defaultVal = defaultVal.slice(11, 16);
    }
  }
  return defaultVal;
};

const FORMAT_DATE_DEFAULT = 'YYYY-MM-DD';
const FORMAT_DATE_TIME_DEFAULT = 'YYYY-MM-DD HH:mm';
export const TYPE_SWICH_FORMAT = {
  DEFAULT_TO_USER: 1,
  USER_TO_DEFAULT: 2
};

export const switchFormatDate = (date: string, userFormatDate: string, type: any) => {
  try {
    const isDateTime = date.split(' ').length === 2;
    let userFormat = userFormatDate;
    userFormat += isDateTime ? ' HH:mm' : '';
    const defaultFomat = isDateTime ? FORMAT_DATE_TIME_DEFAULT : FORMAT_DATE_DEFAULT;
    const retDate =
      type === TYPE_SWICH_FORMAT.DEFAULT_TO_USER
        ? moment(date, defaultFomat).format(userFormat)
        : moment(date, userFormat).format(defaultFomat);
    return retDate;
  } catch {
    return date;
  }
};

export const formatDateDatabase = (valueDate: string, userFormatDate: string) => {
  const newDate = moment(valueDate, userFormatDate.toUpperCase()).toDate();
  if (newDate) {
    return dateFnsFormat(newDate,APP_DATE_FORMAT_DATABASE);
  } else {
    return valueDate;
  }
};

/**
 * use string length of input to return corresponding format default
 * default return default format date
 * @param date
 */
const matchDefaultFormat = (date: string) => {
  if (date.length === 5) {
    return 'HH:mm';
  } else if (date.length === 10) {
    return FORMAT_DATE_DEFAULT;
  } else if (date.length === 16) {
    return FORMAT_DATE_DEFAULT + ' HH:mm';
  }
  return FORMAT_DATE_DEFAULT;
};

export const parseDateFmDefault = (date: any) => {
  const defaultFm = matchDefaultFormat(date);
  try {
    const parsed = moment(date, defaultFm).toDate();
    return parsed;
  } catch {
    return date;
  }
};

export const formatDate = (date: Date | string, format?: string) => {
  if (!date) {
    return date;
  }
  const dateTimeUTC = moment.utc(_.isString(date) ? date : _.toString(date), FORMAT_DATE_DEFAULT);
  return dateTimeUTC.format(format);
};

export const dateToStringUserTzFormat = (dateTime: Date | string, timeZone: string, userFormatDate: string) => {
  let format = userFormatDate;
  if (_.isNil(format)) {
    format = APP_DATE_FORMAT;
  }
  const dt = tzToUtc(dateTime, timeZone, userFormatDate);
  if (!dt) {
    return '';
  }
  if (moment.isDate(dt)) {
    return dateFnsFormat(dt, format);
  } else {
    return moment(dt, format);
  }

};

export const datetimeToStringUserTzFormat = (dateTime: Date | string, timeZone: string, userFormatDate: string) => {
  let format = userFormatDate;
  if (_.isNil(format)) {
    format = APP_DATE_FORMAT;
  }
  const _formatTime = APP_TIME_FORMAT;
  format = `${format} ${_formatTime}`;
  const dt = utcToTz(dateTime, timeZone, userFormatDate, DATE_TIME_FORMAT.User);
  if (!dt) {
    return '';
  }
  if (moment.isDate(dt)) {
    return dateFnsFormat(dt, format);
  } else {
    return moment(dt, format);
  }
};

export const formatDateTime = (strValue: string, dateFm = 'YYYY-MM-DD HH:mm:ss') => {
  const newDate = moment(strValue, dateFm);
  if (newDate.isValid()) {
    const strDate = newDate.format(dateFm);
    return strDate;
  } else {
    return strValue;
  }
};

export const getTimeString = (dateObject: Date, isWithColon = true) => {
  if (!dateObject) {
    return '';
  }
  let timeString = dateObject
    .getHours()
    .toString()
    .padStart(2, '0');
  if (isWithColon) {
    timeString = timeString + ':';
  }
  return (
    timeString +
    dateObject
      .getMinutes()
      .toString()
      .padStart(2, '0')
  );
};

const DEFAULT_DATE = '1980-01-01';

const trimTime = (timeString: any) => {
  const timeArray = timeString.split(':');
  return timeArray[0] + ':' + timeArray[1];
};

export const timeUtcToTz = (timeStringUtc: string, timeZone: string, userFormatDate: string) => {
  if (!timeStringUtc) {
    return timeStringUtc;
  }
  timeStringUtc = trimTime(timeStringUtc);
  const tzDateArr = utcToTz(DEFAULT_DATE + ' ' + timeStringUtc, timeZone, userFormatDate, DATE_TIME_FORMAT.Database).split(' ');
  return tzDateArr[tzDateArr.length - 1];
};

export const timeTzToUtc = (timeStringTz: string, timeZone: string, userFormatDate: string, isWithSecond?: boolean) => {
  if (!timeStringTz) {
    return timeStringTz;
  }
  timeStringTz = trimTime(timeStringTz);
  const utcDateArr = tzToUtc(DEFAULT_DATE + ' ' + timeStringTz, timeZone, userFormatDate, DATE_TIME_FORMAT.Database).split(' ');
  return utcDateArr[utcDateArr.length - 1] + (isWithSecond ? ':00' : '');
};

export const getTimezonesOffset = (timeZone: string) => {
  const timezone = getTimezone(timeZone);
  return moment.tz(timezone).utcOffset();
};

export const tzDateToDateTimeUtc = (dateObject: Date | string, timeZone: string, userFormatDate: string, format?: DATE_TIME_FORMAT, timeString?: string) => {
  if (timeString) {
    return tzToUtc((_.isString(dateObject) ? dateObject : dateFnsFormat(dateObject, APP_DATE_FORMAT_ES)) + ' ' + timeString, timeZone, userFormatDate, format);
  } else {
    return tzToUtc(dateObject, timeZone, userFormatDate, format);
  }
};
