package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for ImportEmployees: The returned data is needed for the import result.
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class ImportEmployeesSubType5DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6900679438581496566L;

    /**
     * Path file CSV import results
     */
    private String pathFileCsvImportResults;

    /**
     * Path file CSV matching key blank;
     */
    private String pathFileCsvMatchingKeyBlank;

    /**
     * Path file CSV not registered new;
     */
    private String pathFileCsvNotRegistedNew;

    /**
     * Path file CSV duplicated;
     */
    private String pathFileCsvDuplicated;

    /**
     * Path file CSV not updated old;
     */
    private String pathFileCsvNotUpdatedOld;

    /**
     * Path file CSV invalid data;
     */
    private String pathFileCsvInvalidData;
}
