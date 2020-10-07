package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Response DTO for API update-license
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
public class UpdateLicenseOutResponse implements Serializable {

    private static final long serialVersionUID = 5565069729299071692L;

    /**
     * The id of contract
     */
    private String contractTenantId;

    /**
     * Messages
     */
    private String message;
}
