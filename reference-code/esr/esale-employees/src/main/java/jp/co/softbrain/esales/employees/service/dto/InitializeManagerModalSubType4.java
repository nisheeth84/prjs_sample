package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class InitializeManagerModalSubType4 implements Serializable {

    private static final long serialVersionUID = -8865752095862826658L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * updateDate
     */
    private Instant updatedDate;
}
