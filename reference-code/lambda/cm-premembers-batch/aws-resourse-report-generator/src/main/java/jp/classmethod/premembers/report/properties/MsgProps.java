package jp.classmethod.premembers.report.properties;

import java.text.MessageFormat;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

/**
 * Message utilities
 *
 * @author TuanDV
 */
public final class MsgProps {
    private static Map<String, String> errMap = new HashMap<String, String>();
    private static Map<String, String> msgMap = new HashMap<String, String>();
    static {
        // check if error message file does not loaded then load it
        if (errMap.isEmpty()) {
            errMap = loadData("msg_err_jp");
            errMap = Collections.unmodifiableMap(errMap);
        }
        // check if message file does not loaded then load it
        if (msgMap.isEmpty()) {
            msgMap = loadData("msg_jp");
            msgMap = Collections.unmodifiableMap(msgMap);
        }
    }

    /**
     * Get message value
     *
     * @author TuanDV
     * @param key The key to get message string
     * @return string in properties file. if get msg failure then return key
     *
     */
    public static String getString(String key) {
        String msgResult = null;
        // Check two map not exist or key invalid
        if ((errMap == null && msgMap == null) || key == null || "".equals(key)) {
            return key;
        }

        // get message with prefix
        if (key.startsWith(MSGConst.ERR_PREFIX)) {
            msgResult = (String) errMap.get(key);
        } else {
            msgResult = (String) msgMap.get(key);
        }

        // if get msg failure then return key
        if (msgResult == null) {
            msgResult = key;
        }
        return msgResult;
    }

    /**
     * Get message based on parameters
     *
     * @author TuanDV
     * @param key msg key
     * @param params array object parameters
     * @return message, if get msg failure then return key
     */
    public static String getString(String key, Object[] params) {
        String msgResult = key;
        if (key != null && !"".equals(key) && params != null) {
            // Get message
            msgResult = getString(key);
            if (!key.equals(msgResult)) {
                // Replace patern '{0}' to ''{0}''
                msgResult = msgResult.replaceAll(MSGConst.MSG_LEFT_SINGLE_QUOTE_BEFORE_REPLACE, MSGConst.MSG_LEFT_SINGLE_QUOTE_AFTER_REPLACE);
                msgResult = msgResult.replaceAll(MSGConst.MSG_RIGHT_SINGLE_QUOTE_BEFORE_REPLACE, MSGConst.MSG_RIGHT_SINGLE_QUOTE_AFTER_REPLACE);
                // Replace param
                try {
                    msgResult = MessageFormat.format(msgResult, params);
                } catch (IllegalArgumentException lae) {
                    lae.printStackTrace();
                }
            }
        }
        return msgResult;
    }

    /**
     * Get message and a parameter
     *
     * @author TuanDV
     * @param key The key to get message string
     * @param param parameter to put in message
     * @return string in properties file. if get msg failure then return key
     */
    public static String getString(String key, String param) {
        return getString(key, new Object[]{param});
    }

    /**
     * Load message config
     *
     * @author TuanDV
     * @param fileName specified file to load message
     * @return HashMap contains messages info
     */
    private static HashMap<String, String> loadData(String fileName) {
        ResourceBundle resourceBundle = null;
        String key = null;
        String value = null;
        HashMap<String, String> messageMap = new HashMap<String, String>();
        try {
            // get resource bundle
            resourceBundle = ResourceBundle.getBundle(fileName);

            // load all message in file
            Enumeration<String> en  = (Enumeration<String>) resourceBundle.getKeys();
            while (en.hasMoreElements()) {
                key = (String) en.nextElement();
                value = resourceBundle.getString(key);
                messageMap.put(key, value);
            }
        } catch (MissingResourceException e) {
            e.printStackTrace();
        }
        return messageMap;
    }

    /**
     * msg constant for class
     */
    public class MSGConst {
        private static final String ERR_PREFIX = "ERR";
        private static final String MSG_LEFT_SINGLE_QUOTE_BEFORE_REPLACE = "'\\{";
        private static final String MSG_LEFT_SINGLE_QUOTE_AFTER_REPLACE = "''{";
        private static final String MSG_RIGHT_SINGLE_QUOTE_BEFORE_REPLACE = "}'";
        private static final String MSG_RIGHT_SINGLE_QUOTE_AFTER_REPLACE = "}''";
    }
}
