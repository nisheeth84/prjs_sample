package jp.co.softbrain.esales.employees.service.mapper;

import jp.co.softbrain.esales.employees.domain.*;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupSearchConditionsDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link EmployeesGroupSearchConditions} and its DTO {@link EmployeesGroupSearchConditionsDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface EmployeesGroupSearchConditionsMapper extends EntityMapper<EmployeesGroupSearchConditionsDTO, EmployeesGroupSearchConditions> {



    default EmployeesGroupSearchConditions fromId(Long searchContentId) {
        if (searchContentId == null) {
            return null;
        }
        EmployeesGroupSearchConditions employeesGroupSearchConditions = new EmployeesGroupSearchConditions();
        employeesGroupSearchConditions.setSearchContentId(searchContentId);
        return employeesGroupSearchConditions;
    }
}
