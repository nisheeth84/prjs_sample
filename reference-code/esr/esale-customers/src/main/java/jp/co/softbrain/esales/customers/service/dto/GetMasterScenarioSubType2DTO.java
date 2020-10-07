package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author buithingocanh
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetMasterScenarioSubType2DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8209012931954796841L;

    /**
     * scenarioName
     */
    private String scenarioName;

    /**
     * milestoneName
     */
    private String milestoneName;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
