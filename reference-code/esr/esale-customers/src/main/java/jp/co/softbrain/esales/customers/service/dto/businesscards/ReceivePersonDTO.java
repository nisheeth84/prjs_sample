package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @see ReceivePersonDTO for CreateBusinessCard
 */

@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class ReceivePersonDTO implements Serializable {

    private static final long serialVersionUID = -2003239829695943751L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * receivedDate
     */
    private Instant receiveDate;

}
