package jp.co.softbrain.esales.uaa.security;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import io.grpc.StatusRuntimeException;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.uaa.config.ConstantsUaa;
import jp.co.softbrain.esales.uaa.domain.UaPasswords;
import jp.co.softbrain.esales.uaa.repository.UaPasswordsRepository;
import jp.co.softbrain.esales.uaa.service.dto.employees.EmpDetailDTO;
import jp.co.softbrain.esales.uaa.service.dto.employees.GetEmpDetailResponse;
import jp.co.softbrain.esales.uaa.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * Add data to token
 */
@Component
public class ExtraTokenEnhancer implements TokenEnhancer {
    private final Logger log = LoggerFactory.getLogger(ExtraTokenEnhancer.class);

    @Autowired
    private UaPasswordsRepository uaPasswordsRepository;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
        addClaims((DefaultOAuth2AccessToken) accessToken, authentication);
        return accessToken;
    }

    private void addClaims(DefaultOAuth2AccessToken token, OAuth2Authentication authentication) {
        log.debug("addClaims password remaining days");
        Map<String, Object> additionalInformation = token.getAdditionalInformation();
        if (additionalInformation.isEmpty()) {
            additionalInformation = new LinkedHashMap<>();
        }

        String userName = "";
        if (authentication.getPrincipal() instanceof UserDetails) {
            UserDetails springSecurityUser = (UserDetails) authentication.getPrincipal();
            userName = springSecurityUser.getUsername();
        }

        long seconds = 0L;
        long employeeId = 0L;
        String employeeName = "";
        String languageCode = "";
        String email = "";
        if (!StringUtils.isEmpty(userName)) {
            try {
                // Call API get employeeId
                
                // Call API get employeeId
                String tokenRest = SecurityUtils.getTokenValue().orElse(null);
                // Validate commons
                GetEmpDetailResponse response = restOperationUtils.executeCallApi(
                        Constants.PathEnum.EMPLOYEES, "get-emp-detail", HttpMethod.POST, userName,
                        GetEmpDetailResponse.class, tokenRest, jwtTokenUtil.getTenantIdFromToken());
                if (response != null) {
                    EmpDetailDTO empOptional = response.getEmpDetailDTO();
                    if (empOptional != null) {
                        employeeId = (long) empOptional.getEmployeeId();
                        email = empOptional.getEmail();
                    }
                }

                // TODO ... get employee name
                employeeName = "";
                languageCode = "ja_jp";
                Optional<UaPasswords> user = uaPasswordsRepository.findOneByEmployeeId(employeeId);
                if (user.isPresent()) {
                    // calculate remaining days
                    seconds = user.get().getPasswordValidDate().atStartOfDay().toEpochSecond(ZoneOffset.UTC)
                            - LocalDate.now().atStartOfDay().toEpochSecond(ZoneOffset.UTC);
                }
            } catch (StatusRuntimeException ex) {
                log.debug("get employee id by {} - {}", userName, ex.getMessage());
            }
        }

        //add "remaining_days" claim with current time in secs
        //this is used for an inactive session timeout
        additionalInformation.put(ConstantsUaa.REMAINING_DAYS, (seconds/60/60/24));
        additionalInformation.put(jp.co.softbrain.esales.config.Constants.EMPLOYEE_ID, employeeId);
        additionalInformation.put(jp.co.softbrain.esales.config.Constants.LANGUAGE_CODE, languageCode);
        additionalInformation.put(jp.co.softbrain.esales.config.Constants.EMAIL, email);
        additionalInformation.put(jp.co.softbrain.esales.config.Constants.EMPLOYEE_NAME, employeeName);
        token.setAdditionalInformation(additionalInformation);
    }
}
