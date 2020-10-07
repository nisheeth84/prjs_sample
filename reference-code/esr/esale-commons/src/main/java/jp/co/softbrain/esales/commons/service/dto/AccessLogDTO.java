package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.AccessLog} entity.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AccessLogDTO extends BaseDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 7116072411768207864L;

    /**
     * The accessLogId
     */
    private Long accessLogId;

    /**
     * The content
     */
    private String content;

}
