package jp.co.softbrain.esales.commons.service.dto;
import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.Timezones} entity.
 */
@Data
@EqualsAndHashCode(callSuper=true)
public class TimezonesDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 6741424014488189049L;

    /**
     * The Timezone id
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
