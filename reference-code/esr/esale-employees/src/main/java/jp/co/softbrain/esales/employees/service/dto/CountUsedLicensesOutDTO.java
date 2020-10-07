package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Out DTO class for API Count Used Licenses
 */
@Data
@EqualsAndHashCode
public class CountUsedLicensesOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -530226945371761473L;

    /**
     * packages
     */
    private List<CountUsedLicensesSubType1DTO> packages;

}
