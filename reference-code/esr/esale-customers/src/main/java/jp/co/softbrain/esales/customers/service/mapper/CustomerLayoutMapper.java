package jp.co.softbrain.esales.customers.service.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Named;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutCustomFieldInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutFieldItemDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutPersonalFieldInfo;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsItemResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.FieldInfoPersonalFieldItemOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.FieldInfoPersonalsOutDTO;

/**
 * Mapper DTO {@link CustomerLayoutCustomFieldInfoDTO} with protoType
 * {@link CustomFieldsInfoOutDTO}
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface CustomerLayoutMapper
        extends EntityMapper<CustomerLayoutCustomFieldInfoDTO, CustomFieldsInfoOutDTO> {

    @Named("fieldsItemToFieldsItem")
    CustomerLayoutFieldItemDTO fromCustomFieldsItemToLayoutFieldsItem(CustomFieldsItemResponseDTO customFieldsItem);

    @Named("listFieldsItemToListFieldsItem")
    List<CustomerLayoutFieldItemDTO> fromCustomFieldsItemToLayoutFieldsItem(
            List<CustomFieldsItemResponseDTO> listCustomFieldsItem);

    @Named("toFieldInfoPersonalCustomer")
    CustomerLayoutPersonalFieldInfo toFieldInfoPersonalCustomer(FieldInfoPersonalsOutDTO fieldInfoPersonal);

    @Named("toListFieldInfoPersonalCustomer")
    List<CustomerLayoutPersonalFieldInfo> toFieldInfoPersonalCustomer(
            List<FieldInfoPersonalsOutDTO> fieldInfoPersonalList);

    @Named("toFieldItemPersonalCustomer")
    CustomerLayoutFieldItemDTO toFieldItemPersonalCustomer(FieldInfoPersonalFieldItemOutDTO fieldItem);

    @Named("toListFieldItemPersonalCustomer")
    List<CustomerLayoutFieldItemDTO> toFieldItemPersonalCustomer(
            List<FieldInfoPersonalFieldItemOutDTO> fieldItemList);

}
