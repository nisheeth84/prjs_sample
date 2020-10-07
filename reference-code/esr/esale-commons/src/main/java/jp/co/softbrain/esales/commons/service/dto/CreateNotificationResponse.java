package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateNotificationOutDTO
 *
 * @author lequyphuc
 * @see Serializable
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CreateNotificationResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2284645317153201719L;

    /**
     * notificationIds
     */
    private List<Long> notificationIds;
}
