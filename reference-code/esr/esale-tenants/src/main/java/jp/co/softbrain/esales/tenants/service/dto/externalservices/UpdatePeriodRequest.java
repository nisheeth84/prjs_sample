package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.Data;

/**
 * Request entity for API create-period
 *
 * @author tongminhcuong
 */
@Data
public class UpdatePeriodRequest implements Serializable {

    private static final long serialVersionUID = -7470508931050404930L;

    private Integer monthBegin;

    private Boolean isCalendarYear;
}
