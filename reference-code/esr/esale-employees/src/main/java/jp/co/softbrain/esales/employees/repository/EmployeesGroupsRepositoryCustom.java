package jp.co.softbrain.esales.employees.repository;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.employees.domain.EmployeesGroups;
import jp.co.softbrain.esales.employees.service.dto.EmployeeGroupAndGroupMemberDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupAutoUpdateDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupsDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType4;
import jp.co.softbrain.esales.employees.service.dto.GetGroupByNameDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupSuggestionsDataDTO;
import jp.co.softbrain.esales.employees.service.dto.GroupEmployeeListDTO;

@Repository
public interface EmployeesGroupsRepositoryCustom {

    /**
     * Find group information by groupId
     * 
     * @param groupId group id get information.
     * @return group information.
     */
    public List<EmployeesGroupAutoUpdateDTO> findGroupInformationByGroupId(Long groupId);

    /**
     * Get information of shared groups
     *
     * @param employeeId the employeeId of the entity.
     * @param isOwner the isOwner of the entity.
     * @return information shared groups
     */
    public List<EmployeesGroupsDTO> getSharedGroups(Long employeeId, List<Long> depOfEmployee,
            List<Long> groupOfEmployee, boolean isOwner);

    /**
     * get information group by keyword
     * 
     * @param keyWords
     *            Keywords perform the search
     * @param idItemChoiceList
     *            idItemChoiceList
     * @param idHistoryChoiceList
     *            idHistoryChoiceList
     * @return information groups
     */
    public List<GetEmployeesSuggestionSubType4> getGroupsByKeyword(String keyWords, List<Long> idHistoryChoiceList,
            List<Long> idItemChoiceList);

    /**
     * Get groups by groupId and EmployeeFlg
     * 
     * @param groupId - groups ID
     * @param employeeFlg - condition to left join
     * @return list data get by groupId and employeeId
     */
    public List<EmployeeGroupAndGroupMemberDTO> getGroupsAndEmployeeIds(List<Long> groupIds, boolean employeeFlg);

    /**
     * @param employeeIdFromToken
     * @param searchValue
     * @return
     */
    public List<GetGroupSuggestionsDataDTO> findGroupByOwnerAndGroupName(Long employeeId, String searchValue);

    /**
     * getGroupWithOwnerPermision
     * 
     * @param groupId - group ID
     * @param userId - user ID
     * @param depOfEmp - department of userId
     * @param groupOfEmp - group of employee
     * @return - list entity
     */
    public EmployeesGroups getGroupWithOwnerPermision(Long groupId, Long employeeId, List<Long> depOfEmp,
            List<Long> groupOfEmp);

    /**
     * getGroupByGroupParticipant
     * 
     * @param groupParticipantIds
     * @return list DTO
     */
    public List<EmployeesGroupsDTO> getGroupByGroupParticipant(List<Long> groupParticipantIds);

    /**
     * get group and employee for select organization item
     *
     * @param groupIds
     * @return
     */
    public List<GroupEmployeeListDTO> getGroupsAndEmployeesForOrg(List<Long> groupIds);

    /**
     * Get group by conditions
     * 
     * @param conditions
     *        conditions
     * @param parameters
     *        parameters list
     * @return list DTO
     */
    public List<GetGroupByNameDTO> getGroupByConditions(String conditions, Map<String, Object> parameters);
}
