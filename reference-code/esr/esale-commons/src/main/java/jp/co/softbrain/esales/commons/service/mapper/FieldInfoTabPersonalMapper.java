package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;
import jp.co.softbrain.esales.commons.domain.FieldInfoTabPersonal;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoTabPersonalDTO;

/**
 * Mapper for the entity {@link FieldInfoTabPersonal} and its DTO
 * {@link FieldInfoTabPersonalDTO}.
 * 
 * @author chungochai
 */
@Mapper(componentModel = "spring", uses = {})
public interface FieldInfoTabPersonalMapper extends EntityMapper<FieldInfoTabPersonalDTO, FieldInfoTabPersonal> {

}
