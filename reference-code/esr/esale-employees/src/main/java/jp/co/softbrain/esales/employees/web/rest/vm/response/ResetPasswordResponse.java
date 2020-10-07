/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;

/**
 * Response for API resetPassword
 * 
 */
@Data
public class ResetPasswordResponse implements Serializable{

    private static final long serialVersionUID = -4343758665625371359L;
    
    private boolean isSuccess;
}
