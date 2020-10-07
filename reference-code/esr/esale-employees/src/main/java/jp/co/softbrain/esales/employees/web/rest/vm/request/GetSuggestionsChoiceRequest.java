package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Request for API getSuggestionsChoice
 */
@Data
@EqualsAndHashCode
public class GetSuggestionsChoiceRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;
    /**
     * Array index to mark the search function
     */
    private List<String> index;
    /**
     * Id of employee
     */
    private Long employeeId;
    /**
     * The number of records to retrieve
     */
    private Integer limit;

}
