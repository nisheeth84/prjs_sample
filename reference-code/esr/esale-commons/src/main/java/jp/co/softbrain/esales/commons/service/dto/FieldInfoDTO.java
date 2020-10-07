package jp.co.softbrain.esales.commons.service.dto;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.FieldInfo} entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class FieldInfoDTO extends BaseDTO implements Serializable {
	private static final long serialVersionUID = -2003239829695943758L;

    private Long fieldId;

    private Integer fieldBelong;

    private String fieldName;

    private String fieldLabel;

    private Integer fieldType;

    private Integer fieldOrder;

    private Integer modifyFlag;

    private Boolean isDoubleColumn;

    private String urlTarget;

    private Integer availableFlag;

    private String currencyUnit;

    private String urlText;

    private String configValue;

    private Integer decimalPlace;

    private Integer linkTarget;

    private Integer iframeHeight;

    private Boolean isLinkedGoogleMap;

    private String defaultValue;

    private Long fieldGroup;

    private String lookupData;

    private String relationData;
    
    private String selectOrganizationData;

    private Integer urlType;

    private Boolean isDefault;

    private Integer maxLength;

    private Integer typeUnit;

    private String tabData;
    
    private Long lookupFieldId;
    
    private String differenceSetting;
    
    private Integer statisticsItemFlag;
    
    private Integer statisticsConditionFlag;
}
