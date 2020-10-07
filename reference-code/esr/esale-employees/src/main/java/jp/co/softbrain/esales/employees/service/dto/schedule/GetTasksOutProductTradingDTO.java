package jp.co.softbrain.esales.employees.service.dto.schedule;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetTasksOutProductTradingDTO
 * 
 * @author TranTheDuy
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetTasksOutProductTradingDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 5552776406464074766L;

    /**
     * The productTradingId
     */
    private Long productTradingId;

    /**
     * The productName
     */
    private String productName;

    /**
     * productId
     */
    private Long productId;

    /**
     * The customerName
     */
    private String customerName;

    /**
     * The progressName
     */
    private String progressName;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * The employeeName
     */
    private String employeeName;

    /**
     * The employeeSurname
     */
    private String employeeSurname;

    /**
     * employeeIcon
     */
    private String employeeIcon;
}
