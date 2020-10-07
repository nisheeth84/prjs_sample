package jp.co.softbrain.esales.tenants.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.AuthenticationService;
import jp.co.softbrain.esales.tenants.service.dto.GetUserInfoByTokenResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.RefreshTokenResponseDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.GetUserByTokenRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.RefreshTokenRequest;

/**
 * Spring MVC RESTful Controller to handle token.
 *
 * @author nguyenvietloi
 */
@RestController
@RequestMapping("/public/api")
public class TokenResource {

    @Autowired
    private AuthenticationService authenticationService;


    /**
     * Refresh token
     *
     * @param request request
     * @return {@link RefreshTokenResponseDTO}
     */
    @PostMapping(path = "/refresh-token", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RefreshTokenResponseDTO> refreshToken(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authenticationService.refreshToken(request.getContractTenantId(), request.getRefreshToken()));
    }

    /**
     * Get user info by token
     *
     * @param request request
     * @return {@link GetUserInfoByTokenResponseDTO}
     */
    @PostMapping(path = "/get-user-info-by-token", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetUserInfoByTokenResponseDTO> getUserInfoByToken(@RequestBody GetUserByTokenRequest request) {
        return ResponseEntity.ok(authenticationService.getUserInfoByToken(request.getToken()));
    }
}
