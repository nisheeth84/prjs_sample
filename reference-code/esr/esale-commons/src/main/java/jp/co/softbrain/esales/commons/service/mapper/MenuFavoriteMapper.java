package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.MenuFavorite;
import jp.co.softbrain.esales.commons.service.dto.DataOutDTO;

@Mapper(componentModel = "spring", uses = {})
public interface MenuFavoriteMapper extends EntityMapper<DataOutDTO, MenuFavorite> {

    default MenuFavorite fromId(Long id) {
        if (id == null) {
            return null;
        }
        return new MenuFavorite();
    }

}
