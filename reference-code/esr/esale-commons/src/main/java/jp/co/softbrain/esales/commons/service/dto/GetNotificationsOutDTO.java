package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Get Notifications Out DTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class GetNotificationsOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3535492872238061030L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * data
     */
    private List<GetNotificationsSubType1DTO> data;
}
