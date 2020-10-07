package jp.co.softbrain.esales.uaa.service.impl;

import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.uaa.domain.Authority;
import jp.co.softbrain.esales.uaa.domain.UaPasswordHistories;
import jp.co.softbrain.esales.uaa.domain.UaPasswordResetAuthKey;
import jp.co.softbrain.esales.uaa.domain.UaPasswords;
import jp.co.softbrain.esales.uaa.interceptor.BackendInterceptor;
import jp.co.softbrain.esales.uaa.repository.UaPasswordHistoriesRepository;
import jp.co.softbrain.esales.uaa.repository.UaPasswordResetAuthKeyRepository;
import jp.co.softbrain.esales.uaa.repository.UaPasswordsRepository;
import jp.co.softbrain.esales.uaa.security.SecurityUtils;
import jp.co.softbrain.esales.uaa.service.UaPasswordsService;
import jp.co.softbrain.esales.uaa.service.dto.UaPasswordsDTO;
import jp.co.softbrain.esales.uaa.service.dto.UserDTO;
import jp.co.softbrain.esales.uaa.service.dto.employees.GetEmpDetailResponse;
import jp.co.softbrain.esales.uaa.service.errors.DuplicateHisttoryPasswordException;
import jp.co.softbrain.esales.uaa.service.mapper.UaPasswordsMapper;
import jp.co.softbrain.esales.uaa.service.util.RandomUtil;
import jp.co.softbrain.esales.uaa.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * Service Implementation for managing {@link UaPasswords}.
 */
@Service
@Transactional(transactionManager="tenantTransactionManager")
public class UaPasswordsServiceImpl implements UaPasswordsService {

    private final Logger log = LoggerFactory.getLogger(UaPasswordsServiceImpl.class);

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UaPasswordResetAuthKeyRepository uaPasswordResetAuthKeyRepository;

    @Autowired
    private UaPasswordHistoriesRepository uaPasswordHistoriesRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UaPasswordsRepository uaPasswordsRepository;

    @Autowired
    private UaPasswordsMapper uaPasswordsMapper;

    @Autowired
    private TokenStore tokenStore;

    /**
     * Save a uaPasswords.
     *
     * @param uaPasswordsDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public UaPasswordsDTO save(UaPasswordsDTO uaPasswordsDTO) {
        log.debug("Request to save UaPasswords : {}", uaPasswordsDTO);
        UaPasswords uaPasswords = uaPasswordsMapper.toEntity(uaPasswordsDTO);
        uaPasswords = uaPasswordsRepository.save(uaPasswords);
        return uaPasswordsMapper.toDto(uaPasswords);
    }

    /**
     * Get all the uaPasswords.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<UaPasswordsDTO> findAll() {
        log.debug("Request to get all UaPasswords");
        return uaPasswordsRepository.findAll().stream()
            .map(uaPasswordsMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one uaPasswords by uaPasswordId.
     *
     * @param uaPasswordId the uaPasswordId of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<UaPasswordsDTO> findOne(Long uaPasswordId) {
        log.debug("Request to get UaPasswords : {}", uaPasswordId);
        log.info("Request to get UaPasswords : {}", uaPasswordId);
        return uaPasswordsRepository.findById(uaPasswordId)
            .map(uaPasswordsMapper::toDto);
    }

    /**
     * Delete the uaPasswords by uaPasswordId.
     *
     * @param uaPasswordId the uaPasswordId of the entity.
     */
    @Override
    public void delete(Long uaPasswordId) {
        log.debug("Request to delete UaPasswords : {}", uaPasswordId);
        uaPasswordsRepository.deleteById(uaPasswordId);
    }

    /**
     * get user login
     */
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<UserDTO> getUserWithAuthorities() {
        Optional<String> tokenValue = SecurityUtils.getTokenValue();
        if (!tokenValue.isPresent()) {
            return Optional.empty();
        }
        final OAuth2AccessToken accessToken = tokenStore.readAccessToken(tokenValue.get());
        UserDTO user = null;
        if (accessToken != null) {
            Map<String, Object> additionalInformation = accessToken.getAdditionalInformation();
            Long employeeId = Long.valueOf(additionalInformation.get(Constants.EMPLOYEE_ID).toString());

            // get account info
            Optional<UaPasswords> uaPasswordsOpt = uaPasswordsRepository.findOneWithAuthoritiesByEmployeeId(employeeId);
            if (uaPasswordsOpt.isPresent()) {
                user = new UserDTO();
                user.setLangKey("ja_jp");
                user.setAuthorities(uaPasswordsOpt.get().getAuthorities().stream()
                                        .map(Authority::getName)
                                        .collect(Collectors.toSet()));
            }
        }
        return Optional.of(user);
    }

