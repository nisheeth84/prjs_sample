package jp.co.softbrain.esales.commons.validator;

import java.io.Serializable;
import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Load CSV to the list of this class for validation
 *
 */
@Data
@EqualsAndHashCode
public class ItemValidationInfo implements Serializable {

    private static final long serialVersionUID = 2075437310131002154L;

    /**
     * row index
     */
    private Long index = null;

    /**
     * conlumn name
     */
    private String dbColumn = null;

    /**
     * 項目ID
     */
    private String property = null;

    /**
     * 半角英字チェック
     */
    private boolean alph = false;

    /**
     * 半角数字チェック
     */
    private boolean num = false;

    /**
     * 半角記号チェック
     */
    private boolean code = false;

    /**
     * 半角カナチェック
     */
    private boolean kanaHalfsize = false;

    /**
     * 全角カナチェック
     */
    private boolean kanaFullsize = false;

    /**
     * 全角チェック
     */
    private boolean fullwidth = false;

    /**
     * byte数、最大
     */
    private Long lengthMax = null;

    /**
     * byte数、最小
     */
    private Long lengthMin = null;

    /**
     * 数字、最大
     */
    private BigDecimal numMax = null;

    /**
     * 数字、最小
     */
    private BigDecimal numMin = null;

    /**
     * 整数桁数
     */
    private Integer numSeisuLength = 0;

    /**
     * 少数桁数
     */
    private Integer numShosuLength = 0;

    /**
     * フォーマットチェック
     */
    private String format = null;

    /**
     * setting up flag required check
     */
    private boolean required = false;
    
    /**
     * File Extension
     */
    private String fileExtension;
    
    /**
     * File Size 
     */
    private Double fileSize;
}