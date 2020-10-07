package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Get Service Favorite Out DTO
 *
 * @author TuanLv
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class DataOutDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8716027871838756146L;

    /**
     * serviceId
     */
    private Long serviceId;
    /**
     * employeeId
     */
    private Long employeeId;
    /**
     * serviceName
     */
    private String serviceName;
}
