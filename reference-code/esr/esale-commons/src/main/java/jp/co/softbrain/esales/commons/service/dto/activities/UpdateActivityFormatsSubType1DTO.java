package jp.co.softbrain.esales.commons.service.dto.activities;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The DTO for API updateActivityFormats
 * 
 * @author QuangLV
 */

@Data
@EqualsAndHashCode
public class UpdateActivityFormatsSubType1DTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -3503003714104417052L;

    /**
     * The fieldId
     */
    private Long fieldId;

    /**
     * The activityFormatIds
     */
    private List<Long> activityFormatIds;
}
