package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * UpdateGeneralSettingDTO
 *
 * @author ThaiVV
 */
@Data
@EqualsAndHashCode
public class UpdateGeneralSettingDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4602312544710928053L;

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
