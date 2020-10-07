package jp.classmethod.premembers.check.security.util;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.beanutils.BeanUtils;

import jp.classmethod.premembers.check.security.job.dto.SecurityCheckItemDetailsDto;

/**
 * Do common utilities
 *
 * @author TuanDV
 */
public class CommonUtil {
    private final static Logger LOGGER = LoggerFactory.getLogger(CommonUtil.class);

    /**
     * do invoke the corresponding action
     *
     * @author TuanDV
     * @param className
     *            class name
     * @param methodName
     *            action name
     * @param value
     */
    public static void doInvokeSetAction(Object object, String methodName, String value) {
        try {
            Class<?> cls = Class.forName(object.getClass().getName());
            Method method = cls.getMethod(methodName, new Class[] { String.class });
            method.invoke(object, new Object[] { value });
        } catch (Exception e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
        }
    }

    /**
     * Check String is null or empty
     *
     * @param str
     *            String
     * @return true String input is null or length = 0
     */
    public static boolean isEmpty(String str) {
        return (str == null || str.length() <= 0);
    }

    /**
     * Create unmodifiable list from list of param
     *
     * @author TuanDV
     * @param <T>
     *            Class type of param
     * @param paramList
     *            list of param
     * @return Unmodifiable list
     */
    @SuppressWarnings("unchecked")
    public static <T> List<T> toUnmodifiableList(T... paramList) {
        if (paramList == null || paramList.length <= 0) {
            return Collections.unmodifiableList(new ArrayList<T>());
        }
        return Collections.unmodifiableList(Arrays.asList(paramList));
    }

    /**
     * Create unmodifiable list from list of list param
     *
     * @author TuanDV
     * @param <T>
     *            Class type of param
     * @param paramList
     *            list of param
     * @return Unmodifiable list
     */
    @SafeVarargs
    public static <T> List<T> toUnmodifiableList(List<T>... paramList) {
        List<T> result = new ArrayList<>();
        if (paramList != null && paramList.length > 0) {
            for (List<T> list : paramList) {
                result.addAll(list);
            }
        }
        return Collections.unmodifiableList(result);
    }

    /**
     * Copy the properties of the original object to destination object based on
     * org.apache.commons.beanutils.BeanUtils#copyProperties
     *
     * [Notice] If the value of property in source obj is NULL, the value of
     * same property in target obj become "0" automatically. To avoid this
     * confusing behavior, use the following copyPropertiesSpring method instead
     * of this method.
     *
     * @author TuanDV
     * @param source
     *            is original object contain properties has data need copy
     * @param target
     *            is destination object has same properties with original object
     */
    public static void copyProperties(SecurityCheckItemDetailsDto source, SecurityCheckItemDetailsDto target) {
        try {
            BeanUtils.copyProperties(target, source);
        } catch (Exception e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
        }
    }
}