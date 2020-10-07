package jp.co.softbrain.esales.commons.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetResultServiceOrderDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3034228470379044019L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * serviceId
     */
    private Long serviceId;

    /**
     * serviceName
     */
    private String serviceName;

    /**
     * serviceOrder
     */
    private Integer serviceOrder;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
