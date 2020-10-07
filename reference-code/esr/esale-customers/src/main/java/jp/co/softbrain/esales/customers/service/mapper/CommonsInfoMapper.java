package jp.co.softbrain.esales.customers.service.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsItemResponseDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsSubType3DTO;

/**
 * Mapper common
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface CommonsInfoMapper {
    List<GetDataByRecordIdsSubType3DTO> toListFieldItems(List<CustomFieldsItemResponseDTO> source);
}
