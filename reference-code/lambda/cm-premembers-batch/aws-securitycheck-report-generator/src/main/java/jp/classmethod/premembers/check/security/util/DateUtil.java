package jp.classmethod.premembers.check.security.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class DateUtil {
    /** 日付のフォーマット（yyyy-MM-dd HH:mm:ss.SSS） */
    public static final String PATTERN_YYYYMMDDTHHMMSSSSS = "yyyy-MM-dd HH:mm:ss.SSS";
    /** 日付のフォーマット（yyyy/MM/dd HH:mm:ss） */
    public static final String PATTERN_YYYYMMDDTHHMMSS = "yyyy/MM/dd HH:mm:ss";
    /** 日付のフォーマット（"EEE MMM dd HH:mm:ss zzz yyyy"） */
    public static final String PATTERN_EEEMMMDDHHMMSSZZZYYYY = "EEE MMM dd HH:mm:ss zzz yyyy";
    /** 日付のフォーマット（"yyyy-MM-dd HH:mm:ss zzz"） */
    public static final String PATTERN_YYYYMMDDTHHMMSSSSSZ = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    public static final String JAPANESE_FORMAT = "yyyy年MM月dd日";
    public static final String PATTERN_YYYYMMDD_SLASH = "yyyy/MM/dd";
    public static final String PATTERN_YYYYMMDD_HYPHEN = "yyyy-MM-dd";

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
        TimeZone.setDefault(TimeZone.getTimeZone(timeZone));
        Date now = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        sdf.setTimeZone(TimeZone.getTimeZone(timeZone));
        return sdf.format(now);
    }

    /**
     * Convert string to date with any format
     *
     * @author TuanDV
     * @param strDate
     * @param format
     *            date format
     * @return date object
     */
    public static Date toDate(String strDate, String format, String timeZone) {
        Date result = null;
        try {
            TimeZone.setDefault(TimeZone.getTimeZone(timeZone));
            SimpleDateFormat sdf = new SimpleDateFormat(format);
            result = sdf.parse(strDate);
        } catch (ParseException e) {
            result = null;
        }
        return result;
    }

    /**
     * Convert Date to String
     *
     * @author TuanDV
     * @param date
     * @param format
     * @return String
     */
    public static String toString(Date date, String format, String timeZone) {
        if (date == null) {
            return null;
        }
        TimeZone.setDefault(TimeZone.getTimeZone(timeZone));
        SimpleDateFormat mySimpleDateFormat = new SimpleDateFormat(format);
        return mySimpleDateFormat.format(date);
    }
}