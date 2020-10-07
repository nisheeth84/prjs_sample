package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * FlatMap with database for fastest way of extracting data.
 *
 * @author admin
 */

@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class CustomFieldsInfoResponseDTO implements Serializable {

    private static final long serialVersionUID = 7548611893231974960L;

    /**
     * fieldId
     */
    private Long fieldId;

    /**
     * fieldBelong
     */
    private Integer fieldBelong;

    /**
     *
     */
    private String fieldName;

    /**
     * fieldLabel
     */
    private String fieldLabel;

    /**
     * fieldType
     */
    private Integer fieldType;

    /**
     * fieldOrder
     */
    private Integer fieldOrder;

    /**
     * isDefault
     */
    private Boolean isDefault;

    /**
     * maxLength
     */
    private Integer maxLength;

    /**
     * modifyFlag
     */
    private Integer modifyFlag;

    /**
     * availableFlag
     */
    private Integer availableFlag;

    /**
     * isDoubleColumn
     */
    private Boolean isDoubleColumn;

    /**
     * defaultValue
     */
    private String defaultValue;

    /**
     * currencyUnit
     */
    private String currencyUnit;

    /**
     * typeUnit
     */
    private Integer typeUnit;

    /**
     * decimalPlace
     */
    private Integer decimalPlace;

    /**
     * urlType
     */
    private Integer urlType;

    /**
     * urlTarget
     */
    private String urlTarget;

    /**
     * urlText
     */
    private String urlText;

    /**
     * linkTarget
     */
    private Integer linkTarget;

    /**
     * linkTarget
     */
    private Integer iframeHeight;

    /**
     * configValue
     */
    private String configValue;

    /**
     * isLinkedGoogleMap
     */
    private Boolean isLinkedGoogleMap;

    /**
     * fieldGroup
     */
    private Long fieldGroup;

    /**
     * lookupData
     */
    private String lookupData;

    /**
     * relationData
     */
    private String relationData;

    /**
     * selectOrganizationData
     */
    private String selectOrganizationData;

    /**
     * tabData
     */
    private String tabData;

    private Long lookupFieldId;

    /**
     * createdDate
     */
    private Instant createdDate;

    /**
     * createdUser
     */
    private Long createdUser;

    /**
     * updatedDate
     */
    private Instant updatedDate;

    /**
     * updatedUser
     */
    private Long updatedUser;
    /**
     * itemItemId
     */
    private Long itemItemId;

    /**
     * itemIsAvailable
     */
    private Boolean itemIsAvailable;

    /**
     * itemIsDefault
     */
    private Integer itemItemOrder;

    /**
     * itemIsDefault
     */
    private Boolean itemIsDefault;

    /**
     * itemItemLabel
     */
    private String itemItemLabel;
    
    /**
     * difference Setting
     */
    private String differenceSetting;

    private Integer statisticsItemFlag;

    private Integer statisticsConditionFlag;
}
