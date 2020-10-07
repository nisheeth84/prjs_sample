package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request for API refresh token
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefreshTokenRequest implements Serializable {

    private static final long serialVersionUID = 5691649563352246030L;

    private String contractTenantId;

    private String refreshToken;
}
