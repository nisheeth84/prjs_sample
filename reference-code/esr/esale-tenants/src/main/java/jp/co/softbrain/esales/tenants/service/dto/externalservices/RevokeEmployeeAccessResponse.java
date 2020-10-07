package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity for API revoke-employee-access
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevokeEmployeeAccessResponse implements Serializable {

    private static final long serialVersionUID = 2227935529338149170L;

    private Boolean isSuccess;
}
