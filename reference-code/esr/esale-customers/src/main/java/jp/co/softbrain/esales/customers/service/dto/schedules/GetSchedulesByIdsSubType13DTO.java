package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for GetSchedulesByIdsOutDTO
 *
 * @author trungbh
 *
 */
@Data
@EqualsAndHashCode
public class GetSchedulesByIdsSubType13DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8527898642429453908L;
    /**
     * fileId
     */
    private Long fileId;
    /**
     * filePath
     */
    private String filePath;
    /**
     * fileName
     */
    private String fileName;
}
