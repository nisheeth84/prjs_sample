package jp.co.softbrain.esales.commons.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * UpdateGeneralSettingOutDTO
 *
 * @author ThaiVV
 */
@Data
@EqualsAndHashCode
public class UpdateGeneralSettingOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5408032655260685772L;

    /**
     * generalSettingId
     */
    private Long generalSettingId;
}
