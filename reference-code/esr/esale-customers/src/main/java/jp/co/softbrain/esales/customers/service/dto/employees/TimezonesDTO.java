package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.service.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for Timezones
 * @author lediepoanh
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TimezonesDTO extends BaseDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3383296196388602282L;

    /**
     * timezoneId
     */
    private Long timezoneId;

    /**
     * The Timezone shortName
     */
    private String timezoneShortName;

    /**
     * The Timezone name
     */
    private String timezoneName;

    /**
     * The Timezone displayOrder
     */
    private Integer displayOrder;

}
