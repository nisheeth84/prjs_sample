package jp.co.softbrain.esales.employees.service.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.employees.domain.EmployeesGroups;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupsDTO;
import jp.co.softbrain.esales.employees.service.dto.ParticipantGroupsDTO;

/**
 * Mapper for the entity {@link EmployeesGroups} and its DTO {@link EmployeesGroupsDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface EmployeesGroupsMapper extends EntityMapper<EmployeesGroupsDTO, EmployeesGroups> {



    default EmployeesGroups fromId(Long groupId) {
        if (groupId == null) {
            return null;
        }
        EmployeesGroups employeesGroups = new EmployeesGroups();
        employeesGroups.setGroupId(groupId);
        return employeesGroups;
    }

    ParticipantGroupsDTO toGroupParticipant(EmployeesGroupsDTO entity);

    List<ParticipantGroupsDTO> toListGroupParticipant(List<EmployeesGroupsDTO> listEntity);
}
