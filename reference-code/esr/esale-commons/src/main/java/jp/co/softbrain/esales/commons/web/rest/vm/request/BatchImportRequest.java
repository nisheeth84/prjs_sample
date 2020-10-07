package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * request of Tenant Batch Import API
 * 
 * @author dohuyhai
 */
@Data
@EqualsAndHashCode
public class BatchImportRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1124496922586792587L;

    /**
     * import Id
     */
    private Long importId;

    /**
     * tenant Name
     */
    private String tenantName;
}
