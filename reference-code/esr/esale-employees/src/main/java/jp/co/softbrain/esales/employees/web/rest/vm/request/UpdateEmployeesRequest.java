package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import javax.servlet.http.Part;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateEmployeesRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2866996535871887714L;
    private List<Part> parts;

    /**
     * data
     */
    private String data;

    /**
     * files
     */
    private List<MultipartFile> files;

    /**
     * filesMap
     */
    private List<String> filesMap;
}
