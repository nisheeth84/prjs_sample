package jp.co.softbrain.esales.employees.service.dto.schedule;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetTasksOutFileDTO
 * 
 * @author TranTheDuy
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetTasksOutFileDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 52080653423447412L;

    /**
     * The file ID
     */
    private Long fileId;

    /**
     * The fileName
     */
    private String fileName;

    /**
     * the filePath
     */
    private String filePath;

    /**
     * the fileUrl
     */
    private String fileUrl;

}
