package jp.co.softbrain.esales.employees.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.employees.service.dto.CreateUpdateEmployeeInDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDTO;

/**
 * Mapper for the DTO {@link CreateUpdateEmployeeInDTO} and its DTO
 * {@link EmployeesDTO}.
 */

@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface CreateUpdateEmployeeMapper {

    /**
     * map EmployeesDTO from CreateUpdateEmployeeInDTO WithoutEmployeeData
     * 
     * @param source : data need to map
     * @return EmployeesDTO map from CreateUpdateEmployeeInDTO
     */
    @Named("mapWithoutData")
    @Mapping(target = "employeeData", ignore = true)
    EmployeesDTO toEmployeesDTOWithoutEmployeeData(CreateUpdateEmployeeInDTO source);

}
