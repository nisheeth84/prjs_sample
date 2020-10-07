package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTaskTabSubType3DTO
 * 
 * @author nguyenductruong
 *
 */
@Data
@EqualsAndHashCode
public class GetTaskTabSubType3DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2486578197421229609L;

    /**
     * The employeeId
     */
    private Long employeeId;

    /**
     * The employeeName
     */
    private String employeeName;

}
