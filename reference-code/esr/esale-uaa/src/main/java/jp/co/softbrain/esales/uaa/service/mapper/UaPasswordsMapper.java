package jp.co.softbrain.esales.uaa.service.mapper;

import jp.co.softbrain.esales.uaa.domain.*;
import jp.co.softbrain.esales.uaa.service.dto.UaPasswordsDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link UaPasswords} and its DTO {@link UaPasswordsDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface UaPasswordsMapper extends EntityMapper<UaPasswordsDTO, UaPasswords> {

    default UaPasswords fromUaPasswordId(Long uaPasswordId) {
        if (uaPasswordId == null) {
            return null;
        }
        UaPasswords uaPasswords = new UaPasswords();
        uaPasswords.setUaPasswordId(uaPasswordId);
        return uaPasswords;
    }
}
