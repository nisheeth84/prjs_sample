package jp.classmethod.premembers.report.util;

import java.lang.reflect.Method;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Locale;

import org.json.JSONObject;
import org.springframework.beans.BeanUtils;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;

import jp.classmethod.premembers.report.constant.ComConst;

/**
 * Do common utilities
 *
 * @author TuanDV
 */
public class CommonUtil {

    /**
     * do invoke the corresponding action
     *
     * @author TuanDV
     * @param className class name
     * @param methodName action name
     * @param value
     */
    public static void doInvokeSetAction(Object object, String methodName, String value) {
        try {
            Class<?> cls = Class.forName(object.getClass().getName());
            Method method = cls.getMethod(methodName, new Class[]{String.class});
            method.invoke(object, new Object[]{value});
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Check String is null or empty
     *
     * @param str String
     * @return true String input is null or length = 0
     */
    public static boolean isEmpty(String str) {
        return (str == null || str.length() <= 0);
    }

    /**
     * MAPPER json
     *
     * @param content
     * @param valueType
     * @return
     */
    public static <T> T mapperJson(String content, Class<T> valueType) {
        try {
            JSONObject jsonContent = new JSONObject(content);
            if (jsonContent.has(ComConst.SDK_RESPONSE_META_DATA)) {
                jsonContent.remove(ComConst.SDK_RESPONSE_META_DATA);
            }
            if (jsonContent.has(ComConst.SDK_HTTP_META_DATA)) {
                jsonContent.remove(ComConst.SDK_HTTP_META_DATA);
            }
            ObjectMapper mapper = new ObjectMapper();
            mapper.setDateFormat(new SimpleDateFormat(DateUtil.PATTERN_EEEMMMDDHHMMSSZZZYYYY, Locale.ENGLISH));
            return mapper.readValue(jsonContent.toString(), valueType);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * MAPPER JSON
     *
     * @param content
     * @param valueType
     * @return
     */
    public static String getJsonMapper(Object value, boolean isConvertDate) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.setSerializationInclusion(Include.NON_NULL);
            if (isConvertDate) {
                mapper.setDateFormat(new SimpleDateFormat(DateUtil.PATTERN_EEEMMMDDHHMMSSZZZYYYY, Locale.ENGLISH));
            }
            return mapper.writeValueAsString(value);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Copy the properties of the original object to destination object based on org.springframework.beans.BeanUtils.copyProperties#copyProperties
     *
     * @author TuanDV
     * @param source is original object contain properties has data need copy
     * @param target is destination object has same properties with original object
     */
    public static void copyProperties(Object source, Object target) {
        try {
            BeanUtils.copyProperties(source, target);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Format file size byte
     *
     * @param size
     * @return size format
     */
    public static String formatFileSize(double size) {
        String hrSize = ComConst.BLANK;
        double b = size;
        double k = size / 1024.0;
        double m = ((size / 1024.0) / 1024.0);
        double g = (((size / 1024.0) / 1024.0) / 1024.0);
        double t = ((((size / 1024.0) / 1024.0) / 1024.0) / 1024.0);

        DecimalFormat dec = new DecimalFormat("0.0");
        if (t > 1) {
            hrSize = dec.format(t).concat(" TB");
        } else if (g > 1) {
            hrSize = dec.format(g).concat(" GB");
        } else if (m > 1) {
            hrSize = dec.format(m).concat(" MB");
        } else if (k > 1) {
            hrSize = dec.format(k).concat(" KB");
        } else {
            hrSize = dec.format(b).concat(" B");
        }
        return hrSize;
    }
}