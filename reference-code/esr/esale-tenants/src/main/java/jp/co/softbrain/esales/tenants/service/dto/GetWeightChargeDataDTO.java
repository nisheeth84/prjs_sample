package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for data response getWeightCharge API.
 *
 * @author nguyenvietloi
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetWeightChargeDataDTO implements Serializable {

    private static final long serialVersionUID = -8377798910644710756L;

    private Integer usedNumber;
}
