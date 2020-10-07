package jp.co.softbrain.esales.employees.service.dto.schedule;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Get the file list by task ID.
 * 
 * @author TranTheDuy
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class FileByTaskDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7753145632969337287L;

    /**
     * The Tasks ID
     */
    private Long taskId;

    /**
     * The taskAttachedFileId
     */
    private Long taskAttachedFileId;

    /**
     * The fileName
     */
    private String fileName;

    /**
     * The filePath
     */
    private String filePath;
}
