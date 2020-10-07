package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.customers.service.dto.InitializeNetworkMapSubType13DTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.BusinessCardReceivesDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.BusinessCardReceivesType1DTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.GetBusinessCardsByIdsDTO;
import jp.co.softbrain.esales.customers.service.dto.businesscards.SaveNetWorkMapRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.SaveNetworkMapRequest;

/**
 * InformationOfCustomerMapper
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface InitializeNetworkMapMapper {

    /**
     * tranfer data from customer to business card
     * 
     * @param selected
     * @return request dto
     */
    SaveNetWorkMapRequest toSaveNetWorkMapReq(SaveNetworkMapRequest selected);

    @Mapping(target = "departmentId", ignore = true)
    @Mapping(target = "lastContactDate", ignore = true)
    @Mapping(target = "isWorking", ignore = true)
    @Mapping(target = "businessCardReceives", ignore = true)
    InitializeNetworkMapSubType13DTO toBusinessCardDatas(GetBusinessCardsByIdsDTO source);

    BusinessCardReceivesType1DTO toBusinessCardReceivesType1DTO(BusinessCardReceivesDTO dataSource);
}
