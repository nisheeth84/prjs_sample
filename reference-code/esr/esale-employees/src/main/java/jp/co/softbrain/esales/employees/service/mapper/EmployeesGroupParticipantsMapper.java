package jp.co.softbrain.esales.employees.service.mapper;


import jp.co.softbrain.esales.employees.domain.*;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupParticipantsDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link EmployeesGroupParticipants} and its DTO {@link EmployeesGroupParticipantsDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface EmployeesGroupParticipantsMapper extends EntityMapper<EmployeesGroupParticipantsDTO, EmployeesGroupParticipants> {



    default EmployeesGroupParticipants fromId(Long employeeGroupParticipantId) {
        if (employeeGroupParticipantId == null) {
            return null;
        }
        EmployeesGroupParticipants employeesGroupParticipants = new EmployeesGroupParticipants();
        employeesGroupParticipants.setEmployeeGroupParticipantId(employeeGroupParticipantId);
        return employeesGroupParticipants;
    }
}
