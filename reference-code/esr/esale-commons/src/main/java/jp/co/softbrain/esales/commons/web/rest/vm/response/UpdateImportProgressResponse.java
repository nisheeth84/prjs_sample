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
 * Response for API updateImportProgress
 * 
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class UpdateImportProgressResponse implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4090507157137170526L;
    /**
     * import Progress Id
     */
    private Long importProgressId;
}
