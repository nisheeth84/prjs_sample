package jp.co.softbrain.esales.tenants.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.tenants.domain.CognitoSettings;
import jp.co.softbrain.esales.tenants.service.dto.CognitoSettingsDTO;

/**
 * Mapper for the entity {@link CognitoSettings} and its DTO
 * {@link CognitoSettingsDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface CognitoSettingsMapper extends EntityMapper<CognitoSettingsDTO, CognitoSettings> {

    default CognitoSettings fromId(Long cognitoSettingsId) {
        if (cognitoSettingsId == null) {
            return null;
        }
        CognitoSettings cognitoSettings = new CognitoSettings();
        cognitoSettings.setCognitoSettingsId(cognitoSettingsId);
        return cognitoSettings;
    }

}
