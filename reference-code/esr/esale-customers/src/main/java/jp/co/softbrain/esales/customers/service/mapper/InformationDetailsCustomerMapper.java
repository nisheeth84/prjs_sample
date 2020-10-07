package jp.co.softbrain.esales.customers.service.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.customers.service.dto.GetCustomerOutDetailsDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersByIdsInfoCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersOutDataInfosDTO;
import jp.co.softbrain.esales.customers.service.dto.InformationDetailsCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.SelectCustomersDTO;

/**
 * InformationOfCustomerMapper
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface InformationDetailsCustomerMapper {

    @Mapping(target = "customerData", ignore = true)
    @Mapping(target = "customerDataString", source = "customerData")
    @Mapping(target = "customerLogo.photoFileName", source = "photoFileName")
    @Mapping(target = "customerLogo.photoFilePath", source = "photoFilePath")
    @Mapping(target = "parentId", source = "parentCustomerId")
    @Mapping(target = "parentName", source = "parentCustomerName")
    @Mapping(target = "createdUser.employeeId", source = "createdUserId")
    @Mapping(target = "createdUser.employeeName", source = "createdUserName")
    @Mapping(target = "createdUser.employeePhoto", source = "createdUserPhoto")
    @Mapping(target = "updatedUser.employeeId", source = "updatedUserId")
    @Mapping(target = "updatedUser.employeeName", source = "updatedUserName")
    @Mapping(target = "updatedUser.employeePhoto", source = "updatedUserPhoto")
    @Mapping(target = "personInCharge.employeeId", source = "employeeId")
    @Mapping(target = "personInCharge.employeeName", source = "employeeName")
    @Mapping(target = "personInCharge.employeePhoto", source = "employeePhoto")
    @Mapping(target = "personInCharge.departmentId", source = "departmentId")
    @Mapping(target = "personInCharge.groupId", source = "groupId")
    GetCustomerOutDetailsDTO toDetailsResonse(InformationDetailsCustomerDTO detailSelected);

    List<GetCustomerOutDetailsDTO> toDetailsResonse(List<InformationDetailsCustomerDTO> listDetailsSelected);

    List<GetCustomersOutDataInfosDTO> toCustomersOut(List<SelectCustomersDTO> listSelectedData);

    @Mapping(target = "customerData", ignore = true)
    @Mapping(target = "customerDataString", source = "customerData")
    @Mapping(target = "customerLogo.photoFileName", source = "photoFileName")
    @Mapping(target = "customerLogo.photoFilePath", source = "photoFilePath")
    @Mapping(target = "customerAddressObject.zipCode", source = "zipCode")
    @Mapping(target = "customerAddressObject.addressName", source = "address")
    @Mapping(target = "customerAddressObject.buildingName", source = "building")
    @Mapping(target = "business.businessMainId", source = "businessMainId")
    @Mapping(target = "business.businessMainName", source = "businessMainName")
    @Mapping(target = "business.buisinessSubId", source = "businessSubId")
    @Mapping(target = "business.businessSubname", source = "businessSubName")
    @Mapping(target = "createdUser.employeeId", source = "createdUserId")
    @Mapping(target = "createdUser.employeeName", source = "createdUserName")
    @Mapping(target = "createdUser.employeePhoto", source = "createdUserPhoto")
    @Mapping(target = "updatedUser.employeeId", source = "updatedUserId")
    @Mapping(target = "directParent", nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mapping(target = "directParent.customerId", source = "parentCustomerId")
    @Mapping(target = "directParent.customerName", source = "parentCustomerName")
    @Mapping(target = "updatedUser.employeeName", source = "updatedUserName")
    @Mapping(target = "updatedUser.employeePhoto", source = "updatedUserPhoto")
    @Mapping(target = "personInCharge.employeeId", source = "employeeId")
    @Mapping(target = "personInCharge.departmentId", source = "departmentId")
    @Mapping(target = "personInCharge.groupId", source = "groupId")
    GetCustomersOutDataInfosDTO toCustomersOut(SelectCustomersDTO selectedData);

    List<GetCustomersByIdsInfoCustomerDTO> toCustomersByIdsOut(List<InformationDetailsCustomerDTO> listCustomerDetails);

    @Mapping(target = "customerData", ignore = true)
    @Mapping(target = "customerDataString", source = "customerData")
    @Mapping(target = "customerLogo.photoFileName", source = "photoFileName")
    @Mapping(target = "customerLogo.photoFilePath", source = "photoFilePath")
    @Mapping(target = "customerParent.customerId", source = "parentCustomerId")
    @Mapping(target = "customerParent.customerName", source = "parentCustomerName")
    @Mapping(target = "customerAddressObject.zipCode", source = "zipCode")
    @Mapping(target = "customerAddressObject.addressName", source = "address")
    @Mapping(target = "customerAddressObject.buildingName", source = "building")
    @Mapping(target = "personInCharge.employeeId", source = "employeeId")
    @Mapping(target = "personInCharge.employeeName", source = "employeeName")
    @Mapping(target = "personInCharge.employeePhoto", source = "employeePhoto")
    @Mapping(target = "personInCharge.departmentId", source = "departmentId")
    @Mapping(target = "personInCharge.groupId", source = "groupId")
    @Mapping(target = "businessMain.value", source = "businessMainId")
    @Mapping(target = "businessMain.labelJaJp", source = "businessMainName")
    @Mapping(target = "businessMain.labelEnUs", source = "businessMainName")
    @Mapping(target = "businessMain.labelZhCn", source = "businessMainName")
    @Mapping(target = "businessSub.value", source = "businessSubId")
    @Mapping(target = "businessSub.labelJaJp", source = "businessSubName")
    @Mapping(target = "businessSub.labelEnUs", source = "businessSubName")
    @Mapping(target = "businessSub.labelZhCn", source = "businessSubName")
    GetCustomersByIdsInfoCustomerDTO toCustomersByIdsOut(InformationDetailsCustomerDTO customerDetails);

}
