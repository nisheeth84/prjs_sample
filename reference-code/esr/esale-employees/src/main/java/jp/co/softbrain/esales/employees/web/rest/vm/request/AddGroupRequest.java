package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Add group view modal
 * 
 * @author phamminhphu
 */
@Data
public class AddGroupRequest implements Serializable{
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6178731549677369567L;
    private Long groupId;
    private List<Long> employeeIds;
}
