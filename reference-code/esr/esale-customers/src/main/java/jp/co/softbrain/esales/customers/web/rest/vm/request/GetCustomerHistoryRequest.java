package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetCustomerHistoryRequest
 *
 * @author nguyenhaiduong
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetCustomerHistoryRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8533833679867891486L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * currentPage
     */
    private Integer currentPage;

    /**
     * limit
     */
    private Integer limit;

}
