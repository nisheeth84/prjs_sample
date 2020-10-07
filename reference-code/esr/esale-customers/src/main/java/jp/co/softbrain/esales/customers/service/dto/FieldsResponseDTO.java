package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Wrap data based on design output.
 *
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class FieldsResponseDTO extends BaseDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6746291026313860958L;

    private Long fieldId;
    private Integer fieldBelong;
    private String fieldName;
    private String fieldLabel;
    private Integer fieldType;
    private Integer fieldOrder;
    private Boolean isDefault;
    private Boolean isDoubleColumn;
    private String urlTarget;
    private String urlText;
    private String configValue;
    private Integer decimalPlace;
    private Integer linkTarget;
    private Integer iframeHeight;
    private Boolean isLinkedGoogleMap;
    private Integer maxLength;
    private Integer modifyFlag;
    private Integer availableFlag;
    private String defaultValue;
    private String currencyUnit;
    private Integer typeUnit;
    private Integer urlType;
    private Long fieldGroup;
    private LookupDataDTO lookupData;
    private RelationDataDTO relationData;
    private List<Long> tabData;

    private List<CustomFieldItemResponseDTO> fieldItems = new ArrayList<>();

    private Integer searchType;
    private Integer searchOption;

}
