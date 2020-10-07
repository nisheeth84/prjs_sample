package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for DeleteFiles.
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class DeleteFilesOutDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 748260952595305478L;

    /**
     * deletedFileInfos
     */
    private List<String> deletedFileInfos = new ArrayList<>();
}
