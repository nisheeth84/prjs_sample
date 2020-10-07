package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;

import lombok.Data;

/**
 * A DTO for the icon photo file name and file path
 *
 * @author lehuuhoa
 */
@Data
public class EmployeeIconDTO implements Serializable {

    private static final long serialVersionUID = -1855324121872727677L;

    /**
     * The Employees photoFileName
     */
    private String fileName;

    /**
     * The Employees photoFilePath
     */
    private String filePath;
}
