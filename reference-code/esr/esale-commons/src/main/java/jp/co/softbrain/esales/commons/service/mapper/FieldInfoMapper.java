package jp.co.softbrain.esales.commons.service.mapper;

import jp.co.softbrain.esales.commons.domain.*;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link FieldInfo} and its DTO {@link FieldInfoDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface FieldInfoMapper extends EntityMapper<FieldInfoDTO, FieldInfo> {



    default FieldInfo fromId(Long fieldId) {
        if (fieldId == null) {
            return null;
        }
        FieldInfo fieldInfo = new FieldInfo();
        fieldInfo.setFieldId(fieldId);
        return fieldInfo;
    }
}
