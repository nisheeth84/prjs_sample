package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO BusinessCardReceiveSubTypeDTO
 *
 * @author trungbh
 */
@Data
@EqualsAndHashCode
public class BusinessCardReceiveSubTypeDTO implements Serializable {

    private static final long serialVersionUID = -2003239829695949129L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * receiveDate
     */
    private Instant receiveDate;

    /**
     * lastContactDateReceiver
     */
    private Instant receivedLastContactDate;

    private Long activityId;

    private String filePath;

}
