package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for InitializeEditMode
 *
 * @author lediepoanh
 *
 */
@Data
@EqualsAndHashCode
public class EmployeeRelationsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4968483411453676315L;

    /**
     * departments
     */
    private List<DepartmentsDTO> departments;

    /**
     * positions
     */
    private List<PositionsDTO> positions;

    /**
     * languages
     */
    private List<LanguagesDTO> languages;

    /**
     * timezones
     */
    private List<TimezonesDTO> timezones;

}
