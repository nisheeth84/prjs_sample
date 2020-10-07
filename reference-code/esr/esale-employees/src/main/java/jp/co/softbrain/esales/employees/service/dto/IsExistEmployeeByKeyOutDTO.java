package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO response of API IsExistEmployeeByKeyOut
 * 
 * @author vuvankien
 */
@Data
@EqualsAndHashCode
public class IsExistEmployeeByKeyOutDTO implements Serializable {

    private static final long serialVersionUID = 5480581972715407067L;
    /**
     * The IsExistEmployeeByKeyOutDTO isExist
     */
    private Boolean isExist;
}
