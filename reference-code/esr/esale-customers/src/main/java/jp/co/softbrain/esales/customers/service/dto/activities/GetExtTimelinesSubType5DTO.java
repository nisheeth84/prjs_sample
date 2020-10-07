package jp.co.softbrain.esales.customers.service.dto.activities;
/**
 * A DTO for the {@link jp.co.softbrain.esales.} entity.
 * 
 * @author tinhbv
 */
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@EqualsAndHashCode
public class GetExtTimelinesSubType5DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1592306161316L;
    private Integer                                  reactionType;
    private Long                                     employeeId;
    private String                                   employeeName;
    private String                                   employeeSurname;
    private String                                   employeePhoto;
}
