package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Request for API create Customer
 * 
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class ProcessImportFormDataRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5021490456538368447L;

    /**
     * data
     */
    private String data;

    /**
     * filesMap
     */
    private List<String> filesMap;

    /**
     * files
     */
    private List<MultipartFile> files;

}
