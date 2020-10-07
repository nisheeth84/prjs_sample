package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetUrlQuicksightRequest
 *
 * @author nguyenhaiduong
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetUrlQuicksightRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8533833679867891486L;

    /**
     * customerId
     */
    private Long customerId;

}
