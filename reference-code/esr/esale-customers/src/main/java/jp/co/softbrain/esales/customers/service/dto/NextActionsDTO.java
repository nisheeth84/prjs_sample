package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Next action DTO
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class NextActionsDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4664168522812214512L;

    /**
     * taskId
     */
    private Long taskId;

    /**
     * taskName
     */
    private String taskName;

    /**
     * customerId
     */
    private Long customerId;

}
