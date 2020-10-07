package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class RemoveManagerRequest implements Serializable {

    private static final long serialVersionUID = 1L;
    private List<Long> employeeIds;
}
