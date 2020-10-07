package jp.co.softbrain.esales.employees.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.employees.service.dto.DepartmentPositionIdsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDepartmentsDTO;

/**
 * Mapper for the DTO {@link DepartmentPositionIdsDTO} and its DTO
 * {@link EmployeesDepartmentsDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface DepartmentPositionIdsMapper extends EntityMapper<EmployeesDepartmentsDTO, DepartmentPositionIdsDTO> {

}
