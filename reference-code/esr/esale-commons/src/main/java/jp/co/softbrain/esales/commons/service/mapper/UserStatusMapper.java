package jp.co.softbrain.esales.commons.service.mapper;


import jp.co.softbrain.esales.commons.domain.*;
import jp.co.softbrain.esales.commons.service.dto.UserStatusDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link UserStatus} and its DTO {@link UserStatusDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface UserStatusMapper extends EntityMapper<UserStatusDTO, UserStatus> {
}
