package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;

/**
 * @author TuanLV
 */
@Data
public class UpdateDisplayFirstScreenResponse implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3506691467115703710L;
    /**
     * employeeId
     */
    private Long employeeId;
}
