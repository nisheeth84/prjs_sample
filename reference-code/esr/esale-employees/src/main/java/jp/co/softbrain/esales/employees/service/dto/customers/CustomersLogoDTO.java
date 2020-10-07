package jp.co.softbrain.esales.employees.service.dto.customers;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CustomersLogoDTO
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CustomersLogoDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3348645114435728796L;

    /**
     * fileName
     */
    private String photoFileName;

    /**
     * filePath
     */
    private String photoFilePath;

    /**
     * fileUrl
     */
    private String fileUrl;

}
