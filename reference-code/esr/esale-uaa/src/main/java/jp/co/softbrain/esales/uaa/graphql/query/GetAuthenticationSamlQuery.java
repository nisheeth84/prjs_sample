package jp.co.softbrain.esales.uaa.graphql.query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;

import jp.co.softbrain.esales.uaa.service.AuthenticationSamlService;
import jp.co.softbrain.esales.uaa.service.dto.GetAuthenticationSAMLDTO;

/**
 * {@link GetAuthenticationSamlQuery} class process GraphQL query
 *
 * @author Tuanlv
 * @see GraphQLQueryResolver
 */
@Component
@XRayEnabled
public class GetAuthenticationSamlQuery implements GraphQLQueryResolver {

    @Autowired
    private AuthenticationSamlService authenticationSamlService;

    /**
     * Get Authentication SAML
     *
     * @return info of AuthenticationSAML
     */
    public GetAuthenticationSAMLDTO getAuthenticationSAML() {
        return authenticationSamlService.getAuthenticationSAML();
    }
}
