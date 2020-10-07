package jp.co.softbrain.esales.tenants.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * A DTO for the {@link jp.co.softbrain.esales.uaa.domain.AuthenticationSaml}
 * entity.
 *
 * @author Tuanlv
 */
@Data
@EqualsAndHashCode()
public class ReferenceFieldDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3871972437354041586L;
    /**
     * fieldId
     */
    private Long fieldId;
    /**
     * fieldLabel
     */
    private String fieldLabel;
}
