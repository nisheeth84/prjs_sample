package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderValue;

/**
 * KeyValueTypeMapper
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface KeyValueTypeMapper extends EntityMapper<KeyValue, OrderValue> {

    KeyValue cloneKV(KeyValue source);
}
