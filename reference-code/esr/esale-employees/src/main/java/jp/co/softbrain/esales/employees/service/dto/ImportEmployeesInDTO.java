package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for ImportEmployees
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class ImportEmployeesInDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7185978113036229084L;

    /**
     * Value specifies how to handle data import.
     * 0: insert data only;<br/>
     * 1: update data only;<br/>
     * 2: insert and update data
     */
    int importMode;

    /**
     * Flag set to handle duplicate data.<br/>
     * true: registered;<br/>
     * false: not registered
     */
    boolean isRegistDuplicatedMode;

    /**
     * Flag case duplication.
     */
    private List<String> matchingKeys;

    /**
     * List defines mapping column CSV and DB.
     */
    private List<ImportEmployeesSubType1DTO> mappingDefinitions;

    /**
     * Report mails list.
     */
    ImportEmployeesSubType3DTO reportMails;

    /**
     * Flag set to handle simulation.
     */
    boolean isSimulationMode;

    /**
     * Data CSV.
     */
    private List<List<String>> fileCsvContent;

    /**
     * employeeId from token
     */
    Long employeeId;
}
