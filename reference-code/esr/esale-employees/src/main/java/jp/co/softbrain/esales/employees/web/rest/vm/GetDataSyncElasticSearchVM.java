package jp.co.softbrain.esales.employees.web.rest.vm;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * A view model
 */
@Data
public class GetDataSyncElasticSearchVM implements Serializable {

    private static final long serialVersionUID = 1571118942788195048L;

    /**
     * The list employeeId
     */
    private List<Long> employeeIds;

}
