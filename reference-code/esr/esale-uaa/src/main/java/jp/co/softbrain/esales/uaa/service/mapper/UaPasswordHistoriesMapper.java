package jp.co.softbrain.esales.uaa.service.mapper;

import jp.co.softbrain.esales.uaa.domain.*;
import jp.co.softbrain.esales.uaa.service.dto.UaPasswordHistoriesDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link UaPasswordHistories} and its DTO {@link UaPasswordHistoriesDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface UaPasswordHistoriesMapper extends EntityMapper<UaPasswordHistoriesDTO, UaPasswordHistories> {

    default UaPasswordHistories fromId(Long uaPasswordHistoryId) {
        if (uaPasswordHistoryId == null) {
            return null;
        }
        UaPasswordHistories uaPasswordHistories = new UaPasswordHistories();
        uaPasswordHistories.setUaPasswordHistoryId(uaPasswordHistoryId);
        return uaPasswordHistories;
    }
}
