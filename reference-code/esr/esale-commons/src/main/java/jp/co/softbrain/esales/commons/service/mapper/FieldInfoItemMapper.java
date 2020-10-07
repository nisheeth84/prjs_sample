package jp.co.softbrain.esales.commons.service.mapper;

import jp.co.softbrain.esales.commons.domain.*;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoItemDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link FieldInfoItem} and its DTO {@link FieldInfoItemDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface FieldInfoItemMapper extends EntityMapper<FieldInfoItemDTO, FieldInfoItem> {



    default FieldInfoItem fromId(Long itemId) {
        if (itemId == null) {
            return null;
        }
        FieldInfoItem fieldInfoItem = new FieldInfoItem();
        fieldInfoItem.setItemId(itemId);
        return fieldInfoItem;
    }
}
