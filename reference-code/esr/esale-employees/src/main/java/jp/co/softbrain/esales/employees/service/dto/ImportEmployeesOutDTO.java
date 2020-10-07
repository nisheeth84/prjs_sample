package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for ImportEmployees: Data reference result.
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class ImportEmployeesOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6124030975901688665L;

    /**
     * Statistics of processed results
     */
    private ImportEmployeesSubType4DTO summary;

    /**
     * The returned data is needed for the import result to export function
     */
    private ImportEmployeesSubType5DTO results;
}
