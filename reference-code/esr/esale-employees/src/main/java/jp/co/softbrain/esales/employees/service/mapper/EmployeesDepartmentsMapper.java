package jp.co.softbrain.esales.employees.service.mapper;

import jp.co.softbrain.esales.employees.domain.*;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDepartmentsDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link EmployeesDepartments} and its DTO {@link EmployeesDepartmentsDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface EmployeesDepartmentsMapper extends EntityMapper<EmployeesDepartmentsDTO, EmployeesDepartments> {

}
