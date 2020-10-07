package jp.co.softbrain.esales.employees.service.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.utils.dto.SearchConditionDTO;
import jp.co.softbrain.esales.utils.dto.SearchItem;

/**
 * Mapper for the DTO {@link SearchItem} and
 * {@link ElasticSearchConditions}.
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface CommonsInfoMapper {

    SearchConditionDTO toSearchConditionGrpcDto(SearchItem source);

    SearchItem clone(SearchItem source);

    List<SearchItem> clone(List<SearchItem> sources);

}
