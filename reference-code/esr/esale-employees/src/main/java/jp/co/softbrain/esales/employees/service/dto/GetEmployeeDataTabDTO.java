package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Clas out DTO contain data about tab of API getEmployee
 */
@Data
@EqualsAndHashCode
public class GetEmployeeDataTabDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5715953765731002375L;

    private Integer tabId;

    private Object data;

}
