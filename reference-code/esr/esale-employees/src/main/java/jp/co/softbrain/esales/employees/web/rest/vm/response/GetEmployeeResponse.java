package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.DepartmentManagerDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeInfoDTO;
import lombok.Data;

@Data
public class GetEmployeeResponse implements Serializable {

	private static final long serialVersionUID = -4253030460888538374L;

	/**
     * The flg check permition
     */
    private boolean permittedModify;

    /**
     * total record
     */
    private long totalRecords;

    /**
     * list employee
     */
    private List<EmployeeInfoDTO> employees = new ArrayList<>();

    /**
     * the manager of department
     */
    private DepartmentManagerDTO department;

    /**
     * lastUpdatedDate
     */
    private Instant lastUpdatedDate;
}