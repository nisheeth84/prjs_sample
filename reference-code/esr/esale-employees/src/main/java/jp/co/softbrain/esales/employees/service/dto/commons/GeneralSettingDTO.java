package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;

import jp.co.softbrain.esales.employees.service.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.GeneralSetting}
 * entity.
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class GeneralSettingDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1415433749658373731L;

    /**
     * generalSettingId
     */
    private Long generalSettingId;

    /**
     * settingName
     */
    private String settingName;

    /**
     * settingValue
     */
    private String settingValue;
}
