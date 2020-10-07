package jp.co.softbrain.esales.uaa.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.uaa.domain.EmpAuthority} entity.
 */
@Data
@EqualsAndHashCode
public class EmpAuthorityDTO implements Serializable {

    private static final long serialVersionUID = -8322417543298986443L;

    /**
     * The Authority authorityId
     */
    private Long empAuthorityId;

    /**
     * The EmpAuthority employeeId
     */
    private Long employeeId;

    /**
     * The EmpAuthority authorityName
     */
    private String authorityName;
}
