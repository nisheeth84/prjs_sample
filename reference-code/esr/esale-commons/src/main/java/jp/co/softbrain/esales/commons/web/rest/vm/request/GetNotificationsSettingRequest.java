package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetNotificationsSettingRequest implements Serializable {
    private static final long serialVersionUID = -4771006480426437908L;
    
    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * isNotification
     */
    private Boolean isNotification;

}
