package jp.co.softbrain.esales.employees.service.mapper;


import jp.co.softbrain.esales.employees.domain.*;
import jp.co.softbrain.esales.employees.service.dto.EmployeesHistoriesDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link EmployeesHistories} and its DTO {@link EmployeesHistoriesDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface EmployeesHistoriesMapper extends EntityMapper<EmployeesHistoriesDTO, EmployeesHistories> {



    default EmployeesHistories fromId(Long employeeHistoryId) {
        if (employeeHistoryId == null) {
            return null;
        }
        EmployeesHistories employeesHistories = new EmployeesHistories();
        employeesHistories.setEmployeeHistoryId(employeeHistoryId);
        return employeesHistories;
    }
}
