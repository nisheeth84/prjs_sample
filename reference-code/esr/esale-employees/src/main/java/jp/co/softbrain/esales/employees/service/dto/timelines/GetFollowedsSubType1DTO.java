package jp.co.softbrain.esales.employees.service.dto.timelines;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.Instant;

/**
 * GetFollowedsSubType1DTO
 */
@Data
@EqualsAndHashCode
public class GetFollowedsSubType1DTO implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = 1591842536111L;
    /**
     * The followTargetId
     */
    private Long followTargetId;
    /**
     * The followTargetType
     */
    private Integer followTargetType;
    /**
     * The followTargetName
     */
    private String followTargetName;
    /**
     * The createdDate
     */
    private Instant createdDate;
    /**
     * The updatedDate
     */
    private Instant updatedDate;
}
