package jp.co.softbrain.esales.employees.filter;

import java.io.IOException;
import java.nio.CharBuffer;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.security.oauth2.common.util.JsonParser;
import org.springframework.security.oauth2.common.util.JsonParserFactory;
import org.springframework.stereotype.Component;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.UserAccessUtils;

@Component
@Order(1)
public class TenantFilter implements Filter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserAccessUtils userAccessUtils;

    private JsonParser objectMapper = JsonParserFactory.create();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String tenantId = jwtTokenUtil.getTenantIdFromToken();
        if (tenantId == null || tenantId.length() <= 0) {
            tenantId = req.getHeader(Constants.HEADER_TENANT_ID);
        }
        
        // validate tenant
        if (StringUtils.isNotBlank(tenantId) && !tenantId.matches(Constants.TENANT_FORMAT)) {
            throw new CustomException("Tenant invalid");
        }
        String token = SecurityUtils.getTokenValue().orElse(null);
        if (StringUtils.isNotEmpty(token) && !req.getRequestURI().contains("/api/get-services")) {
            userAccessUtils.purge();
            String claimsStr = decodeJWT(token);
            Map<String, Object> claimsMap = objectMapper.parseMap(claimsStr);
            String userKey = tenantId + "_" + claimsMap.get(Constants.Authenticate.EMPLOYEE_ID);

            if (req.getRequestURI().contains("/auth/logout")) {
                userAccessUtils.removeLastAccessTime(userKey);
            } else {
                userAccessUtils.putLastAccessTime(userKey);
            }
        }
        TenantContextHolder.setTenantId(tenantId);
        chain.doFilter(request, response);
    }
    
    public String decodeJWT(String jwtToken) {
        int firstPeriod = jwtToken.indexOf('.');
        int lastPeriod = jwtToken.lastIndexOf('.');
        CharBuffer buffer = CharBuffer.wrap(jwtToken, 0, firstPeriod);
        buffer.limit(lastPeriod).position(firstPeriod + 1);
        Base64 base64Url = new Base64(true);
        return new String(base64Url.decode(buffer.toString()));
    }
}
