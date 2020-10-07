/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetListSuggestionsRequest
 *
 * @author buicongminh
 */
@Data
@EqualsAndHashCode
public class GetListSuggestionsRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -144677874125827731L;
    /**
     * serialVersionUID
     */
    private String searchValue;

}
