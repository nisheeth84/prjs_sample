package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode()
public class PhotoDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8739034768760266411L;

    /**
     * The Employees photoFileName
     */
    private String fileName;

    /**
     * The Employees photoFilePath
     */
    private String filePath;

    public PhotoDTO() {
    }

    public PhotoDTO(String fileName, String filePath) {
        super();
        this.fileName = fileName;
        this.filePath = filePath;
    }

}
