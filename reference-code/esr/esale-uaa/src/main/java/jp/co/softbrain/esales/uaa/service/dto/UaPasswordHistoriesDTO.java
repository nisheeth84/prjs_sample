package jp.co.softbrain.esales.uaa.service.dto;

import java.io.Serializable;
import java.time.LocalDate;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.uaa.domain.UaPasswordHistories} entity.
 */
@Data
@EqualsAndHashCode(callSuper=true)
public class UaPasswordHistoriesDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -2703385781576480704L;

    /**
     * The UaPasswordHistories uaPasswordHistoryId
     */
    private Long uaPasswordHistoryId;

    /**
     * The UaPasswordHistories employeeId
     */
    private Long employeeId;

    /**
     * The UaPasswordHistories password
     */
    private String password;

    /**
     * The UaPasswordHistories refixDate
     */
    private LocalDate refixDate;
}
