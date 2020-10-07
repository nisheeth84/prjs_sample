/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Request for api deleteList
 * 
 * @author phamminhphu
 */
@Data
public class DeleteListRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4262527040275084353L;

    /**
     * customerListId
     */
    private Long customerListId;
}
