package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author buithingocanh
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class PersonInChargeDTO implements Serializable {
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -1458367063374451436L;

    /**
     * employee ID
     */
    private Long employeeId;

    /**
     * group ID
     */
    private Long groupId;

    /**
     * department ID
     */
    private Long departmentId;

}
