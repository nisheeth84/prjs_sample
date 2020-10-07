/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Request for API getGeneralSetting
 * 
 * @author phamminhphu
 */
@Data
public class GetGeneralSettingRequest implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6758022061885742202L;

    /**
     * settingName
     */
    private String settingName;
}
