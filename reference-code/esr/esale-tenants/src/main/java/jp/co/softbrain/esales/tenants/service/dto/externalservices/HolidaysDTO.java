package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * HolidaysDTO
 *
 * @author tongminhcuong
 */

@Data
@AllArgsConstructor
public class HolidaysDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -5867831821263425319L;

    /**
     * The dayStart
     */
    private Integer dayStart;
}
