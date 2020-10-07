package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class FieldsInfoOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -9131459938297935161L;

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
    private List<Integer> tabData;
    private Long lookupFieldId;
    private Long createdUser;
    private Long updatedUser;
    private Instant updatedDate;
    private Instant createdDate;
    private List<FieldInfoItemDTO> fieldItems = new ArrayList<>();
}
