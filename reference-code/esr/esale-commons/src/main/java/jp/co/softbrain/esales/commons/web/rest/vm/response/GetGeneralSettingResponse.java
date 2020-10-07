/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.GeneralSettingDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response for API getGeneralSetting
 * 
 * @author phamminhphu
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetGeneralSettingResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4774713548006997609L;

    /**
     * generalSettings
     */
    private List<GeneralSettingDTO> generalSettings;
}
