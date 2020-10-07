package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class GetGroupAndDepartmentByEmployeeIdsRequest implements Serializable {
	private static final long serialVersionUID = 7537368269695946061L;
    private List<Long> employeeIds;

}
