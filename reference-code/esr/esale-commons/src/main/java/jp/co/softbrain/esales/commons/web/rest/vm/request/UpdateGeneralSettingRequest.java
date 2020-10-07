package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Update General Setting Request
 *
 * @author ThaiVV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class UpdateGeneralSettingRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1527889034081720565L;

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
     * updatedDate
     */
    private Instant updatedDate;
}
