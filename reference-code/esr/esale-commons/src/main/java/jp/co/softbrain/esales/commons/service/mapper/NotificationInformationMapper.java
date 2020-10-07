package jp.co.softbrain.esales.commons.service.mapper;

import jp.co.softbrain.esales.commons.domain.NotificationInformation;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationsResultDTO;
import jp.co.softbrain.esales.commons.service.dto.GetNotificationsSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.NotificationInformationDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

/**
 * Notification Information Mapper
 *
 * @author DatDV
 */
@Mapper(componentModel = "spring", uses = {})
public interface NotificationInformationMapper extends EntityMapper<NotificationInformationDTO, NotificationInformation> {

    @Named("toGetNotificationsSubType1DTO")
    @Mapping(target = "icon" , ignore = true)
    GetNotificationsSubType1DTO toGetNotificationsSubType1DTO(GetNotificationsResultDTO source);

}
