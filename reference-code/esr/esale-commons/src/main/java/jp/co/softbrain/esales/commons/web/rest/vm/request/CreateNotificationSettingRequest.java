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
public class CreateNotificationSettingRequest implements Serializable {
    
    /**
     * 
     */
    private static final long serialVersionUID = 8706017371838856146L;
    
    /**
     * employeeId
     */
    private Long employeeId;
    
    /**
     * email
     */
    private String email;

}
