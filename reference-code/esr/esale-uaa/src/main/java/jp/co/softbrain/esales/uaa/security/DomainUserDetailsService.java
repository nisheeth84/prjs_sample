package jp.co.softbrain.esales.uaa.security;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.uaa.domain.UaPasswords;
import jp.co.softbrain.esales.uaa.repository.UaPasswordsRepository;
import jp.co.softbrain.esales.uaa.service.dto.employees.EmpDetailDTO;
import jp.co.softbrain.esales.uaa.service.dto.employees.GetEmpDetailRequest;
import jp.co.softbrain.esales.uaa.service.dto.employees.GetEmpDetailResponse;
import jp.co.softbrain.esales.uaa.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.uaa.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * Authenticate a user from the database.
 */
@Component("userDetailsService")
public class DomainUserDetailsService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(DomainUserDetailsService.class);

    @Autowired
    private UaPasswordsRepository uaPasswordsRepository;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * @see org.springframework.security.core.userdetails.loadUserByUsername(String username)
     */
    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String login) {
        log.debug("Authenticating {}", login);

        String employeeCode = login.toLowerCase(Locale.ENGLISH);
        GetEmpDetailRequest request = new GetEmpDetailRequest(employeeCode);
        String tenantId = jwtTokenUtil.getTenantIdFromToken();
        if (tenantId == null || tenantId.length() <= 0) {
            tenantId = TenantContextHolder.getTenant();
        }

        // Call API get employeeId
        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        GetEmpDetailResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.EMPLOYEES,
                "get-emp-detail", HttpMethod.POST, request, GetEmpDetailResponse.class, token, tenantId);
        Long employeeID = null;
        if (response != null) {
            EmpDetailDTO empOptional = response.getEmpDetailDTO();
            if (empOptional != null) {
                employeeID = empOptional.getEmployeeId();
            }
        }

        return uaPasswordsRepository.findOneWithAuthoritiesByEmployeeId((long) employeeID)
                .map(user -> createSpringSecurityUser(employeeCode, user))
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User with " + employeeCode + " was not found in the database"));
    }

    /**
     * Create Spring Security User
     *
     * @param login
     * @param user
     * @return
     */
    private org.springframework.security.core.userdetails.User createSpringSecurityUser(String login, UaPasswords user) {
        List<GrantedAuthority> grantedAuthorities = user.getAuthorities().stream()
            .map(authority -> new SimpleGrantedAuthority(authority.getName()))
            .collect(Collectors.toList());
        return new org.springframework.security.core.userdetails.User(login,
            user.getPassword(),
            grantedAuthorities);
    }
}
