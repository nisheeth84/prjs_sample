package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * AddCustomersToAutoListRequest
 */
@Data
public class AddCustomersToAutoListRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3804232293038901085L;

    private Long idOfList;

}
