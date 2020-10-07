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
 * Response for API progressImport
 * 
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class ProcessImportResponse implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1858577304648932068L;
    
    /**
     * import Id
     */
    private Long importId;
}
