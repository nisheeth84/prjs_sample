package jp.co.softbrain.esales.uaa.service.mapper;

import jp.co.softbrain.esales.uaa.domain.*;
import jp.co.softbrain.esales.uaa.service.dto.UaPasswordResetAuthKeyDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link UaPasswordResetAuthKey} and its DTO {@link UaPasswordResetAuthKeyDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface UaPasswordResetAuthKeyMapper extends EntityMapper<UaPasswordResetAuthKeyDTO, UaPasswordResetAuthKey> {

    default UaPasswordResetAuthKey fromId(Long uaPasswordResetAuthKeyId) {
        if (uaPasswordResetAuthKeyId == null) {
            return null;
        }
        UaPasswordResetAuthKey uaPasswordResetAuthKey = new UaPasswordResetAuthKey();
        uaPasswordResetAuthKey.setUaPasswordResetAuthKeyId(uaPasswordResetAuthKeyId);
        return uaPasswordResetAuthKey;
    }
}
