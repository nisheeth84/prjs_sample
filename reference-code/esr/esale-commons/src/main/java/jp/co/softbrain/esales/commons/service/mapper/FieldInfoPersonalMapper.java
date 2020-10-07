package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.FieldInfoPersonal;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoPersonalDTO;

/**
 * Mapper for the entity {@link FieldInfoPersonal} and its DTO {@link FieldInfoPersonalDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface FieldInfoPersonalMapper extends EntityMapper<FieldInfoPersonalDTO, FieldInfoPersonal> {



    default FieldInfoPersonal fromId(Long id) {
        if (id == null) {
            return null;
        }
        FieldInfoPersonal fieldInfoPersonal = new FieldInfoPersonal();
        fieldInfoPersonal.setFieldInfoPersonalId(id);
        return fieldInfoPersonal;
    }
}
