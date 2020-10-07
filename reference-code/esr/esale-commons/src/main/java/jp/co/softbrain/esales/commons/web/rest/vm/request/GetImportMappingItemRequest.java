package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * request for get-import-mapping-item
 * @author dohuyhai
 *
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetImportMappingItemRequest implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7896999136619472562L;

    /**
     * service Id
     */
    private Integer serviceId;

    /**
     * matching Key
     */
    private String matchingKey;

    /**
     * header Csv
     */
    private List<String> headerCsv;
}
