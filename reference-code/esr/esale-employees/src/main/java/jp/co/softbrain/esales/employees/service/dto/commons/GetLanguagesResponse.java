/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.LanguagesDTO;
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
    private static final long serialVersionUID = 6328969236776900361L;

    private List<LanguagesDTO> languagesDTOList;
}
