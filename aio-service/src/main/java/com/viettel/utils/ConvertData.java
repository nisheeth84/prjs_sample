package com.viettel.utils;

import com.viettel.service.base.utils.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class ConvertData {
    public static List<String> convertStringToList(String source, String separator) {
        List<String> result = new ArrayList<String>();
        if (!StringUtils.isNullOrEmpty(source) && !StringUtils.isNullOrEmpty(separator)) {
            String[] arr = source.split(separator);
            if (arr != null && arr.length != 0) {
                for (int i = 0; i < arr.length; i++) {
                    result.add(arr[i]);
                }
            }
        }
        return result;
    }
}
