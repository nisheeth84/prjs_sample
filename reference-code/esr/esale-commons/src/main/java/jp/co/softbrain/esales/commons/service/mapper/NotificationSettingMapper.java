package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.NotificationSetting;
import jp.co.softbrain.esales.commons.service.dto.NotificationSettingDTO;

@Mapper(componentModel = "spring", uses = {})
public interface NotificationSettingMapper extends EntityMapper<NotificationSettingDTO, NotificationSetting> {

    default NotificationSetting fromId(Long id) {
        if (id == null) {
            return null;
        }
        NotificationSetting notificationSetting = new NotificationSetting();
        notificationSetting.setNotificationSettingId(id);
        return notificationSetting;
    }
}
