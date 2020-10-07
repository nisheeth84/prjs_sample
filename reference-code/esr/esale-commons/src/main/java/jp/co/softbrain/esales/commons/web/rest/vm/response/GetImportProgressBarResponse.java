/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Response for API GetImportProgressResource
 * 
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetImportProgressBarResponse implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4743150764588228442L;

    /**
     * import Row Finish
     */
    private Integer importRowFinish;
    
    /**
     * import Row Total
     */
    private Integer importRowTotal;
}
