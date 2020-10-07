package com.viettel.vtpgw.shared.utils;

import lombok.experimental.UtilityClass;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@UtilityClass
public class DateUtil {

    private static Logger logger = LoggerFactory.getLogger(DateUtil.class);
    private static final String YYYY_MM_DD = "yyyy-MM-dd";

    public Date parseDate(String date) {
        Date formatDate = null;
        if (date != null) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat(YYYY_MM_DD);
            try {
                formatDate = simpleDateFormat.parse(date);
            } catch (ParseException e) {
                logger.error("parse date error: ", e);
            }
        }
        return formatDate;
    }
}
