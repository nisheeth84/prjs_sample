package jp.co.softbrain.esales.commons.web.rest.vm;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.FieldsInfoOutDTO;
import lombok.Data;
@Data
public class GetFieldsInfoResponse implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = -4130381584669704876L;
    private List<FieldsInfoOutDTO> fields;

}
