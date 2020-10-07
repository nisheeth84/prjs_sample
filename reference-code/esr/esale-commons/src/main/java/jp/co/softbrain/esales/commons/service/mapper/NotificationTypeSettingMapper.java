package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.NotificationTypeSetting;
import jp.co.softbrain.esales.commons.service.dto.NotificationTypeSettingDTO;

@Mapper(componentModel = "spring", uses = {})
public interface NotificationTypeSettingMapper
        extends EntityMapper<NotificationTypeSettingDTO, NotificationTypeSetting> {
}
