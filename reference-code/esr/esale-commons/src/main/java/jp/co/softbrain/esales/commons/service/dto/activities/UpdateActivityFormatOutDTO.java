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
public class UpdateActivityFormatOutDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -3748097985313355262L;

    /**
     * The deletedActivityFormats
     */
    private List<Long> deletedActivityFormats;

    /**
     * The insertedActivityFormats
     */
    private List<Long> insertedActivityFormats;

    /**
     * The updatedActivityFormats
     */
    private List<Long> updatedActivityFormats;
}