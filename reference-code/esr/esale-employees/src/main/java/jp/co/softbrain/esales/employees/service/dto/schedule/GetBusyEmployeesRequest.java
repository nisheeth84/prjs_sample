package jp.co.softbrain.esales.employees.service.dto.schedule;

import java.io.Serializable;

import lombok.Data;

/**
 * Request for API GetBusyEmployees
 * 
 * @author nguyenhaiduong
 */
@Data
public class GetBusyEmployeesRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -697334160799558180L;

    private String startDate;
    private String finishDate;

}
