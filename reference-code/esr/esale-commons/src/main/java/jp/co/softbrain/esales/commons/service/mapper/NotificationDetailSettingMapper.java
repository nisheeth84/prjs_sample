package jp.co.softbrain.esales.commons.service.mapper;

import jp.co.softbrain.esales.commons.domain.NotificationDetailSetting;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationSettingResultDTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationSettingSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.NotificationDetailSettingDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Named;

/**
 * Notification Detail Setting Mapper
 *
 * @author DatDV
 */
@Mapper(componentModel = "spring", uses = {})
public interface NotificationDetailSettingMapper extends EntityMapper<NotificationDetailSettingDTO , NotificationDetailSetting>{

    @Named("toGetNotificationSettingSubType1DTO")
    GetNotificationSettingSubType1DTO toGetNotificationSettingSubType1DTO(GetNotificationSettingResultDTO source);

}
