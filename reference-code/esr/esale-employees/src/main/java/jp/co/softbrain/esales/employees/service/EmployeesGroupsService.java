package jp.co.softbrain.esales.employees.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupInDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupsDTO;
import jp.co.softbrain.esales.employees.service.dto.GetFullEmployeesByParticipantResponse;
import jp.co.softbrain.esales.employees.service.dto.GetGroupByNameDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupSuggestionsResponseDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.GetParticipantDataByIdsResponse;
import jp.co.softbrain.esales.employees.service.dto.InitializeGroupModalOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.response.RefreshAutoGroupResponse;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.employees.domain.EmployeesGroups}.
 */
@XRayEnabled
public interface EmployeesGroupsService {

    /**
     * Save a employeesGroups.
     *
     * @param employeesGroupsDTO the entity to save.
     * @return the persisted entity.
     */
    EmployeesGroupsDTO save(EmployeesGroupsDTO employeesGroupsDTO);

    /**
     * Get all the employeesGroups.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EmployeesGroupsDTO> findAll(Pageable pageable);

    /**
     * Get the "id" employeesGroups.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EmployeesGroupsDTO> findOne(Long id);

    /**
     * Delete the "id" employeesGroups.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Update auto group.
     *
     * @param idOfList group id update.
     * @return employee id update
     */
    RefreshAutoGroupResponse refreshAutoGroup(Long idOfList);

    /**
     * Delete employee's group by groupId.
     *
     * @param groupId group id delete.
     * @return id group has been removed.
     */
    public Long deleteGroup(Long groupId);

    /**
     * Get information to display Initialize Group Modal
     *
     * @param groupId groupId
     * @param isOwnerGroup
     *        true : group owner
     *        false : my group
     * @param isAutoGroup isAutoGroup
     * @return the entity of InitializeGroupModalOutDTO
     */
    public InitializeGroupModalOutDTO getInitializeGroupModalInfo(Long groupId, Boolean isOwnerGroup,
            Boolean isAutoGroup);

    /**
     * Get participant data
     *
     * @param participantEmployeeIds
     * @param participantDepartmentIds
     * @param participantGroupIds
     * @return
     */
    public GetParticipantDataByIdsResponse getParticipantDataByIds(List<Long> participantEmployeeIds,
            List<Long> participantDepartmentIds, List<Long> participantGroupIds);

    /**
     * Perform Group registration (case of creating and copying groups)
     *
     * @param groupParams the information group
     * @return the groupId of the entity inserted
     */
    public Long createGroup(EmployeesGroupInDTO group);

    /**
     * update change Group information
     *
     * @param groupParams the information group
     * @return the groupId of the entity updated
     */
    public Long updateGroup(EmployeesGroupInDTO groupParams);

    /**
     * Get groups by groupIds.
     *
     * @param groupIds groupIds get.
     * @param getEmployeesFlg confirm flag get employee information.
     * @param languageKey - language key from token.
     * @return information groups and employees.
     */
    public GetGroupsOutDTO getGroups(List<Long> groupIds, boolean getEmployeesFlg, String languageKey);

    /**
     * Get group suggestions
     *
     * @param searchValue - key word to search
     * @return list suggest
     */
    GetGroupSuggestionsResponseDTO getGroupSuggestions(String searchValue);

    /**
     * Get last update date by list id
     *
     * @param groupId
     *            id of selectedTargetId
     * @return lastUpdatedDate
     */
    public Instant getLastUpdatedDateByGroupId(Long groupId);

    /**
     * Get full employee id from id of participant. <Br/>
     *
     * @param employeeIds employee id in participant
     * @param departmentIds department id in participant
     * @param groupIds group id in participant
     * @return all employee id in participant
     */
    public GetFullEmployeesByParticipantResponse getFullEmployeesByParticipant(List<Long> employeeIds,
            List<Long> departmentIds, List<Long> groupIds);

    /**
     * Get group by conditions
     * 
     * @param conditionsGroup
     *        conditionsGroup
     * @param parameters
     *        parameters list
     * @return list get group by name
     */
    List<GetGroupByNameDTO> getGroupByConditions(String conditionsGroup, Map<String, Object> parameters);
}
