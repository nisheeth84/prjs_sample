package jp.co.softbrain.esales.employees.service.mapper;

import java.util.List;

import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;

import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsItemResponseDTO;
import jp.co.softbrain.esales.utils.dto.GetDataByRecordIdsSubType3DTO;

/**
 * Mapper for api getDataByRecordIds
 * 
 * @author nguyentienquan
 */
@Mapper(componentModel = "spring", uses = {}, collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface DataByRecordIdsMapper {
    GetDataByRecordIdsSubType3DTO toSubType3(CustomFieldsItemResponseDTO dto);
    List<GetDataByRecordIdsSubType3DTO> toSubType3(List<CustomFieldsItemResponseDTO> dto);
}
