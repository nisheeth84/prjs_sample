package jp.co.softbrain.esales.employees.service.mapper;

import org.mapstruct.*;
import jp.co.softbrain.esales.employees.domain.*;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupMembersDTO;

/**
 * Mapper for the entity {@link EmployeesGroupMembers} and its DTO
 * {@link EmployeesGroupMembersDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface EmployeesGroupMembersMapper extends EntityMapper<EmployeesGroupMembersDTO, EmployeesGroupMembers> {

    default EmployeesGroupMembers fromGroupMemberId(Long groupMemberId) {
        if (groupMemberId == null) {
            return null;
        }
        EmployeesGroupMembers employeesGroupMember = new EmployeesGroupMembers();
        employeesGroupMember.setEmployeeId(groupMemberId);
        return employeesGroupMember;
    }
}
