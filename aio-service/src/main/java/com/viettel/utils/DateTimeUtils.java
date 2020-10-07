package com.viettel.utils;

import com.viettel.service.base.utils.StringUtils;

import java.text.DateFormat;
import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;


public final class DateTimeUtils {

    public static final String DATE_YYYY = "yyyy";
    public static final String DATE_YYYYMMDD = "yyyyMMdd";
    public static final String DATE_DD_MM_YYYY = "dd/MM/yyyy";
    public static final String DATE_YYYY_MM_DD = "YYYY-MM-DD";
    public static final String DATE_YYYYMMDD_HHMMSS = "yyyyMMdd HHmmss";
    public static final String DATE_YYYY_MM_DD_HH_MM_SS = "yyyy/MM/dd HH:mm:ss";
    public static final String DATE_DD_MM_YYYY_HH_MM_SS = "dd/MM/yyyy HH:mm:ss";
    public static final long MILLISECONDS_BY_DAY = 24 * 60 * 60 * 1000;
    public static final int DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK = 4;
    public static final int DEFAULT_FIRST_DAY_OF_WEEK = Calendar.MONDAY;
    public static final String HH24MiSS_MIN = " 000000"; // 00h00m00s
    public static final String HH24MiSS_MAX = " 235959"; // 23h59m59s


    public static Date convertStringToDate(String date, String fm) {
        if (!StringUtils.isNullOrEmpty(date)) {
            DateFormat format = new SimpleDateFormat(fm);
            try {
                Date date_formated = format.parse(date);
                return date_formated;
            } catch (ParseException e) {
                return null;
            }
        }
        return null;
    }

    public static String convertDateToString(Date date, String fm) {
        if (date == null) {
            return "";
        } else {
            Format formatter = new SimpleDateFormat(fm);
            String result = formatter.format(date);
            return result;
        }
    }

    public static String convertDateToString(Long date, String fmOut) {
        String result = "";
        if (date == null) {
            return result;
        }
        if (date.toString().length() == 4) {
            return date.toString();
        } else {
            try {
                Date inputDate = new SimpleDateFormat(DATE_YYYYMMDD).parse(date.toString());
                Format formatter = new SimpleDateFormat(fmOut);
                result = formatter.format(inputDate);
            } catch (ParseException e) {
                // e.printStackTrace();
                return "";
            }
            return result;
        }
    }

    public static String convertDate_dd_MM_yyyy(Long date) {

        StringBuilder newDate = new StringBuilder();
        if (date != null) {
            String date_s = date.toString();
            if (date_s != null && date_s.length() > 4) {
                newDate.append(date_s.substring(6, date_s.length())) // day
                        .append("/").append(date_s.substring(4, 6)) // month
                        .append("/").append(date_s.substring(0, 4)); // year
            } else {
                newDate.append(date_s);
            }

        }
        return newDate.toString();
    }

    public static String convertDateStringToDefault(String date) {

        StringBuilder newDate = new StringBuilder();
        if (date != null) {
            if (date.length() > 4) {
                newDate.append(date.substring(6, date.length())) // day
                        .append("/").append(date.substring(4, 6)) // month
                        .append("/").append(date.substring(0, 4)); // year
            } else {
                newDate.append(date);
            }

        }
        return newDate.toString();
    }

    public static Date convertDate(Long date) {
        String value = date.toString();
        String format = "yyyyMMdd";
        if (value.length() == 4) {
            format = "yyyy";
        } else if (value.length() == 6) {
            format = "yyyyMM";
        }
        DateFormat dateFormat = new SimpleDateFormat(format);
        try {
            return dateFormat.parse(value);
        } catch (ParseException e) {
            // e.printStackTrace();
            return null;
        }
    }

    public static Long convertDateyyyyMMdd(String date_dd_MM_yyyy) {

        StringBuilder newDate = new StringBuilder();
        if (date_dd_MM_yyyy != null && date_dd_MM_yyyy.length() > 4) {
            newDate.append(date_dd_MM_yyyy.substring(6, date_dd_MM_yyyy.length())) // year
                    .append(date_dd_MM_yyyy.substring(3, 5)) // month
                    .append(date_dd_MM_yyyy.substring(0, 2)); // day
        } else {
            newDate.append(date_dd_MM_yyyy);
        }

        return Long.parseLong(newDate.toString());
    }

    public static Date getNow() {
        Calendar cal = Calendar.getInstance();
        return cal.getTime();
    }

    public static String convertDateStringyyyyMMdd(String date_dd_MM_yyyy) {

        StringBuilder newDate = new StringBuilder();
        if (date_dd_MM_yyyy != null && date_dd_MM_yyyy.length() > 4) {
            newDate.append(date_dd_MM_yyyy.substring(6, date_dd_MM_yyyy.length())) // year
                    .append(date_dd_MM_yyyy.substring(3, 5)) // month
                    .append(date_dd_MM_yyyy.substring(0, 2)); // year
        } else {
            newDate.append(date_dd_MM_yyyy);
        }

        return newDate.toString();
    }

    public static long getTimeOfDay(int hour) {
        Calendar today = Calendar.getInstance();
        today.set(Calendar.HOUR_OF_DAY, hour);
        today.set(Calendar.MINUTE, 0);
        today.set(Calendar.SECOND, 0);
        today.set(Calendar.MILLISECOND, 0);
        return today.getTimeInMillis();
    }

    public static long getCurrentHourOfDay() {
        Calendar today = Calendar.getInstance();
        today.set(Calendar.MINUTE, 0);
        today.set(Calendar.SECOND, 0);
        today.set(Calendar.MILLISECOND, 0);
        return today.getTimeInMillis();
    }
}

