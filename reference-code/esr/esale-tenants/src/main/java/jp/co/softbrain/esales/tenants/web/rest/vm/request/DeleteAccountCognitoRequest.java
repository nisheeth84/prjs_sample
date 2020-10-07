package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Request DTO for API delete-account-cognito
 *
 * @author tongminhcuong
 */
@Data
public class DeleteAccountCognitoRequest implements Serializable {

    private static final long serialVersionUID = -8938642322431468498L;

    private String contractTenantId;

    private String userName;
}
