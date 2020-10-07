package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for ImportEmployees: Mapping type select box, radio, checkbox.
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class ImportEmployeesSubType2DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7207515302886527237L;

    /**
     * Option value in the csv file.
     */
    private String csvOptionValue;

    /**
     * Corresponding item id.
     */
    private Long itemId;
}
