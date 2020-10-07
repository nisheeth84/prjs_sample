package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * MoveCustomersToOtherListRequest
 */
@Data
public class MoveCustomersToOtherListRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2754673560812213539L;

    private Long sourceListId;
    private Long destListId;
    private List<Long> customerIds;

}
