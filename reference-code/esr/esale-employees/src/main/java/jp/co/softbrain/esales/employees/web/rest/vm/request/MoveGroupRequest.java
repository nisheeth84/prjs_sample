package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class MoveGroupRequest implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private Long sourceGroupId;
    private Long destGroupId;
    private List<Long> employeeIds;
}
