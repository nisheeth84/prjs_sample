package com.viettel.asset.business;

import com.viettel.asset.dto.AuthenticationInfo;
import com.viettel.asset.dto.BaseWsRequest;
import org.springframework.stereotype.Service;

@Service
public class AuthenticateWsBusiness {

    private String username = "anhtien";
    private String password = "123";
    private String version = "1.0";

    public void validateRequest(BaseWsRequest request) throws Exception {
        AuthenticationInfo authenticationInfo = request.getAuthenticationInfo();
//		if (authenticationInfo == null
//				|| !this.username.equals(authenticationInfo.getUsername())
//				|| !this.password.equals(authenticationInfo.getPassword())
//				|| !this.version.equals(authenticationInfo.getVersion())) {
//			throw new Exception("Thông tin xác thực không hợp lệ");
//		}

    }


}
