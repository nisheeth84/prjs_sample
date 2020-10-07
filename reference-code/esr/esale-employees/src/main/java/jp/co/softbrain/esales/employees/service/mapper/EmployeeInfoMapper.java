package jp.co.softbrain.esales.employees.service.mapper;

import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.EmployeeInfoDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import jp.co.softbrain.esales.elasticsearch.dto.employees.DepartmentPositionDTO;
import jp.co.softbrain.esales.elasticsearch.dto.employees.EmployeeDataType;
import jp.co.softbrain.esales.elasticsearch.dto.employees.EmployeeElasticsearchDTO;
import jp.co.softbrain.esales.elasticsearch.dto.employees.EmployeeSubordinateDTO;
import jp.co.softbrain.esales.elasticsearch.dto.employees.EmployeesGroupNameDTO;
import jp.co.softbrain.esales.employees.domain.Employees;
import jp.co.softbrain.esales.employees.service.dto.EmployeeFullNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDataDTO;

@Mapper(componentModel = "spring", uses = {})
public interface EmployeeInfoMapper {

    @Mapping(target = "employeeData", ignore = true)
    @Mapping(target = "employeeDepartments", ignore = true)
    EmployeeInfoDTO toEmployeeInfo(Employees source);

    @Mapping(target = "employeeData", ignore = true)
    @Mapping(target = "employeeDepartments", ignore = true)
    EmployeeElasticsearchDTO toEmployeeElasticsearch(Employees source);

    List<DepartmentPositionDTO> toListDepartment(List<jp.co.softbrain.esales.employees.service.dto.DepartmentPositionDTO> list);

    List<EmployeesGroupNameDTO> toListGroup(List<jp.co.softbrain.esales.employees.service.dto.EmployeesGroupNameDTO> list);

    List<EmployeeSubordinateDTO> toListSubordinate(List<EmployeeFullNameDTO> list);

    List<EmployeeDataType> toListEmployeeData(List<EmployeesDataDTO> list);
}
