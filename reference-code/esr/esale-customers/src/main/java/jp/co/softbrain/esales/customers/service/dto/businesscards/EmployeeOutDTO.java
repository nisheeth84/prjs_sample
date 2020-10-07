package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO EmployeeOutDTO
 *
 * @author thanhdv
 */
@Data
@EqualsAndHashCode
public class EmployeeOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7179840812523800657L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * employeeName
     */
    private String filePath;
}
