package jp.co.softbrain.esales.customers.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.elasticsearch.dto.customers.CustomerInfoDTO;
import lombok.Data;

/**
 * GetDataSyncElasticSearchCustomersResponse
 */
@Data
public class GetDataSyncElasticSearchCustomersResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8123381247783631325L;

    private List<CustomerInfoDTO> dataSync;

}
