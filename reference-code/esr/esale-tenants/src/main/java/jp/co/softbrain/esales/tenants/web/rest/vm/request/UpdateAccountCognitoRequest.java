package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;

import jp.co.softbrain.esales.tenants.service.dto.UpdateAccountCognitoInfo;
import lombok.Data;

/**
 * Request DTO for API update-account-cognito
 *
 * @author tongminhcuong
 */
@Data
public class UpdateAccountCognitoRequest implements Serializable {

    private static final long serialVersionUID = 6981512500990111069L;

    private String contractTenantId;

    private String userName;

    private UpdateAccountCognitoInfo dataChange;
}
