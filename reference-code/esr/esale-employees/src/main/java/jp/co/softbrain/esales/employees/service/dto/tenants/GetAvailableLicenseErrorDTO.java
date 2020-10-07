package jp.co.softbrain.esales.employees.service.dto.tenants;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * GetAvailableLicenseErrorDTO
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAvailableLicenseErrorDTO implements Serializable {

    private static final long serialVersionUID = -7309145633286271356L;

    private String errorCode;

    private String errorMessage;
}
