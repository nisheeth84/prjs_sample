package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Request for API initializeDepartmentModal
 * 
 * @author phamdongdong
 *
 */
@Data
public class InitializeDepartmentModalRequest implements Serializable{
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2230981095596696820L;
    private Long departmentId;
}
