package jp.co.softbrain.esales.commons.service.mapper;

import jp.co.softbrain.esales.commons.domain.*;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoTabDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link FieldInfoTab} and its DTO {@link FieldInfoTabDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface FieldInfoTabMapper extends EntityMapper<FieldInfoTabDTO, FieldInfoTab> {



    default FieldInfoTab fromId(Long id) {
        if (id == null) {
            return null;
        }
        FieldInfoTab fieldInfoTab = new FieldInfoTab();
        fieldInfoTab.setFieldInfoTabId(id);
        return fieldInfoTab;
    }
}
