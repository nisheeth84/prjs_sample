import { Storage } from 'react-jhipster';
import moment from 'moment';
import momentTimeZone from 'moment-timezone';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

import {
  APP_DATE_FORMAT,
  DATE_MODE,
  USER_FORMAT_DATE_KEY,
  USER_TIMEZONE_KEY,
  APP_TIME_FORMAT,
  APP_DATE_FORMAT_ES,
  DATETIME_FORMAT,
  DEFAULT_TIMEZONE,
  APP_DATETIME_FORMAT_ES
} from 'app/config/constants';
import _ from 'lodash';
import { toKatakana } from './string-utils';

export enum DATE_TIME_FORMAT {
  Database,
  User,
  Utc,
  DatabaseWithSecond
}

export const DEFAULT_TIME = {
  FROM: '00:00',
  TO: '23:59'
};

export const convertDateTimeFromServer = date =>
  date
    ? moment
        .utc(date)
        .local(true)
        .toDate()
    : null;

/** use for regist or update finishDate, startDate */
export const convertDateTimeToServer = (date, dateFormat?) => {
  const datetime = date + ' 12:00:00';
  if (['DD-MM-YYYY', 'MM-DD-YYYY'].includes(dateFormat)) {
    return datetime ? moment(datetime, dateFormat + ' HH:mm:ss').toISOString() : null;
  } else {
    return datetime ? moment(datetime).toISOString() : null;
  }
};

export const convertDateToYYYYMMDD = date =>
  date
    ? moment
        .utc(date)
        .local(true)
        .format(APP_DATE_FORMAT)
    : '';

export const convertDateToFormatTitle = date =>
  date
    ? moment
        .utc(date)
        .local(true)
        .format('YYYY年MM月DD日（ddd）')
    : '';

export const roundTime = (value, roundUp, nowIfNull) => {
  let date = null;
  value = toKatakana(value);
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
  strValue = toKatakana(strValue);
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
  strValue = toKatakana(strValue);
  return (
    /^[012]?\d[:]?[012345]?\d?$/g.test(strValue) ||
    /^\d[0-6]\d$/g.test(strValue) ||
    (isInit && /^[012]?\d[:]?[012345]?\d?[:]?[012345]?\d?$/g.test(strValue))
  );
};

