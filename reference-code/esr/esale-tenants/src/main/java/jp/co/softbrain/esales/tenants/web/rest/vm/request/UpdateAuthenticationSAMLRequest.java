package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import javax.servlet.http.Part;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * request for API updateAuthenticationSAML
 *
 * @author QuangLV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class UpdateAuthenticationSAMLRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7714560603112889983L;

    /**
     * parameter
     */
    private String data;
    /**
     * parts
     */
    private List<Part> parts;

    /**
     * files
     */
    private List<MultipartFile> files;

    /**
     * filesMap
     */
    private List<String> filesMap;

}
