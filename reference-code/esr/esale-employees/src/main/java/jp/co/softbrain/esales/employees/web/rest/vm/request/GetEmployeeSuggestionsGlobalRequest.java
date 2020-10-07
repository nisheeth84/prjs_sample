/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Request for API getEmployeeSuggestionsGlobal
 * 
 * @author phamminhphu
 */
@Data
public class GetEmployeeSuggestionsGlobalRequest implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4329962779988482071L;

    /**
     * searchValue
     */
    private String searchValue;

    /**
     * offSet
     */
    private Long offset;

    /**
     * limit
     */
    private Long limit;
}
