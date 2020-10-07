package jp.co.softbrain.esales.employees.service.mapper;

import jp.co.softbrain.esales.employees.domain.*;
import jp.co.softbrain.esales.employees.service.dto.DepartmentsDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link Departments} and its DTO {@link DepartmentsDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface DepartmentsMapper extends EntityMapper<DepartmentsDTO, Departments> {

    default Departments fromId(Long departmentId) {
        if (departmentId == null) {
            return null;
        }
        Departments departments = new Departments();
        departments.setDepartmentId(departmentId);
        return departments;
    }
}
