package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for employeeLayout API
 *
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeeLayoutDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -68982302451281180L;

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
    private Long lookupFieldId;
    private Instant updatedDate;
    private List<CustomFieldItemDTO> fieldItems = new ArrayList<>();
    private SelectOrganizationDataDTO selectOrganizationData;
    private DifferenceSettingDTO differenceSetting;

}
