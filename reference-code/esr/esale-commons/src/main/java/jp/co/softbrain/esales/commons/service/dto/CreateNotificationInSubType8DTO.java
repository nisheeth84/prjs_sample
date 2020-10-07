package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateNotificationInSubType8DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CreateNotificationInSubType8DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 16237637457461L;
    /**
     * valueId
     */
    private Long valueId;
    /**
     * valueName
     */
    private String valueName;
    /**
     * receivers
     */
    private List<Long> receiverIds;
    /**
     * mode
     */
    private int mode;
    /**
     * startDate
     */
    private Instant startDate;
    /**
     * endDate
     */
    private Instant endDate;

}
