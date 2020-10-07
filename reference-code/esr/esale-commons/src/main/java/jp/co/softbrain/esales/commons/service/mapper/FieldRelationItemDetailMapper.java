package jp.co.softbrain.esales.commons.service.mapper;

import jp.co.softbrain.esales.commons.domain.FieldInfo;
import jp.co.softbrain.esales.commons.service.dto.FieldRelationItemDetailDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface FieldRelationItemDetailMapper extends EntityMapper<FieldRelationItemDetailDTO, FieldInfo> {
}
