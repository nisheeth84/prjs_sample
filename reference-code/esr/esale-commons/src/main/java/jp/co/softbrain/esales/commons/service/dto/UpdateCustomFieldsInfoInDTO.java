package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of request param API updateCustomFieldsInfo
 *
 * @author vuvankien
 */
@Data
@EqualsAndHashCode
public class UpdateCustomFieldsInfoInDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4128969657556542817L;

    private Long fieldId;

    private String fieldName;
    
    private Integer fieldBelong;

    private String fieldLabel;

    private Integer fieldType;

    private Integer fieldOrder;

    private Boolean isDefault;

    private Integer maxLength;

    private Integer modifyFlag;

    private boolean userModifyFlg;

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

    private UpdateCustomFieldsInfoSubType1DTO lookupData;

    private UpdateCustomFieldsInfoSubType3DTO relationData;

    private UpdateCustomFieldsInfoSubType5DTO selectOrganizationData;

    private List<Long> salesProcess;

    private boolean inTab;

    private List<Long> tabData;

    private List<FieldInfoItemDTO> fieldItems;
    
    private Long lookupFieldId;

    private Instant updatedDate;
    
    private UpdateCustomFieldsInfoSubType6DTO differenceSetting;
    
    private CopyFieldDTO copyField;
}
