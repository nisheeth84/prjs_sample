package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.TemplateFieldInfoDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class TemplateFieldInfoResponse implements Serializable {

    /**
     * the serialVersionUID
     */
    private static final long serialVersionUID = 8849956022343356123L;
    
    /**
     * fields
     */
    private List<TemplateFieldInfoDTO> fields;
}
