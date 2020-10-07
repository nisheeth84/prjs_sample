package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for ImportEmployees: Report mails list.
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class ImportEmployeesSubType3DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 107015723363963733L;

    /**
     * List id send mail.
     */
    private List<Long> employeeIds;

    /**
     * List group send mail.
     */
    private List<Long> groupIds;

    /**
     * List department send mail.
     */
    private List<Long> departmentIds;
}