    /**
     * request Password Reset
     *
     * @param employeeCode
     */
    public Optional<UserDTO> requestPasswordReset(String employeeCode) {
        employeeCode = employeeCode.toLowerCase(Locale.ENGLISH);

        // Call API get employeeId
        // Call API get employeeId
        String tokenRest = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        GetEmpDetailResponse response = restOperationUtils.executeCallApi(
                Constants.PathEnum.EMPLOYEES, "get-emp-detail", HttpMethod.POST, employeeCode,
                GetEmpDetailResponse.class, tokenRest, jwtTokenUtil.getTenantIdFromToken());
        if (response == null || response.getEmpDetailDTO() == null) {
            return null;
        }

        Long employeeId = response.getEmpDetailDTO().getEmployeeId();
        String email = response.getEmpDetailDTO().getEmail();
        UaPasswordResetAuthKey resetAuthKey = uaPasswordResetAuthKeyRepository.findOneByEmployeeId(employeeId)
                .map(resetPass -> {
                    resetPass.setAuthKeyNumber(RandomUtil.generateResetKey());
                    resetPass.setAuthKeyExpirationDate(Instant.now().plusSeconds(86400));
                    resetPass.setUpdatedUser(employeeId);
                    return resetPass;
                })
                .orElseThrow(() -> new RuntimeException("account.reset.messages.user-notfound"));

        UserDTO userDto = new UserDTO();
        userDto.setLogin(email);
        userDto.setEmail(email);
        userDto.setResetDate(resetAuthKey.getAuthKeyExpirationDate());
        userDto.setResetKey(resetAuthKey.getAuthKeyNumber());

        return Optional.of(userDto);
    }

    /**
     * complete Password Reset
     *
     * @param newPassword
     * @param key
     */
    public Optional<UaPasswordsDTO> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);

        // check reset key
        UaPasswordResetAuthKey resetAuthKey = uaPasswordResetAuthKeyRepository.findOneByAuthKeyNumber(key)
            .filter(resetPass -> resetPass.getAuthKeyExpirationDate().isAfter(Instant.now()))
            .map(resetPass -> {
                resetPass.setAuthKeyNumber(null);
                resetPass.setAuthKeyExpirationDate(null);
                resetPass.setUpdatedUser(resetPass.getEmployeeId());
                return resetPass;
            })
            .orElseThrow(() -> new RuntimeException("account.password.reset.url-invalid"));

        return changePassword(resetAuthKey.getEmployeeId(), newPassword);
    }

    /**
     * change password
     *
     * @param currentClearTextPassword
     * @param newPassword
     * @return
     */
    public boolean processChangePassword(String currentClearTextPassword, String newPassword) {
        Optional<String> tokenValue = SecurityUtils.getTokenValue();
        if (!tokenValue.isPresent()) {
            return false;
        }
        final OAuth2AccessToken accessToken = tokenStore.readAccessToken(tokenValue.get());
        if (accessToken != null) {
            Map<String, Object> additionalInformation = accessToken.getAdditionalInformation();
            Long employeeId = Long.valueOf(additionalInformation.get(Constants.EMPLOYEE_ID).toString());

            // get account info
            uaPasswordsRepository.findOneByEmployeeId(employeeId)
                .ifPresent(uaPasswords -> {
                    String currentEncryptedPassword = uaPasswords.getPassword();
                    if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                        throw new RuntimeException("account.password.change.password-old-incorrect");
                    }
                    Optional<UaPasswordsDTO> uaPasswordsDto = changePassword(employeeId, newPassword);
                    if (uaPasswordsDto.isPresent()) {
                        uaPasswords.setPassword(uaPasswordsDto.get().getPassword());
                    }

                    log.debug("Changed password for login User: {}", uaPasswords);
                });
            return true;
        }
        return false;
    }

    /**
     * change password
     *
     * @param employeeId
     * @param encryptedPassword
     * @return
     */
    public Optional<UaPasswordsDTO> changePassword(Long employeeId, String newPassword) {

        // 3世代前までのパスワードは使用できません。
        List<UaPasswordHistories> uaPasswordHistoriesList = uaPasswordHistoriesRepository.findByEmployeeId(employeeId);

        int countPass = 0;
        for (UaPasswordHistories uaPasswordHistories : uaPasswordHistoriesList) {
            if (passwordEncoder.matches(newPassword, uaPasswordHistories.getPassword())) {
                countPass++;
                break;
            }
        }
        if (countPass > 0) {
            throw new DuplicateHisttoryPasswordException("password.change.password-upto-three");
        }

        String encryptedPassword = passwordEncoder.encode(newPassword);
        // insert new password to history
        UaPasswordHistories passHistory = new UaPasswordHistories();
        passHistory.setEmployeeId(employeeId);
        passHistory.setPassword(encryptedPassword);
        passHistory.setCreatedUser(employeeId);
        passHistory.setUpdatedUser(employeeId);
        uaPasswordHistoriesRepository.save(passHistory);

        // delete password history
        uaPasswordHistoriesRepository.deletePasswordHistories(employeeId);

        // update new password
        return uaPasswordsRepository.findOneByEmployeeId(employeeId)
            .map(uaPass -> {
                uaPass.setPassword(encryptedPassword);
                uaPass.setPasswordValidDate(LocalDate.now().plusDays(90));
                uaPass.setUpdatedUser(uaPass.getEmployeeId());
                log.debug("Changed password for Employee: {}", uaPass);
                return uaPass;
            })
            .map(uaPasswordsMapper::toDto);
    }
}
