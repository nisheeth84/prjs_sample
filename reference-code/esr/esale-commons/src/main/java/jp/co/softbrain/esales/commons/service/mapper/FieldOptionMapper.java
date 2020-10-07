package jp.co.softbrain.esales.commons.service.mapper;

import jp.co.softbrain.esales.commons.domain.FieldInfoItem;
import jp.co.softbrain.esales.commons.service.dto.FieldOptionDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface FieldOptionMapper extends EntityMapper<FieldOptionDTO, FieldInfoItem> {

}
