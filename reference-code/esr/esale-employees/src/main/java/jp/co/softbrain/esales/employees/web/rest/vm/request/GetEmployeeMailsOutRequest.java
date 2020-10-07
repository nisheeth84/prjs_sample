package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class GetEmployeeMailsOutRequest implements Serializable {
	
	private static final long serialVersionUID = 4185481590291342318L;
	
	private List<Long> employeeIds;
	private List<Long> groupIds;	
	private List<Long> departmentIds;
}
