package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Field info dto from sql
 *
 * @author nghianv
 */
@NoArgsConstructor
@AllArgsConstructor()
@Data
@EqualsAndHashCode
public class FieldInfoPersonalResponseDTO implements Serializable {

    /**
     * the serialVersionUID
     */
    private static final long serialVersionUID = -3691599864556030974L;

    private Long fieldId;
    private String fieldName;
    private String fieldLabel;
    private Integer fieldType;
    private Integer fieldOrder;
    private Long itemId;
    private String itemLabel;
    private Integer itemOrder;
    private Boolean itemIsDefault;
    private Boolean itemIsAvailable;
    private Instant itemUpdatedDate;
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
    private String lookupData;
    private String relationData;
    private String selectOrganizationData;
    private String tabData;
    private Long lookupFieldId;
    private Instant updatedDate;
    private Boolean isColumnFixed;
    private Integer columnWidth;
    private Long relationFieldId;
    private String differenceSetting;
}
