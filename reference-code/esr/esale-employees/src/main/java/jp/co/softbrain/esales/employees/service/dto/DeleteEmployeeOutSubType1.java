package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO sub type for API deleteEmployee
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode
public class DeleteEmployeeOutSubType1 implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 4910442183579318660L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * counts
     */
    private DeleteEmployeeOutSubType2 counts;

}
