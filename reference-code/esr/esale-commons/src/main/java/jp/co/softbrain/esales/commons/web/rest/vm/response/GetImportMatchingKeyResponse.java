package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.GetImportMatchingKeyDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Response for API getImportMatchingKey
 * 
 * @author TrungND
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetImportMatchingKeyResponse implements Serializable {
    

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;

    /**
     * importMatchingKey
     */
    List<GetImportMatchingKeyDTO> importMatchingKey;
}
