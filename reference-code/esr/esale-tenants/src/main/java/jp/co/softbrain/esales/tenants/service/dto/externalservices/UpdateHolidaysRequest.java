package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Request entity for API update-holiday
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
public class UpdateHolidaysRequest implements Serializable {

    private static final long serialVersionUID = 1649805822571426611L;

    private HolidaysDTO holidays;
}
