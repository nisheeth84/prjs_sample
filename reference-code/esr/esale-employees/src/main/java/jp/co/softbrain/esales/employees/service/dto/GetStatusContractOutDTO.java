package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO output for API getStatusContract
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class GetStatusContractOutDTO implements Serializable {
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 1558774240796627508L;
    /**
     * contractStatus
     */
    private Integer statusContract;
    /**
     * dayRemainTrial
     */
    private Integer dayRemainTrial;
    /**
     * messageNotification
     */
    private String messageNotification;

}
