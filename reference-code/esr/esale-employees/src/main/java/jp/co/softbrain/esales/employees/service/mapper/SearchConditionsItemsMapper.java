package jp.co.softbrain.esales.employees.service.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.employees.service.dto.commons.SummaryFilterValueDTO;
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

    SearchConditionDTO summaryFilterValueToSearchContidion(SummaryFilterValueDTO sumaryFilter);

    List<SearchConditionDTO> summaryFilterValueToSearchContidion(List<SummaryFilterValueDTO> sumaryFilters);

    SearchItem summaryFilterValueToSearchItem(SummaryFilterValueDTO sumaryFilter);

    List<SearchItem> summaryFilterValueToSearchItem(List<SummaryFilterValueDTO> sumaryFilters);

}
