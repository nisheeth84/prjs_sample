/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.LanguagesDTO;
import lombok.Data;

/**
 * Response  for API getLanguages
 * 
 * @author phamminhphu
 */
@Data
public class GetLanguagesResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1799335093485725408L;

    private List<LanguagesDTO> languagesDTOList;
}
