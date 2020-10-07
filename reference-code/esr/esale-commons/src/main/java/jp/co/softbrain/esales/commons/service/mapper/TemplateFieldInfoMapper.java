package jp.co.softbrain.esales.commons.service.mapper;

import jp.co.softbrain.esales.commons.domain.FieldInfo;
import jp.co.softbrain.esales.commons.service.dto.TemplateFieldInfoDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface TemplateFieldInfoMapper extends EntityMapper<TemplateFieldInfoDTO, FieldInfo>{
}
