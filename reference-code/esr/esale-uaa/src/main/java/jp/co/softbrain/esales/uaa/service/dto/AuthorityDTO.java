package jp.co.softbrain.esales.uaa.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.uaa.domain.Authority} entity.
 */
@Data
@EqualsAndHashCode
public class AuthorityDTO implements Serializable {

    private static final long serialVersionUID = -6179700228178187461L;

    /**
     * The Authority authorityId
     */
    private Long authorityId;

    /**
     * The Authority Name
     */
    private String name;
}
