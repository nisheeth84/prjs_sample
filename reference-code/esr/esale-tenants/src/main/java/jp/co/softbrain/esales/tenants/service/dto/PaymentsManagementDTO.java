package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for PaymentsManagement entity.
 *
 * @author nguyenvietloi
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class PaymentsManagementDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -8355558910644713336L;

    private Long paymentManagementId;

    private Long tenantId;

    private Integer paymentType;

    private String yearMonth;

    private Integer usedNumber;
}
