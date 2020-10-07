/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;
import java.util.List;

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
    private static final long serialVersionUID = 1343176794740819466L;

    /**
     * generalSettings
     */
    private List<GeneralSettingDTO> generalSettings;
}
