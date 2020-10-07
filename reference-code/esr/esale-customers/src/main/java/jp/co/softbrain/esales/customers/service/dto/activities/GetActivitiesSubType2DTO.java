package jp.co.softbrain.esales.customers.service.dto.activities;

/**
 * A DTO for the response of API getActivities - object employee.
 * 
 * @author TinhBV
 */

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetActivitiesSubType2DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = -3294733622335784L;
    private Long                        employeeId;
    private String                      employeeName;
    private String                      employeeSurname;
    private EmployeeIconDTO             employeePhoto;
}