package jp.co.softbrain.esales.employees.web.rest.vm.request;

import lombok.Data;

import java.io.Serializable;

/**
 * Request for API RefreshAutoGroup
 *
 * @author phamminhphu
 */
@Data
public class RefreshAutoGroupRequest implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 738634048174860657L;

    private Long idOfList;
}
