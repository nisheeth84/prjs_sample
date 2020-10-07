/**
 *
 */
package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author nguyentienquan
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UploadFilesRequest implements Serializable {

    private static final long serialVersionUID = -4428191979965600983L;

    private Long employeeId;
    private String serviceName;
    private List<MultipartFile> files;
}
