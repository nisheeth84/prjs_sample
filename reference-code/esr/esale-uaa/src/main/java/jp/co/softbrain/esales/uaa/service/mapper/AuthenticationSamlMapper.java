package jp.co.softbrain.esales.uaa.service.mapper;


import jp.co.softbrain.esales.uaa.domain.AuthenticationSaml;
import jp.co.softbrain.esales.uaa.service.dto.AuthenticationSamlDTO;
import jp.co.softbrain.esales.uaa.service.dto.AuthenticationSamlInDTO;
import jp.co.softbrain.esales.uaa.service.dto.GetAuthenticationSamlOutDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

/**
 * Mapper for the entity {@link AuthenticationSaml} and its DTO {@link AuthenticationSamlDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface AuthenticationSamlMapper extends EntityMapper<AuthenticationSamlDTO, AuthenticationSaml> {


    default AuthenticationSaml fromId(Long id) {
        if (id == null) {
            return null;
        }
        AuthenticationSaml authenticationSaml = new AuthenticationSaml();
        authenticationSaml.setSamlId(id);
        return authenticationSaml;
    }

    @Named("mapClone")
    AuthenticationSamlDTO clone(AuthenticationSamlDTO source);

    @Named("toGetAuthenticationSamlOutDTO")
    GetAuthenticationSamlOutDTO toGetAuthenticationSamlOutDTO(AuthenticationSamlDTO source);

    @Named("toGetAuthenticationSamlOutDTO")
    @Mapping(target = "certificateData" , ignore = true)
    AuthenticationSamlDTO toAuthenticationSamlDTO(AuthenticationSamlInDTO source);
}
