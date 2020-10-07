package jp.co.softbrain.esales.tenants.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.CognitoAccountService;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.CreateAccountCognitoRequestDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateAccountCognitoResponseDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.DeleteAccountCognitoRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.UpdateAccountCognitoRequest;

/**
 * Spring MVC RESTful Controller to handle Cognito account.
 *
 * @author tongminhcuong
 */
@RestController
@RequestMapping("/public/api")
public class CognitoAccountResource {

    @Autowired
    private CognitoAccountService cognitoAccountService;

    /**
     * Register cognito account
     *
     * @param request The request to register cognito account
     * @return {@link ContractSiteResponseDTO}
     */
    @PostMapping(path = "/create-account-cognito", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> createAccountCognito(
            @RequestBody CreateAccountCognitoRequestDTO request) {

        ContractSiteResponseDTO responseDTO = cognitoAccountService.createAccountCognito(request);
        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Get list of cognito user
     *
     * @param contractTenantId The id of contract
     * @return {@link ContractSiteResponseDTO}
     */
    @GetMapping(path = "/get-account-cognito", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> getAccountCognito(
            @RequestParam("contractTenantId") String contractTenantId) {

        ContractSiteResponseDTO responseDTO = cognitoAccountService.getAccountCognito(contractTenantId);

        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Update cognito account
     *
     * @param request The request to update cognito account
     * @return {@link ContractSiteResponseDTO}
     */
    @PutMapping(path = "/update-account-cognito", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> updateAccountCognito(
            @RequestBody UpdateAccountCognitoRequest request) {

        ContractSiteResponseDTO responseDTO = cognitoAccountService
                .updateAccountCognito(request.getContractTenantId(), request.getUserName(), request.getDataChange());

        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Delete cognito account
     *
     * @param request The request to update cognito account
     * @return {@link UpdateAccountCognitoResponseDTO}
     */
    @DeleteMapping(path = "/delete-account-cognito", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> updateAccountCognito(
            @RequestBody DeleteAccountCognitoRequest request) {

        ContractSiteResponseDTO responseDTO = cognitoAccountService
                .deleteAccountCognito(request.getContractTenantId(), request.getUserName());

        return ResponseEntity.ok(responseDTO);
    }
}
