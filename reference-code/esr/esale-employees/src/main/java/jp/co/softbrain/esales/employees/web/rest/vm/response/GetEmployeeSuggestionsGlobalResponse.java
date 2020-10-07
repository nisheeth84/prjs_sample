package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.GetEmpSugGlobalOutDTO;
import lombok.Data;

/**
 * Response for API GetEmployeeSuggestionsGlobal
 * 
 * @author phamminhphu
 */
@Data
public class GetEmployeeSuggestionsGlobalResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5486741912596454644L;

    /**
     * total
     */
    private Long totalRecord;

    /**
     * employees
     */
    private List<GetEmpSugGlobalOutDTO> employees;
}
