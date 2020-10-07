package jp.co.softbrain.esales.commons.web.rest.vm.request;

import jp.co.softbrain.esales.commons.service.dto.FilterConditionsDTO;
import jp.co.softbrain.esales.commons.service.dto.OrderByDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * Export AccessLogs Request
 * 
 * @author DatDV
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class ExportAccessLogsRequest implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = -1170243850861244428L;
    
    /**
     * dateFrom
     */
    private String dateFrom;
    
    /**
     * dateTo
     */
    private String dateTo;
    
    /**
     * searchLocal
     */
    private String searchLocal;
    
    /**
     * filterConditions
     */
    private List<FilterConditionsDTO> filterConditions;
    
    /**
     * orderBy
     */
    private List<OrderByDTO> orderBy;
}
