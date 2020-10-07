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
 * Request for GetImportProgressResource
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetImportProgressRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4463630033370313659L;

    /**
     * import Progress Id
     */
    private Long importProgressId;
    
    /**
     * import Id
     */
    private Long importId;

}
