package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO response for get Sum EmployeesPackageIds
 *
 * @author phamminhphu
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeesPackageSumIdsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 9100897263933981422L;

    /**
     * The packageId
     */
    private Long packageId;

    /**
     * The countPackageId
     */
    private long countPackageId;
}
