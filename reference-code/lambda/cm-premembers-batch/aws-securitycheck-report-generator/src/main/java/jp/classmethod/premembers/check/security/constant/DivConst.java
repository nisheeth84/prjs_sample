package jp.classmethod.premembers.check.security.constant;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jp.classmethod.premembers.check.security.constant.library.DivItem;
import jp.classmethod.premembers.check.security.constant.library.DivMap;
import jp.classmethod.premembers.check.security.util.CommonUtil;

/**
 * Define division constant for applications
 *
 * @author TuanDV
 */
public final class DivConst {
    private final static Logger LOGGER = LoggerFactory.getLogger(DivConst.class);

    private DivConst() {
    };

    private static Map<Class<? extends Enum<?>>, DivMap<?>> divConstMap = new HashMap<Class<? extends Enum<?>>, DivMap<?>>();
    private static Comparator<DivItem> comparator;

    /*
     * ================================================Declare enumeration
     * constant
     */
    /** Correctly Division */
    public enum CorrectlyDivision {
        MANAGED, OK, NG, CRITICAL, ERROR;
    }

    /*
     * ================================================Static put enumeration to
     * map
     */
    static {
        // Put Correctly Division
        DivMap<CorrectlyDivision> correctlyDivision = new DivMap<CorrectlyDivision>(CorrectlyDivision.class);
        correctlyDivision.put(CorrectlyDivision.MANAGED, "-1", "overview.managed", 1);
        correctlyDivision.put(CorrectlyDivision.OK, "0", "overview.normal", 2);
        correctlyDivision.put(CorrectlyDivision.NG, "1", "overview.warning", 3);
        correctlyDivision.put(CorrectlyDivision.CRITICAL, "2", "overview.critical", 4);
        correctlyDivision.put(CorrectlyDivision.ERROR, "99", "overview.error", 5);
        divConstMap.put(CorrectlyDivision.class, correctlyDivision);
    }

    /* ================================================Methods for DivConst */
    /**
     * Get division item object by division key
     *
     * @author TuanDV
     * @param divKey
     *            division key
     * @return {@link DivItem} object
     */
    public static DivItem get(Enum<?> divKey) {
        DivMap<?> divMap = divConstMap.get(divKey.getDeclaringClass());
        DivItem ret = divMap.get(divKey);
        return ret;
    }

    /**
     * Get list {@link DivItem} object by division kind and sorted
     *
     * @param divisionKind
     *            division kind
     * @return list {@link DivItem} object
     */
    public static List<DivItem> getDivItemList(Class<? extends Enum<?>> divisionKind) {
        DivMap<?> divMap = divConstMap.get(divisionKind);
        List<DivItem> ret = new ArrayList<DivItem>(divMap.values());
        Collections.sort(ret, getComparator());
        return ret;
    }

    /**
     * Get division value by division key
     *
     * @author TuanDV
     * @param divKey
     *            division key
     * @return division value
     */
    public static String getValue(Enum<?> divKey) {
        DivItem item = get(divKey);
        if (item == null)
            return "";
        return item.value();
    }

    /**
     * Get division name by division key
     *
     * @author TuanDV
     * @param divKey
     *            division key
     * @return division name
     */
    public static String getName(Enum<?> divKey) {
        DivItem item = get(divKey);
        if (item == null)
            return "";
        return item.name();
    }

    /**
     * Get all division value by division kind
     *
     * @author TuanDV
     * @param divKind
     *            division kind
     * @return list division value
     */
    public static List<String> getValueList(Class<? extends Enum<?>> divisionKind) {
        List<String> ret = new ArrayList<String>();
        List<DivItem> divItemList = getDivItemList(divisionKind);
        for (DivItem item : divItemList) {
            ret.add(item.value());
        }
        return ret;
    }

    /**
     * Get all name of division kind
     *
     * @author TuanDV
     * @param divKind
     *            division kind
     * @return list division name
     */
    public static List<String> getNameList(Class<? extends Enum<?>> divisionKind) {
        List<String> ret = new ArrayList<String>();
        List<DivItem> divItemList = getDivItemList(divisionKind);
        for (DivItem item : divItemList) {
            ret.add(item.name());
        }
        return ret;
    }

    /**
     * Get division name by division value and division kind
     *
     * @author TuanDV
     * @param divKind
     *            Division kind
     * @param divValue
     *            Division value
     * @return Division name
     */
    public static String getName(Class<? extends Enum<?>> divKind, String divValue) {
        if (CommonUtil.isEmpty(divValue) || !divConstMap.containsKey(divKind)) {
            return "";
        }
        DivMap<?> divMap = divConstMap.get(divKind);
        for (DivItem di : divMap.values()) {
            if (divValue.equals(di.getValue())) {
                return di.getName();
            }
        }
        return "";
    }

    /**
     * Get value by divKey, use on jsp page
     *
     * @author TuanDV
     * @param divKey
     *            division key, ex: 'TimeType.MONTH'
     * @return value of division
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
    public static String getValue(String divKey) {
        String divVal = "";
        if (CommonUtil.isEmpty(divKey))
            return divVal;
        try {
            String[] aryEle = divKey.split("\\.");
            Class<?> clz = Class.forName(DivConst.class.getName() + "$" + aryEle[0]);
            Enum<?> enm = Enum.valueOf((Class<Enum>) clz, aryEle[1]);
            divVal = getValue(enm);
        } catch (Exception e) {
            LOGGER.error(e.toString(), e);
        }
        return divVal;
    }

    /**
     * Get name by division kind and division value, use on jsp page
     *
     * @author TuanDV
     * @param divKind
     *            division kind, ex: 'TimeType'
     * @param divValue
     *            division value, ex: '02'
     * @return
     */
    @SuppressWarnings({ "unchecked" })
    public static String getName(String divKind, String divValue) {
        String val = "";
        if (CommonUtil.isEmpty(divKind) || CommonUtil.isEmpty(divValue))
            return val;
        try {
            Class<?> clz = Class.forName(DivConst.class.getName() + "$" + divKind);
            val = getName((Class<? extends Enum<?>>) clz, divValue);
        } catch (Exception e) {
            LOGGER.error(e.toString(), e);
        }
        return val;
    }

    /**
     * Get comparator for sort list
     *
     * @author TuanDV
     * @return {@link Comparator} object
     */
    private static Comparator<DivItem> getComparator() {
        if (comparator == null) {
            comparator = new Comparator<DivItem>() {
                @Override
                public int compare(DivItem div1, DivItem div2) {
                    return div1.getDisplayOrder() - div2.getDisplayOrder();
                }
            };
        }
        return comparator;
    }
}
