package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

/**
 * The DTO Request for api updateCognitoSetting
 * 
 * @author QuangLV
 */
import javax.servlet.http.Part;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Update Cognito Setting Request
 * 
 * @author QuangLV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateCognitoSettingRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5022587796754537933L;

    /**
     * data
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
