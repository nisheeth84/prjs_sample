package jp.co.softbrain.esales.uaa.service.dto.commons;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.uaa.service.dto.BaseDTO;
import jp.co.softbrain.esales.utils.dto.RelationDataDTO;
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
    private static final long serialVersionUID = -448073331489788154L;

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
    private Integer ownPermissionLevel;
    private Integer othersPermissionLevel;
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
