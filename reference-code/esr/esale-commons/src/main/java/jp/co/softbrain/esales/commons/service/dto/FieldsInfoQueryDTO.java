/**
 * 
 */
package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.FieldInfo} entity.
 * 
 * @author nguyentienquan
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class FieldsInfoQueryDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -9058354037817382915L;
    
    private Integer fieldBelong;
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
    private Boolean isLinkedGoogleMap;
    private Long fieldGroup;
    private Long fieldId;
    private String fieldName;
    private String fieldLabel;
    private Integer fieldType;
    private Integer fieldOrder;
    private Boolean isDefault;
    private Long lookupFieldId;
    private String configValue;
    private String lookupData;
    private String relationData;
    private String selectOrganizationData;
    private String tabData;
    private Instant updatedDate;
    private Long createdUser;
    private Long updatedUser;
    private Instant createdDate;
}
