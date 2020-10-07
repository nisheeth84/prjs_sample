package jp.co.softbrain.esales.commons.service.mapper;

import jp.co.softbrain.esales.commons.domain.NotificationEmail;
import jp.co.softbrain.esales.commons.service.dto.NotificationEmailDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface NotificationEmailMapper extends EntityMapper<NotificationEmailDTO , NotificationEmail> {
}
