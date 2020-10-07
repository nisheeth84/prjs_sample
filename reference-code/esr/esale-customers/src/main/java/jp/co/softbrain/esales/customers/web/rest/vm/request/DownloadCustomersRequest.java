package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.Data;

/**
 * DownloadCustomersRequest
 */
@Data
public class DownloadCustomersRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2970308236895158036L;

    private List<Long> customerIds;
    private List<KeyValue> orderBy;
    private Integer selectedTargetType;
    private Long selectedTargetId;
}
