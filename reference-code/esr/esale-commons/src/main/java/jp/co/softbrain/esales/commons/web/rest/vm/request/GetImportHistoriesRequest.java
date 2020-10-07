package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jp.co.softbrain.esales.commons.service.dto.OrderByDTO;

/**
 * Get Import Histories Request
 * 
 * @author LongNV
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetImportHistoriesRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8706656371838856146L;
    
    /**
     * serviceId
     */
    private Integer serviceId;
    
    /**
     * importId
     */
    private Integer importId = 0;
    
    /**
     * offset
     */
    private Integer offset = 0;
    
    /**
     * limit
     */
    private Integer limit = 30;
    
    /**
     * orderBy
     */
    private OrderByDTO orderBy;
}
