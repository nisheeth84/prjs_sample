package jp.co.softbrain.esales.commons.validator.utils;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import jp.co.softbrain.esales.commons.validator.ItemValidationInfo;

/**
 * Configuration of validate single item
 */
@Component
public class ItemPropertyUtil  {

    private static final String CHECK_LIST_NAME = "iteminfo.tsv";
    private static final String VALIDATE_CONFIG_PATH = "validate/" + CHECK_LIST_NAME;
    private static final String ONE_CHAR = "1";

    private static Map<String, ItemValidationInfo> paramMap = new HashMap<>();

    @Autowired
    ResourceLoader resourceLoader;

    /**
     * クラスの初期プロパティ
     *
     */
    protected enum TSV {
        INDEX(0), DBCOLUMN(1), PROPERTY(2), ALPH(3), NUM(4), CODE(5), HALFWIDTH(6), KANAFULLWIDTH(7), FULLWIDTH(8),
        LENGTHMAX(9), LENGTHMIN(10), NUMMAX(11), NUMMIN(12), NUMSEISULENGTH(13), NUMSHOSULENGTH(14), FORMAT(15),
        FILE_EXT(16), FILE_SIZE(17);

        private int index;

        TSV(int index) {
            this.index = index;
        }

        public int getIndex() {
            return index;
        }
    }

    /**
     * 初期リソース取得処理
     *
     * @throws IllegalStateException
     */
    static {

        InputStream istream = null;
        try {
            istream = new ClassPathResource(VALIDATE_CONFIG_PATH).getInputStream();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(istream))) {
                boolean fisrtLine = true;
                while (reader.ready()) {
                    String line = reader.readLine();
                    if (fisrtLine) {
                        fisrtLine = false;
                        continue;
                    }
                    // 1行をデータの要素に分割
                    ItemValidationInfo infoValue = createInfoValue(line);
                    if (paramMap.containsKey(infoValue.getProperty())) {
                        throw new Exception("Duplicate item [" + infoValue.getProperty() + "] in file [" + CHECK_LIST_NAME + "]!");
                    }
                    paramMap.put(infoValue.getProperty(), infoValue);
                }
            }
        } catch (Exception e) {
            throw new IllegalStateException(e);
        } finally {
            if (istream != null) {
                try {
                    istream.close();
                } catch (Exception e) {
                    // do nothing
                }
            }
        }
    }

    /**
     * ItemValidationInfoオブジェクトのデータを作成する
     *
     * @param tsv
     * @return
     */
    private static ItemValidationInfo createInfoValue(String tsv) {
        String[] items = tsv.split("\t", 30);
        ItemValidationInfo param;
        param = new ItemValidationInfo();
        param.setIndex(Long.valueOf(items[TSV.INDEX.getIndex()]));
        param.setDbColumn(items[TSV.DBCOLUMN.getIndex()]);
        param.setProperty(items[TSV.PROPERTY.getIndex()]);
        param.setAlph(ONE_CHAR.equals(items[TSV.ALPH.getIndex()]));
        param.setNum(ONE_CHAR.equals(items[TSV.NUM.getIndex()]));
        param.setCode(ONE_CHAR.equals(items[TSV.CODE.getIndex()]));
        param.setKanaHalfsize(ONE_CHAR.equals(items[TSV.HALFWIDTH.getIndex()]));
        param.setKanaFullsize(ONE_CHAR.equals(items[TSV.KANAFULLWIDTH.getIndex()]));
        param.setFullwidth(ONE_CHAR.equals(items[TSV.FULLWIDTH.getIndex()]));
        param.setLengthMax(!StringUtils.isEmpty(items[TSV.LENGTHMAX.getIndex()]) ? Long.valueOf(items[TSV.LENGTHMAX.getIndex()]) : null);
        param.setLengthMin(!StringUtils.isEmpty(items[TSV.LENGTHMIN.getIndex()]) ? Long.valueOf(items[TSV.LENGTHMIN.getIndex()]) : null);
        param.setNumMax(!StringUtils.isEmpty(items[TSV.NUMMAX.getIndex()]) ? new BigDecimal(items[TSV.NUMMAX.getIndex()]) : null);
        param.setNumMin(!StringUtils.isEmpty(items[TSV.NUMMIN.getIndex()]) ? new BigDecimal(items[TSV.NUMMIN.getIndex()]) : null);
        param.setNumSeisuLength(!StringUtils.isEmpty(items[TSV.NUMSEISULENGTH.getIndex()]) ? Integer.valueOf(items[TSV.NUMSEISULENGTH.getIndex()]) : null);
        param.setNumShosuLength(!StringUtils.isEmpty(items[TSV.NUMSHOSULENGTH.getIndex()]) ? Integer.valueOf(items[TSV.NUMSHOSULENGTH.getIndex()]) : null);
        param.setFormat(items[TSV.FORMAT.getIndex()]);
        param.setFileExtension(items[TSV.FILE_EXT.getIndex()]);
        param.setFileSize(!StringUtils.isEmpty(items[TSV.FILE_SIZE.getIndex()]) ? Double.valueOf(items[TSV.FILE_SIZE.getIndex()]) : null);
        return param;
    }

    /**
     *
     * 指定したpropertyの単項目情報を取得する
     *
     * @param property
     * @return
     */
    public ItemValidationInfo getItemInfo(String property) {

        String key = null;
        if (property.lastIndexOf('.') < 0) {
            key = property;
        } else {
            key = property.substring(property.lastIndexOf('.') + 1);
        }

        return paramMap.get(key);
    }

}
