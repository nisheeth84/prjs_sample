/**
 * 
 */
package jp.co.softbrain.esales.employees.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import jp.co.softbrain.esales.employees.service.dto.EmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesWithEmployeeDataFormatDTO;

/**
 * Mapper for 2 DTO {@link EmployeesWithEmployeeDataFormatDTO} and
 * {@link EmployeesDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface EmployeesWithEmployeeDataFormatMapper {
    @Mapping(target = "employeeData", ignore = true)
    EmployeesWithEmployeeDataFormatDTO toEmployeesWithEmployeeDataFormat(EmployeesDTO source);
}
