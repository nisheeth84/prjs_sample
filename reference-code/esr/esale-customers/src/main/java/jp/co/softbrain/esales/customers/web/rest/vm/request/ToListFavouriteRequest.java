/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Request for API ToListFavouriteRequest
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class ToListFavouriteRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6061933712383303815L;

    /**
     * customerListId
     */
    private Long customerListId;
}
