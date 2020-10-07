package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCustomerListRequest
 */
@Data
@EqualsAndHashCode
public class GetCustomerListRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5041722190970481206L;

    private Integer mode;
    private Boolean isFavourite;
}
