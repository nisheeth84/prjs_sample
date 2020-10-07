package jp.co.softbrain.esales.uaa.graphql.mutation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;

import jp.co.softbrain.esales.uaa.service.AuthenticationSamlService;
import jp.co.softbrain.esales.uaa.service.dto.AuthenticationSamlInDTO;
import jp.co.softbrain.esales.uaa.service.dto.UpdateAuthenticationSAMLOutDTO;

/**
 * {@link UpdateAuthenticationSamlMutation} class process GraphQL query
 *
 * @author Tuanlv
 * @see GraphQLQueryResolver
 */

@Component
@XRayEnabled
public class UpdateAuthenticationSamlMutation implements GraphQLMutationResolver {
    @Autowired
    private AuthenticationSamlService authenticationSamlService;

    /**
     * Update Authentication SAML
     *
     * @param data of saml
     * @param files : file upload , delete
     * @return id of authenticationSaml
     */
    public UpdateAuthenticationSAMLOutDTO updatedAuthenticationSaml(AuthenticationSamlInDTO data, List<MultipartFile> files) {
        return authenticationSamlService.updateAuthenticationSAML(data, files);
    }
}
