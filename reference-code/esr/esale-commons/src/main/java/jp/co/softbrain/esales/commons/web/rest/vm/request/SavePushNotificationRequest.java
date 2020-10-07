package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Save Push Notification Request
 * 
 * @author Admin
 *
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class SavePushNotificationRequest implements Serializable {
    private static final long serialVersionUID = 7815090050306777298L;

    private Long employeeId;
    private String deviceUniqueId;
    private String deviceToken;
    private String tenantId;
    private Boolean isLogged;
}
