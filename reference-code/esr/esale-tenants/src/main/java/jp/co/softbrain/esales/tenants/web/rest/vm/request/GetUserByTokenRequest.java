package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request for API getUserByToken
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetUserByTokenRequest implements Serializable {

    private static final long serialVersionUID = 5691649563344446030L;

    private String token;
}
