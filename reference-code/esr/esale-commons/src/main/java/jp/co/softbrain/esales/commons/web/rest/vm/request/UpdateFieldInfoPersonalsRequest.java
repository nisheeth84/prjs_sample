/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.UpdateFieldInfoPersonalInDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author nguyentienquan
 *
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateFieldInfoPersonalsRequest implements Serializable {

    private static final long serialVersionUID = 5695275456157312808L;

    private Integer fieldBelong;
    private Integer extensionBelong;
    private Integer selectedTargetType;
    private Long selectedTargetId;
    private List<UpdateFieldInfoPersonalInDTO> fieldInfos;
}
