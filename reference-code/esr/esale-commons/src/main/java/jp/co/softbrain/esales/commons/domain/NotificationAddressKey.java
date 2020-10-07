package jp.co.softbrain.esales.commons.domain;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 *NotificationAddressKey
 *
 * @author lequyphuc
 *
 */
@NoArgsConstructor
@AllArgsConstructor
public class NotificationAddressKey implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 64363463436431L;
    
    private Long employeeId;
    
    private Long notificationId;

}
