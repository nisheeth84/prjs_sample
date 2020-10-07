package jp.co.softbrain.esales.commons.validator.utils;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.validator.ItemValidationInfo;
import jp.co.softbrain.esales.commons.validator.errors.FormatCheckException;
import jp.co.softbrain.esales.commons.validator.errors.RequiredCheckException;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.utils.CheckUtil;
import jp.co.softbrain.esales.utils.DateUtil;
import jp.co.softbrain.esales.utils.StringUtil;

/**
 * ItemCheckUtilクラス
 */
@Component
public class ItemCheckUtil {

    // 設定項目は、検証の日付を受け入れる 0000/00/00

    private static final String DATE_CORRECT = "date-correct";

    private static final String NUMBER_STR = "0123456789";

    private static final String DATE_TIME_CORRECT = "data-time-correct";

    private static final String EMAIL = "email";

    private static final String EMAIL_CORRECT = "email-correct";

    private static final Object IP_ADDRESS = "ipAddress";

    private static final String IP_ADDRESS_CORRECT = "ipAddress-correct";

    private static final String IS_DATE_FORMAT = "is_date";

    /**
     * 単項目チェック
     *
     * @param param ItemValidationInfoValueオブジェクト
     * @param item チェックする項目の値
     * @param property チェックする項目の名前
     * @throws Exception
     */
    public void checkItem(ItemValidationInfo param, String item, String property, String formatDate) throws Exception {

        // ■文字種チェック
        // チェック用変数
        StringBuilder strCheck = new StringBuilder();

        // 半角英字チェック
        if (param.isAlph()) {
            strCheck.append("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
        }

        // 半角数字チェック
        if (param.isNum()) {
            strCheck.append(NUMBER_STR);
        }

        // 半角記号チェック
        if (param.isCode()) {
            strCheck.append("!#$%&'()*+,-ｰ./:;<=>?@[]^_`{|}~｡｢｣､･ ").append("'\\'").append('"');
        }

        // 半角カナチェック
        if (param.isKanaHalfsize()) {
            strCheck.append(StringUtil.getKanaHalfSize());
        }

        // 全角カナチェック
        if (param.isKanaFullsize()) {
            strCheck.append(StringUtil.getKanaFullSize());
            strCheck.append("０１２３４５６７８９ｑｗｅｒｔｙｕｉｏｐａｓｄｆｇｈｊｋｌｚｘｃｖｂｎｍＱＷＥＲＴＹＵＩＯＰＬＫＪＨＧＦＤＳＡＺＸＣＶＢＮＭ");
            strCheck.append("／．，’；］［￥＝‘！＠＃＄％＾＆＊（）＿＋｜｛｝：”＜＞？、。・；’「」､｡･｢｣　゜ﾟ゛ーｰ");
        }

        String itemSJIS = StringUtil.EMPTY;
        try {
            itemSJIS = new String(item.getBytes(Constants.Text.WINDOWS_31J), Constants.Text.WINDOWS_31J);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

        List<String> errorTypeList;
        checkHantei(param, item, property, strCheck, itemSJIS);

        errorTypeList = new ArrayList<>();
        checkLength(param, item, property, errorTypeList);

        checkNum(param, item, property, errorTypeList);

        checkNumLength(param, item, property, errorTypeList);

        checkFile(param, item, property, errorTypeList);

        checkFormat(param, item, property, errorTypeList, formatDate);
    }

    private void checkHantei(ItemValidationInfo param, String item, String property, StringBuilder strCheck,
            String itemSJIS) throws FormatCheckException {
        List<String> errorTypeList;
        for (int i = 0; i < item.length(); i++) {
            char strMoji;
            char cSJIS;
            boolean hanteiFlag;
            strMoji = item.charAt(i);
            cSJIS = itemSJIS.charAt(i);
            errorTypeList = new ArrayList<>();

            // 文字種未設定の場合は、文字種チェックを行わない。
            hanteiFlag = !StringUtils.isEmpty(strCheck) || param.isFullwidth();

            if (!StringUtils.isEmpty(strCheck)) {

                // 改行コード許容
                strCheck.append(Constants.Text.CRLF);

                if (strCheck.indexOf(StringUtil.EMPTY + strMoji) >= 0) {
                    hanteiFlag = false;

                } else {
                    hanteiFlag = true;
                }
            }

            // 全角チェック
            if (hanteiFlag && param.isFullwidth()) {
                try {
                    if (Character.toString(cSJIS).getBytes(Constants.Text.WINDOWS_31J).length >= 2) {
                        hanteiFlag = false;
                    } else {
                        hanteiFlag = true;
                    }
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }
            }

            // チェックエラーが発生した場合
            if (hanteiFlag) {
                checkHanteiFlag(param, property, errorTypeList);
            }
        }
    }

    private void checkFormat(ItemValidationInfo param, String item, String property, List<String> errorTypeList, String formatDate)
            throws FormatCheckException {
        // validate format
        if (param.getFormat() != null && !StringUtil.isEmpty(param.getFormat())) {
            // validate time HH:mm
            if (DateUtil.FORMAT_HOUR_MINUTE.equals(param.getFormat())) {
                checkHHMM(item, property, errorTypeList);
                // validate date time yyyy/MM/dd HH:mm:ss
            } else if (DateUtil.FORMAT_YEAR_MONTH_DAY_SEC_SLASH.equals(param.getFormat()) || IS_DATE_FORMAT.equals(param.getFormat())) {
                SimpleDateFormat formatter = new SimpleDateFormat(String.format("%s HH:mm:ss", formatDate));
                if (StringUtils.isBlank(formatDate) || !CheckUtil.isDateFormat(item, formatter)) {
                    errorTypeList.add(DATE_TIME_CORRECT);
                    throw new FormatCheckException(Constants.FORMAT_INVALID_CODE,
                            errorTypeList.toArray(new String[errorTypeList.size()]), property);
                }
                // validate date yyyy/MM/dd
            } else if (DateUtil.FORMAT_YEAR_MONTH_DAY_SLASH.equals(param.getFormat()) || IS_DATE_FORMAT.equals(param.getFormat())) {
                String date = String.format("%s 00:00:00", item);
                SimpleDateFormat formatter = new SimpleDateFormat(String.format("%s HH:mm:ss", formatDate));
                if (StringUtils.isBlank(formatDate) || !CheckUtil.isDateFormat(date, formatter)) {
                    errorTypeList.add(DATE_CORRECT);
                    throw new FormatCheckException(Constants.FORMAT_INVALID_CODE,
                            errorTypeList.toArray(new String[errorTypeList.size()]), property);
                }
                // validate email
            } else if (EMAIL.equals(param.getFormat()) && !CheckUtil.isMailAddress(item)) {
                errorTypeList.add(EMAIL_CORRECT);
                throw new FormatCheckException(Constants.FORMAT_INVALID_CODE,
                        errorTypeList.toArray(new String[errorTypeList.size()]), property);
                // validate ip address
            } else if (IP_ADDRESS.equals(param.getFormat()) && !item.matches(ConstantsCommon.REGEX_IP_ADDRESS)) {
                errorTypeList.add(IP_ADDRESS_CORRECT);
                throw new FormatCheckException(Constants.FORMAT_INVALID_CODE,
                        errorTypeList.toArray(new String[errorTypeList.size()]), property);
            }
        }
    }

    private void checkHHMM(String item, String property, List<String> errorTypeList) throws FormatCheckException {
        boolean result;
        result = item.matches("[0-2][0-9]:*[0-5][0-9]");
        if (result) {
            String hhmm = item.length() == DateUtil.FORMAT_HOUR_MINUTE.length()
                    ? item.replace(":", StringUtil.EMPTY)
                    : item;
            if ((hhmm.substring(0, 2).compareTo("24") >= 0) || (hhmm.substring(2, 4).compareTo("60") >= 0)) {
                result = false;
            }
        }
        if (!result) {
            errorTypeList.add("time-correct");
            throw new FormatCheckException(Constants.FORMAT_INVALID_CODE,
                    errorTypeList.toArray(new String[errorTypeList.size()]), property);
        }
    }

    private void checkFile(ItemValidationInfo param, String item, String property, List<String> errorTypeList)
            throws FormatCheckException {
        // validate file extension
        if (param.getFileExtension() != null && !param.getFileExtension().isEmpty()) {
            boolean check = false;
            if (item.endsWith(".png")) {
                check = true;
            }
            if (item.endsWith(".jpg")) {
                check = true;
            }
            if (item.endsWith(".gif")) {
                check = true;
            }
            if (!check) {
                errorTypeList.add("not-image");
                throw new FormatCheckException(Constants.INVALID_PARAMETER,
                        errorTypeList.toArray(new String[errorTypeList.size()]), property);
            }
        }

        // validate file size
        if (param.getFileSize() != null && param.getFileSize() != 0) {
            File file;
            file = new File(item);
            double kilobytes = 0;
            if (file.exists()) {
                double bytes;
                bytes = file.length();
                kilobytes = (bytes / 1024);
            }
            if (param.getFileSize().compareTo(kilobytes) < 0) {
                errorTypeList.add("over-size");
                throw new FormatCheckException(Constants.INVALID_PARAMETER,
                        errorTypeList.toArray(new String[errorTypeList.size()]), property);
            }
        }
    }

    private void checkNumLength(ItemValidationInfo param, String item, String property, List<String> errorTypeList)
            throws FormatCheckException {
        BigDecimal numItem;
        // 数字、最大
        if (param.getNumMax() != null) {
            numItem = new BigDecimal(item);
            if (param.getNumMax().compareTo(numItem) < 0) {
                // 埋め字設定
                errorTypeList.add(param.getNumMax().toString());
                throw new FormatCheckException(Constants.NUMBER_MAX_CODE,
                        errorTypeList.toArray(new String[errorTypeList.size()]), property);
            }
        }
        // 数字、最小
        if (param.getNumMin() != null) {
            // 埋め字設定
            numItem = new BigDecimal(item);
            if (param.getNumMin().compareTo(numItem) > 0) {
                errorTypeList.add(param.getNumMin().toString());
                throw new FormatCheckException(Constants.NUMBER_MIN_CODE,
                        errorTypeList.toArray(new String[errorTypeList.size()]), property);
            }
        }
    }

    private void checkNum(ItemValidationInfo param, String item, String property, List<String> errorTypeList)
            throws FormatCheckException {
        BigDecimal numItem;
        // 数値妥当性チェック
        numItem = getNumItem(param, item, property);

        // 整数桁数
        if (param.getNumSeisuLength() != null) {
            StringBuilder strSeisuKeta = new StringBuilder(StringUtil.EMPTY);
            String seisu = numItem != null ? numItem.toBigInteger().toString() : "";

            // 「-,」は除く
            for (int m = 0; m < seisu.length(); m++) {
                if (seisu.charAt(m) != '-') {
                    strSeisuKeta.append(seisu.charAt(m));
                }
            }

            if (strSeisuKeta.length() > param.getNumSeisuLength()) {
                errorTypeList.add(param.getNumSeisuLength().toString());
                throw new FormatCheckException(Constants.POSITIVE_CODE,
                        errorTypeList.toArray(new String[errorTypeList.size()]), property);
            }
        }

        // 小数桁数
        if (param.getNumShosuLength() != null) {
            String[] shosu = null;
            if (item.indexOf(Constants.PERIOD) != -1) {
                shosu = numItem != null ? numItem.toString().split("\\."): new String[1];

                if (shosu.length != 2 || shosu[1].length() > param.getNumShosuLength()) {
                    errorTypeList.add(param.getNumShosuLength().toString());
                    throw new FormatCheckException(Constants.DECIMAL_CODE,
                            errorTypeList.toArray(new String[errorTypeList.size()]), property);
                }
            }
        }
    }

    private BigDecimal getNumItem(ItemValidationInfo param, String item, String property)
            throws FormatCheckException {
        BigDecimal numItem = null;
        if (param.getNumSeisuLength() != null) {
            StringBuilder strSuchi = new StringBuilder(StringUtil.EMPTY);
            for (int n = 0; n < item.length(); n++) {
                if (item.charAt(n) != ',') {
                    strSuchi.append(item.charAt(n));
                }
            }

            try {
                numItem = new BigDecimal(strSuchi.toString());

                if (strSuchi.toString().contains("+")) {
                    throw new NumberFormatException();
                }
            } catch (NumberFormatException e) {
                throw new FormatCheckException(Constants.NUMBER_INVALID_CODE, new String[] {}, property);
            }
        }
        return numItem;
    }

    private void checkLength(ItemValidationInfo param, String item, String property, List<String> errorTypeList)
            throws FormatCheckException {
        // ■桁数チェック
        // byte数、最大
        // byte数、最小
        if (param.getLengthMax() != null || param.getLengthMin() != null) {
            StringBuilder strKeta = new StringBuilder(StringUtil.EMPTY);

            // 「/.」は除く
            for (int j = 0; j < item.length(); j++) {
                if (isByteCheckContainChara(item.charAt(j), param)) {
                    strKeta.append(item.charAt(j));
                }
            }

            // バイト数取得
            if (strKeta.toString().length() > param.getLengthMax()) {
                if (param.getLengthMin() != null) {
                    errorTypeList.add(param.getLengthMin().toString());
                }
                if (param.getLengthMax() != null) {
                    errorTypeList.add(param.getLengthMax().toString());
                }
                throw new FormatCheckException(Constants.GREATER_LENGTH_CODE,
                        errorTypeList.toArray(new String[errorTypeList.size()]), property);
            } else if (strKeta.toString().length() < param.getLengthMin()) {
                errorTypeList.add(param.getLengthMin().toString());
                errorTypeList.add(param.getLengthMax().toString());
                throw new FormatCheckException(Constants.LESS_LENGTH_CODE,
                        errorTypeList.toArray(new String[errorTypeList.size()]), property);
            }
        }
    }

    private void checkHanteiFlag(ItemValidationInfo param, String property, List<String> errorTypeList)
            throws FormatCheckException {
        // 半角英字チェック
        if (param.isAlph()) {
            // 埋め字設定
            errorTypeList.add("alphabe");
        }

        // 半角数字チェック
        if (param.isNum()) {
            // 埋め字設定
            errorTypeList.add("number");
        }

        // 半角記号チェック
        if (param.isCode()) {
            // 埋め字設定
            errorTypeList.add("symbol");
        }

        // 半角カナチェック
        if (param.isKanaHalfsize()) {
            // 埋め字設定
            errorTypeList.add("kana-halfsize");
        }

        // 半角カナチェック
        if (param.isKanaFullsize()) {
            // 埋め字設定
            errorTypeList.add("kana-fullsize");
        }

        // 全角チェック
        if (param.isFullwidth()) {
            // 埋め字設定
            errorTypeList.add("fullsize");
        }

        throw new FormatCheckException(Constants.FORMAT_INVALID_CODE,
                errorTypeList.toArray(new String[errorTypeList.size()]), property);
    }

    /**
     * バイト桁数チェック字にチェック対象とする文字か判定する
     *
     * @param data データのCHAR
     * @param param ItemValidationInfoValueオブジェクト
     * @return
     */
    protected boolean isByteCheckContainChara(char data, ItemValidationInfo param) {

        if (DateUtil.FORMAT_YEAR_MONTH_DAY_SLASH.equals(param.getFormat())
                || DateUtil.FORMAT_YEAR_MONTH_SLASH.equals(param.getFormat())) {
            return data != '/';
        } else if (DateUtil.FORMAT_HOUR_MINUTE.equals(param.getFormat())) {
            return data != ':';
        } else if (param.getNumShosuLength() != null || param.getNumSeisuLength() != null) {
            return data != '.' && data != ',';
        }

        return true;
    }

    /**
     * チェックに必要
     *
     * @param inputValue チェックする項目の値
     * @param property チェックする項目の名前
     * @throws RequiredCheckException
     */
    public void checkRequired(String inputValue, String property) throws RequiredCheckException {

        boolean error = true;

        if (inputValue != null) {
            error = inputValue.length() == 0;
        }

        if (error) {
            throw new RequiredCheckException(Constants.RIQUIRED_CODE, new String[] {}, property);
        }
    }

}
