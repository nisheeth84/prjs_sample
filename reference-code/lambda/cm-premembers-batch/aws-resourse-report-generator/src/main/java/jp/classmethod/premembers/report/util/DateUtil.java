package jp.classmethod.premembers.report.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

import jp.classmethod.premembers.report.constant.MsgConst;
import jp.classmethod.premembers.report.properties.MsgProps;

public class DateUtil {
    /**  日付のフォーマット（yyyy-MM-dd HH:mm:ss.SSS） */
    public static final String PATTERN_YYYYMMDDTHHMMSSSSS = "yyyy-MM-dd HH:mm:ss.SSS";
    /**  日付のフォーマット（yyyy/MM/dd HH:mm:ss） */
    public static final String PATTERN_YYYYMMDDTHHMMSS = "yyyy/MM/dd HH:mm:ss";
    /**  日付のフォーマット（"EEE MMM dd HH:mm:ss zzz yyyy"） */
    public static final String PATTERN_EEEMMMDDHHMMSSZZZYYYY = "EEE MMM dd HH:mm:ss zzz yyyy";
    /**  日付のフォーマット（"yyyy-MM-dd HH:mm:ss zzz"） */
    public static final String PATTERN_YYYYMMDDTHHMMSSSSSZ = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    public static final String JAPANESE_FORMAT = "yyyy年MM月dd日";

    /**
     * 現在の時刻をUTC時刻で返します
     *
     * @param format
     * @return
     */
    public static String getCurrentDateUTC() {
        return getCurrentDateByFormat(PATTERN_YYYYMMDDTHHMMSSSSS, "UTC");
    }

    public static String getCurrentDateByFormat(String format, String timeZone) {
        Date now = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        sdf.setTimeZone(TimeZone.getTimeZone(timeZone));
        return sdf.format(now);
    }


    /**
     * 日付のフォーマットを行います
     *
     * @param dateStr
     * @param format
     * @return フォーマットされた日付
     */
    public static String dateFormat(String dateStr, String format) {

        String returnStr = dateStr;

        long time = Long.parseLong(dateStr);
        time = time * 1000;

        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(MsgProps.getString(MsgConst.TIME_ZONE)));
        cal.setTimeInMillis(time);

        Date date = cal.getTime();

        DateFormat df = new SimpleDateFormat(format);
        df.setTimeZone(cal.getTimeZone());
        returnStr = df.format(date);

        return returnStr;
    }

    /**
     * 日付をunixtimeに変換します。
     *
     * @param date
     * @param format
     * @param locale
     * @return parse失敗時はnull
     */
    public static String dateToUnixTime(String date, String format, Locale locale) {
        SimpleDateFormat sdf = new SimpleDateFormat(format, locale);
        Date d;
        try {
            d = sdf.parse(date);
        } catch (ParseException e) {
            return null;
        }
        return String.valueOf(d.getTime() / 1000);
    }

    /**
     * Convert Date to String
     *
     * @param date the date input
     * @param format the format to convert
     * @return String
     */
    public static String toString(Date date, String format) {
        if (date == null) {
            return null;
        }
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        sdf.setTimeZone(TimeZone.getTimeZone(MsgProps.getString(MsgConst.TIME_ZONE)));
        return sdf.format(date);
    }

    /**
     * Convert string to date with any format
     *
     * @author TuanDV
     * @param strDate
     * @param format date format
     * @return date object
     */
    public static Date toDate(String strDate, String format) {
        Date result = null;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(format);
            result = sdf.parse(strDate);
        } catch (ParseException e) {
            result = null;
        }
        return result;
    }

    /**
     * get remaining day
     *
     * @param startTime
     * @param duration
     * @return Remaining Day
     */
    public static int getRemainingDay(Date startTime, int duration) {
        long currenttime = Calendar.getInstance(TimeZone.getTimeZone("UTC")).getTime().getTime();
        long endTime = convertDateUTC(startTime).getTime() + TimeUnit.SECONDS.toMillis(duration);
        long one_date_time = 1000 * 60 * 60 * 24;
        long diffDays = (endTime - currenttime) / one_date_time;
        return (int) diffDays;
    }

    /**
     * convert date to UTC
     *
     * @param date
     * @return Date UTC
     */
    public static Date convertDateUTC(Date date) {
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
        cal.setTime(date);
        return cal.getTime();
    }

    /**
     * convert date
     * @param date
     * @param format
     * @return date convert
     */
    public static Date convertDate(String date, String format) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(format);
            return sdf.parse(date);
        } catch (ParseException e) {
            return null;
        }
    }
}