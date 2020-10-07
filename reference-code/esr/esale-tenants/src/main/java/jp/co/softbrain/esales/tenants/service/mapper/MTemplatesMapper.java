package jp.co.softbrain.esales.tenants.service.mapper;

import jp.co.softbrain.esales.tenants.domain.MTemplates;
import jp.co.softbrain.esales.tenants.service.dto.MTemplatesDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity {@link MTemplates} and its DTO {@link MTemplatesDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface MTemplatesMapper extends EntityMapper<MTemplatesDTO, MTemplates>{

}