export const isValidTimeInput = (strValue: string, isInit?: boolean) => {
  if (!strValue || strValue.toString().trim().length < 1) {
    return true;
  }
  strValue = toKatakana(strValue);
  return /^[0-9 :]+$/g.test(strValue);
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

export const autoFormatTime = (strValue: string, isInit?: boolean, oldValue?) => {
  if (!strValue || strValue.toString().trim().length < 1) {
    return '';
  }
  strValue = toKatakana(strValue);
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

export const formatTime = (timeString, isFrom = true) => {
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

export const getTimezone = () => {
  let timezone = Storage.session.get(USER_TIMEZONE_KEY);
  if (!timezone) {
    timezone = DEFAULT_TIMEZONE;
  }
  return timezone;
};

export const convertDateTimeToTz = (dateTime: Date | string) => {
  const timezone = getTimezone();
  if (!dateTime || !timezone) {
    return dateTime;
  }
  const dt = dateFnsParse(dateTime);
  if (moment.isDate(dt)) {
    return momentTimeZone.tz(_.toString(dt), timezone).toDate();
  } else {
    return dateTime;
  }
};

export const convertDateTimeFromTz = (dateTime: Date | string) => {
  const timezone = getTimezone();
  if (!dateTime || !timezone) {
    return dateTime;
  }
  const dt = dateFnsParse(dateTime);
  if (moment.isDate(dt)) {
    return momentTimeZone
      .tz(_.toString(dt), timezone)
      .utc()
      .toDate();
  } else {
    return dateTime;
  }
};

export const getDateTimeFormatString = (formatIn?: DATE_TIME_FORMAT) => {
  if (formatIn === DATE_TIME_FORMAT.DatabaseWithSecond) {
    return APP_DATETIME_FORMAT_ES;
  } else if (formatIn === DATE_TIME_FORMAT.User) {
    return Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
  } else {
    return DATETIME_FORMAT;
  }
};

export const trimTimezoneMark = dateTime => {
  if (_.isString(dateTime) && dateTime.endsWith('Z') && dateTime.length > 16) {
    dateTime = dateTime.slice(0, 16).replace('T', ' ');
  }
  return dateTime;
};

export const utcToTz = (
  dateTime: Date | string,
  formatOut?: DATE_TIME_FORMAT,
  formatIn?: DATE_TIME_FORMAT
) => {
  const timezone = getTimezone();
  if (!dateTime || !timezone) {
    return _.toString(dateTime);
  }
  if (_.isString(dateTime)) {
    dateTime = toKatakana(dateTime);
  }
  if (_.isString(dateTime) && dateTime.endsWith('Z') && dateTime.length > 16) {
    dateTime = dateTime.slice(0, 16).replace('T', ' ');
  }
  const dt = dateFnsParse(dateTime, getDateTimeFormatString(formatIn));
  const dtAsString = dateFnsFormat(dt, DATETIME_FORMAT);
  const tz = momentTimeZone.utc(dtAsString).tz(timezone);

  if (formatOut === DATE_TIME_FORMAT.Database) {
    return tz.format(DATETIME_FORMAT);
  } else if (formatOut === DATE_TIME_FORMAT.User) {
    const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
    return tz.format(userFormat + ' HH:mm');
  } else {
    return tz.format();
  }
};

export const tzToUtc = (
  dateTime: Date | string,
  format?: DATE_TIME_FORMAT,
  formatIn?: DATE_TIME_FORMAT
) => {
  const timezone = getTimezone();
  if (!dateTime || !timezone) {
    return _.toString(dateTime);
  }
  if (_.isString(dateTime)) {
    dateTime = toKatakana(dateTime);
  }
  const dateTimeUTC = moment
    .tz(
      _.isString(dateTime) ? dateTime : _.toString(dateTime),
      getDateTimeFormatString(formatIn),
      timezone
    )
    .utc();

  if (format === DATE_TIME_FORMAT.Database) {
    return dateTimeUTC.format(DATETIME_FORMAT);
  } else if (format === DATE_TIME_FORMAT.User) {
    const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
    return dateTimeUTC.format(userFormat + ' HH:mm');
  } else {
    return dateTimeUTC.format();
  }
};

const DATE_DEFAULT = '1970-01-01 ';
export const convertDateTimeDefault = defaultVal => {
  const _formatDate = APP_DATE_FORMAT_ES;
  const _formatTime = APP_TIME_FORMAT;
  const format = `${_formatDate} ${_formatTime}`;
  if (!_.isNil(defaultVal)) {
    const isDateInput = defaultVal.split(' ');
    let isDefaultDate = false;
    let isDefaultTime = false;
    isDateInput.forEach(item => {
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
    defaultVal = dateFnsFormat(onlyDate ? defaultVal : tzToUtc(defaultVal), format);
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

export const switchFormatDate = (date: string, type) => {
  try {
    const isDateTime = date.split(' ').length === 2;
    let userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
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

export const parseDateFmDefault = date => {
  const defaultFm = matchDefaultFormat(date);
  try {
    const parsed = moment(date, defaultFm).toDate();
    return parsed;
  } catch {
    return date;
  }
};

export const formatDate = (date: Date | string) => {
  if (!date) {
    return date;
  }
  const format = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
  const dateTimeUTC = moment.utc(_.isString(date) ? date : _.toString(date), 'YYYY-MM-DD');
  return dateTimeUTC.format(format);
};

export const dateToStringUserTzFormat = (dateTime: Date | string) => {
  let format = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
  if (_.isNil(format)) {
    format = APP_DATE_FORMAT;
  }
  const dt = tzToUtc(dateTime);
  if (!dt) {
    return '';
  }
  return dateFnsFormat(dt, format);
};

export const datetimeToStringUserTzFormat = (dateTime: Date | string) => {
  let format = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
  if (_.isNil(format)) {
    format = APP_DATE_FORMAT;
  }
  const _formatTime = APP_TIME_FORMAT;
  format = `${format} ${_formatTime}`;
  const dt = utcToTz(dateTime, DATE_TIME_FORMAT.User);
  if (!dt) {
    return '';
  }
  return dateFnsFormat(dt, format);
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

const DEFAULT_DATE = '2020-01-01';

const trimTime = timeString => {
  const timeArray = timeString.split(':');
  return timeArray[0] + ':' + timeArray[1];
};

export const timeUtcToTz = (timeStringUtc: string) => {
  if (!timeStringUtc) {
    return timeStringUtc;
  }
  timeStringUtc = trimTime(timeStringUtc);
  const tzDateArr = utcToTz(DEFAULT_DATE + ' ' + timeStringUtc, DATE_TIME_FORMAT.Database).split(
    ' '
  );
  return tzDateArr[tzDateArr.length - 1];
};

export const timeTzToUtc = (timeStringTz: string, isWithSecond?: boolean) => {
  if (!timeStringTz) {
    return timeStringTz;
  }
  timeStringTz = trimTime(timeStringTz);
  const utcDateArr = tzToUtc(DEFAULT_DATE + ' ' + timeStringTz, DATE_TIME_FORMAT.Database).split(
    ' '
  );
  return utcDateArr[utcDateArr.length - 1] + (isWithSecond ? ':00' : '');
};

export const getTimezonesOffset = () => {
  const timezone = getTimezone();
  return moment.tz(timezone).utcOffset();
};

export const tzDateToDateTimeUtc = (
  dateObject: Date | string,
  format?: DATE_TIME_FORMAT,
  timeString?: string
) => {
  if (timeString) {
    return tzToUtc(
      (_.isString(dateObject) ? dateObject : dateFnsFormat(dateObject, APP_DATE_FORMAT_ES)) +
        ' ' +
        timeString,
      format
    );
  } else {
    return tzToUtc(dateObject, format);
  }
};

export const formatZDateTime = dateTime => {
  if (dateTime && _.isString(dateTime) && dateTime.endsWith('Z') && dateTime.length > 16) {
    dateTime = dateTime.slice(0, 16).replace('T', ' ');
  }
  return dateTime;
};

export const getDateTimeNowTz = () => {
  return new Date(
    utcToTz(
      moment()
        .utc()
        .format(DATETIME_FORMAT),
      DATE_TIME_FORMAT.Database
    )
  );
};

export const getCurrentTimeRoundUp = () => {
  const dateNow = getDateTimeNowTz();
  const modeFive = dateNow.getMinutes() % 5;
  if (modeFive > 0) {
    dateNow.setMinutes(dateNow.getMinutes() - modeFive);
  }
  return dateNow;
};

export const dateTimeToStringUserDateTimeFromat = (dateTime: Date | string) => {
  if (dateTime) {
    const _dateTime = _.isString(dateTime) ? dateTime : _.toString(dateTime);
    return utcToTz(_dateTime, DATE_TIME_FORMAT.User);
  } else {
    return '';
  }
};

export const dateTimeToStringUserDateFromat = (dateTime: Date | string) => {
  const _dateTimetz = dateTimeToStringUserDateTimeFromat(dateTime);
  if (_dateTimetz) {
    return _dateTimetz.split(' ')[0];
  } else {
    return '';
  }
};

export const addSecondStartEnd = (datetime: string, isFrom: boolean) => {
  if (!datetime || _.isEmpty(datetime)) {
    return datetime;
  }
  const ss = isFrom ? '00' : '59';
  const matchs = /([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?/g.exec(_.trim(datetime));
  if (!matchs || matchs.length < 1) {
    return datetime;
  }
  if (matchs[0].split(':').length < 3) {
    return datetime.replace(matchs[0], `${matchs[0]}:${ss}`);
  } else if (matchs[0].split(':').length === 3) {
    const hhmmss = matchs[0].split(':');
    return datetime.replace(matchs[0], `${hhmmss[0]}:${hhmmss[1]}:${ss}`);
  }
  return datetime;
};

