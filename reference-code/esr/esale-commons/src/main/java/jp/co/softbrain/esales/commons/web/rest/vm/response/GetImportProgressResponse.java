/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.domain.ImportProgress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Response for API GetImportProgressBar API
 * 
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetImportProgressResponse implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6599103018601467926L;
    
    /**
     * import Progress
     */
    private List<ImportProgress> importProgress;
}
