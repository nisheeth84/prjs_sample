package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author dohuyhai
 * A DTO for the ProcessImportRequest
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class ProcessImportRequestSubType2DTO extends BaseDTO implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1350434157010647877L;

    private Integer listType;
    
    private String listName;
    
    private ProcessImportRequestSubType1DTO ownerList;
    
    private ProcessImportRequestSubType1DTO viewerList;
}
