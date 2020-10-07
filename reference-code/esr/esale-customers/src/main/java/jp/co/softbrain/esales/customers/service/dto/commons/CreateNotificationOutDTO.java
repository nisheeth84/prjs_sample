package jp.co.softbrain.esales.customers.service.dto.commons;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * CreateNotificationOutDTO
 *
 * @author ThaiVV
 * @see Serializable
 */
@Data
@EqualsAndHashCode
public class CreateNotificationOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2284645317153201719L;

    /**
     * notificationId
     */
    private Long notificationId;
}
