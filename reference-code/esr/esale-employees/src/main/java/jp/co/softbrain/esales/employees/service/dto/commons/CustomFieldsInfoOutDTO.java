package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Wrap data based on design output.
 *
 * @author admin
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomFieldsInfoOutDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5824358743712871456L;

    private Long fieldId;
    private Integer fieldBelong;
    private String fieldName;
    private String fieldLabel;
    private Integer fieldType;
    private Integer fieldOrder;
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
    
    private List<CustomFieldsItemResponseDTO> fieldItems = new ArrayList<>();
    private DifferenceSettingDTO differenceSetting;

}
