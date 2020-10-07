package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity for API update-period
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePeriodResponse implements Serializable {

    private static final long serialVersionUID = 6195780730960644174L;

    private Long periodId;
}
