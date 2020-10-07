package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CreateNotificationInSubType9DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class CreateNotificationInSubType9DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1326237626246L;

    /**
     * importId
     */
    private Long importId;
    /**
     * recceiverIds
     */
    private List<Long> receiverIds;
    /**
     * importMode
     */
    private int importMode;

}
