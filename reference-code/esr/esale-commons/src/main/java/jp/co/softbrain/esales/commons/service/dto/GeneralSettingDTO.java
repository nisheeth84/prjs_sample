package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;

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
    private static final long serialVersionUID = -8392029767320607069L;

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

    /**
     * createdDate
     */
    private Instant createdDate;

    /**
     * The createdUser
     */
    private Long createdUser;

    /**
     * The updatedDate
     */
    private Instant updatedDate;

    /**
     * The updatedUser
     */
    private Long updatedUser;
}
