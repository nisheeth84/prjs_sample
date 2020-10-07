package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response DTO for API [getFieldInfoPersonals]
 *
 * @author nghianv
 */
@Data
@EqualsAndHashCode
public class FieldInfoPersonalsOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7614870962549011250L;

    /**
     * 項目ID
     */
    private Long fieldId;

    /**
     * 項目名
     */
    private String fieldName;

    /**
     * ラベル名
     */
    private String fieldLabel;

    /**
     * 項目タイプ
     */
    private Integer fieldType;

    /**
     * 表示順
     */
    private Integer fieldOrder;

    /**
     * updatedDate
     */
    private Instant updatedDate;

    private Integer fieldBelong;
    private Boolean isDefault;
    private Integer maxLength;
    private Integer modifyFlag;
    private Integer availableFlag;
    private Boolean isDoubleColumn;
    private String defaultValue;
    private String currencyUnit;
    private Integer typeUnit;
    private Integer decimalPlace;
    private Integer urlType;
    private String urlTarget;
    private String urlText;
    private Integer linkTarget;
    private Integer iframeHeight;
    private String configValue;
    private Boolean isLinkedGoogleMap;
    private Long fieldGroup;
    private LookupDataDTO lookupData;
    private RelationDataDTO relationData;
    private SelectOrganizationDataDTO selectOrganizationData;
    private List<Long> tabData;
    private Long lookupFieldId;
    private List<FieldInfoPersonalFieldItemOutDTO> fieldItems = new ArrayList<>();
    private Boolean isColumnFixed;
    private Integer columnWidth;
    private Long relationFieldId;
    private DifferenceSettingDTO differenceSetting;
}
