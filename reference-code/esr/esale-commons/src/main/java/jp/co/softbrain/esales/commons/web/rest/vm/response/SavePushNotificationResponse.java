package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Save Push Notification Response
 * 
 * @author Admin
 *
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class SavePushNotificationResponse implements Serializable {

    private static final long serialVersionUID = 3680615050249044252L;

    private boolean isSuccess;
}
