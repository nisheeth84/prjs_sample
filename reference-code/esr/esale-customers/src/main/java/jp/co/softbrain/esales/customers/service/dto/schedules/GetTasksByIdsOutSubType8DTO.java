package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTasksByIdsOutSubType8DTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetTasksByIdsOutSubType8DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1624562346234L;

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
