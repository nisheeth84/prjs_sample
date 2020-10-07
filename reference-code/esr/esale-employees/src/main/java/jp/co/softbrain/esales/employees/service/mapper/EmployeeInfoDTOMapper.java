/**
 * 
 */
package jp.co.softbrain.esales.employees.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import jp.co.softbrain.esales.employees.service.dto.EmployeeInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.SelectEmployeesDTO;

/**
 * @author nguyentienquan
 *
 */
@Mapper(componentModel = "spring", uses = {})
public interface EmployeeInfoDTOMapper {
    
    @Mapping(target = "employeeData", ignore = true)
    EmployeeInfoDTO toEmployeeInfoDTO (SelectEmployeesDTO source);
}
