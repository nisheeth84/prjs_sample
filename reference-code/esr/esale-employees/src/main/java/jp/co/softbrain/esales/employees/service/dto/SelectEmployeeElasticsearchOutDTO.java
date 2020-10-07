package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class SelectEmployeeElasticsearchOutDTO implements Serializable {

    private static final long serialVersionUID = -2888276872601983721L;

    /**
     * total record
     */
    private long totalRecords;

    /**
     * list employee
     */
    private List<EmployeeInfoDTO> employees = new ArrayList<>();
}