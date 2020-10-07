package jp.co.softbrain.esales.customers.service.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.utils.dto.SearchConditionDTO;
import jp.co.softbrain.esales.utils.dto.SearchItem;

/**
 * SearchCondiitionsItemMapper
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface SearchConditionsItemsMapper {

    SearchItem cloneSearchItem(SearchItem source);

    List<SearchItem> cloneSearchItem(List<SearchItem> sources);

    SearchConditionDTO searchItemToSearchCondition(SearchItem searchItem);

    List<SearchConditionDTO> searchItemToSearchCondition(List<SearchItem> searchItems);

}
