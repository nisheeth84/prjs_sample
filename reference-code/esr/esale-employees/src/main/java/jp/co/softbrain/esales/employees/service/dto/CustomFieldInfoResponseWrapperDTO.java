package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Wrap data based on design output.
 *
 * @author admin
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomFieldInfoResponseWrapperDTO extends BaseDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2284642417153201719L;

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

}
