package jp.co.softbrain.esales.customers.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.customers.service.dto.CustomersDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersInputDTO;

/**
 * Mapper for the DTO {@link CustomersInputDTO} and its DTO
 * {@link CustomersDTO}.
 * 
 * @author phamminhphu
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface CustomersInputMapper {

    /**
     * map CustomersDTO from CustomersInputDTO WithoutCustomerData to create
     * 
     * @param source
     *            : data need to map
     * @return CustomersDTO map from CustomersInputDTO
     */
    @Named("mapWithoutData")
    @Mapping(target = "customerData", ignore = true)
    @Mapping(target = "employeeId", source = "personInCharge.employeeId")
    @Mapping(target = "departmentId", source = "personInCharge.departmentId")
    @Mapping(target = "groupId", source = "personInCharge.groupId")
    CustomersDTO toCustomerDTOWithoutCustomerData(CustomersInputDTO source);
}
