package jp.co.softbrain.esales.customers.service.dto.activities;
/**
 * A DTO for the {@link jp.co.softbrain.esales.activities.domain.Activities} entity.
 * 
 * @author tinhbv
 */

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetActivitiesSubType7DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = -5897284723265345323L;
    private Long                        employeeId;
    private String                      employeeName;
    private String                      employeeSurname;
    private Instant                     createdDate;
    private EmployeeIconDTO             employeePhoto;
}