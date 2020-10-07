package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateNotificationResponse
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class CreateNotificationResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1526437885767L;

    /**
     * notificationIds
     */
    private List<Long> notificationIds;

}
