package jp.co.softbrain.esales.uaa.service.mapper;

import jp.co.softbrain.esales.uaa.domain.*;
import jp.co.softbrain.esales.uaa.service.dto.AuthorityDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link Authority} and its DTO {@link AuthorityDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface AuthorityMapper extends EntityMapper<AuthorityDTO, Authority> {

    default Authority fromAuthorityId(Long authorityId) {
        if (authorityId == null) {
            return null;
        }
        Authority authority = new Authority();
        authority.setAuthorityId(authorityId);
        return authority;
    }
}
