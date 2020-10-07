package jp.co.softbrain.esales.employees.service.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import jp.co.softbrain.esales.employees.domain.Employees;
import jp.co.softbrain.esales.employees.service.dto.DownloadEmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeDataDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDTO;

/**
 * Mapper for the entity {@link Employees} and its DTO {@link EmployeesDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface EmployeesMapper extends EntityMapper<EmployeesDTO, Employees> {

    default Employees fromId(Long employeeId) {
        if (employeeId == null) {
            return null;
        }
        Employees employees = new Employees();
        employees.setEmployeeId(employeeId);
        return employees;
    }
    
    @Named("mapClone")
    EmployeesDTO clone(EmployeesDTO source);

    List<DownloadEmployeesDTO> toDownloadEmployeesDTO(List<EmployeesDTO> source);

    @Named("toEmployeeData")
    @Mapping(target = "employeeData", ignore = true)
    EmployeeDataDTO toEmployeeData(Employees employeeEntity);

}
