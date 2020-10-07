package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Request entity for API revoke-employee-access
 *
 * @author tongminhcuong
 */
@Data
public class RevokeEmployeeAccessRequest implements Serializable {

    private static final long serialVersionUID = -7632688579365850095L;

    private List<Long> packageIds;
}
