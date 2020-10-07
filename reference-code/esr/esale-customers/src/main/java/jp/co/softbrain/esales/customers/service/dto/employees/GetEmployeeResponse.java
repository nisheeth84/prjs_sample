package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

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
}