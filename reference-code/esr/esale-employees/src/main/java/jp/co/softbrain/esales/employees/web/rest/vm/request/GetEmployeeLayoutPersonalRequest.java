package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Request for API getEmployeeLayoutPersonal
 * @author phamdongdong
 *
 */
@Data
public class GetEmployeeLayoutPersonalRequest implements Serializable{
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2230981095595568620L;
    private int extensionBelong;
}
