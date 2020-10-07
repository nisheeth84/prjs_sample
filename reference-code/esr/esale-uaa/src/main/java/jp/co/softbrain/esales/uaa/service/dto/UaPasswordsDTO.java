package jp.co.softbrain.esales.uaa.service.dto;
import java.io.Serializable;
import java.time.LocalDate;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.uaa.domain.UaPasswords} entity.
 */
@Data
@EqualsAndHashCode(callSuper=true)
public class UaPasswordsDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -8298606804378682290L;

    /**
     * The UaPasswords uaPasswordId
     */
    private Long uaPasswordId;

    /**
     * The UaPasswords employeeId
     */
    private Long employeeId;

    /**
     * The UaPasswords password
     */
    private String password;

    /**
     * The UaPasswords passwordValidDate
     */
    private LocalDate passwordValidDate;
}
