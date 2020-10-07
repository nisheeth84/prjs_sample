package jp.co.softbrain.esales.employees.service.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.employees.service.dto.commons.SummaryOrderByDTO;
import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderValue;

/**
 * KeyValueTypeMapper
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface KeyValueTypeMapper extends EntityMapper<KeyValue, OrderValue> {

    KeyValue cloneKV(KeyValue source);

    OrderValue summaryOrderByToOrderValue(SummaryOrderByDTO sumaryOrderBy);

    List<OrderValue> summaryOrderByToOrderValue(List<SummaryOrderByDTO> sumaryOrderBy);

}
