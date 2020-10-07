package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity for API update-holiday
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateHolidaysResponse implements Serializable {

    private static final long serialVersionUID = 2790717347819991599L;

    private Long holidayId;
}
