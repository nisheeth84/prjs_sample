/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Request for API geCustomerSuggestion
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class GetCustomersSuggestionRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4333784835678145736L;

    /**
     * keyWords
     */
    private String keyWords;

    /**
     * offset
     */
    private Integer offset;

    /**
     * listIdChoice
     */
    private List<Long> listIdChoice;

    /**
     * relationFieldId
     */
    private Long relationFieldId;
}
