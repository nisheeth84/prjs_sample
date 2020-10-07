package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.LanguagesDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response  for API getLanguages
 *
 * @author phamminhphu
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetLanguagesResponse implements Serializable {
    private static final long serialVersionUID = -2755822756159133255L;

    private List<LanguagesDTO> languagesDTOList;
}
