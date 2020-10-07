package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for format date
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class DateFormatDTO implements Serializable {
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -6725920922103714311L;

    /**
     * The dateTime
     */
    private Instant dateTime;

    /**
     * The mdFormat
     */
    private String mdFormat;

    /**
     * The hmFormat
     */
    private String hmFormat;

}
