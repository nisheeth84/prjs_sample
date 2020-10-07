package jp.co.softbrain.esales.tenants.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.CreateAccountCognitoRequestDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateAccountCognitoInfo;

/**
 * Service implementation for cognito account
 *
 * @author tongminhcuong
 */
@XRayEnabled
public interface CognitoAccountService {

    /**
     * Register cognito account
     *
     * @param accountCognitoDTO accountCognitoDTO
     * @return {@link ContractSiteResponseDTO}
     */
    ContractSiteResponseDTO createAccountCognito(CreateAccountCognitoRequestDTO accountCognitoDTO);

    /**
     * Register cognito account
     *
     * @param contractTenantId The id of contract
     * @return {@link ContractSiteResponseDTO}
     */
    ContractSiteResponseDTO getAccountCognito(String contractTenantId);

    /**
     * Update cognito account
     *
     * @param contractTenantId The id of contract
     * @param userName userName
     * @param dataChange dataChange
     * @return {@link ContractSiteResponseDTO}
     */
    ContractSiteResponseDTO updateAccountCognito(String contractTenantId, String userName,
            UpdateAccountCognitoInfo dataChange);

    /**
     * Delete cognito account
     *
     * @param contractTenantId The id of contract
     * @param userName userName
     * @return {@link ContractSiteResponseDTO}
     */
    ContractSiteResponseDTO deleteAccountCognito(String contractTenantId, String userName);

    /**
     * Delete cognito account by is access contract
     *
     * @param userPoolId user pool id of tenants
     * @param isAccessContract access contract of user
     */
    void deleteAccountCognitoByAccessContract(String userPoolId, Boolean isAccessContract) throws Exception;
}
