/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Request for GetImportSettingResource
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetImportSettingRequest implements Serializable {

    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5602482106250346000L;
    /**
     * import Id
     */
    private Long importId;

}
