/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import org.springframework.web.multipart.MultipartFile;

import jp.co.softbrain.esales.commons.service.dto.ProcessImportRequestSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.ProcessImportRequestSubType2DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Request for ProcessImportResource
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class ProcessImportRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1098541250498522476L;

    /**
     * service Id
     */
    private Integer serviceId;
    
    /**
     * file
     */
    private MultipartFile file;
    
    /**
     * import Action
     */
    private Integer importAction;
    
    /**
     * is Duplicate Allowed
     */
    private Boolean isDuplicateAllowed;
    
    /**
     * is Simulation Mode
     */
    private Boolean isSimulationMode;
    
    /**
     * mapping Item
     */
    private String mappingItem;
    
    /**
     * matching Key
     */
    private String matchingKey;
    
    /**
     * matching Relation
     */
    private String matchingRelation;
    
    /**
     * notice List
     */
    private ProcessImportRequestSubType1DTO noticeList;
    
    /**
     * is Auto Post Timeline
     */
    private Boolean isAutoPostTimeline;
    
    /**
     * list Info
     */
    private ProcessImportRequestSubType2DTO listInfo;
}
