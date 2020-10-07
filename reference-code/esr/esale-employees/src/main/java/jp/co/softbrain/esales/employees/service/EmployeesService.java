package jp.co.softbrain.esales.employees.service;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.domain.FieldInfo;
import jp.co.softbrain.esales.employees.service.dto.CreateUpdateEmployeeInDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeLayoutDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeOutDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeRelationsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesWithEmployeeDataFormatDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeeMailsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionOutDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubInDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupAndDepartmentByEmployeeIdsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.ImportEmployeesInDTO;
import jp.co.softbrain.esales.employees.service.dto.ImportEmployeesOutDTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeInviteModalDTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeLocalMenuOutDTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeManagerModalOutDTO;
import jp.co.softbrain.esales.employees.service.dto.InviteEmployeesInDTO;
import jp.co.softbrain.esales.employees.service.dto.InviteEmployeesOutDTO;
import jp.co.softbrain.esales.employees.service.dto.IsExistEmployeeByKeyOutDTO;
import jp.co.softbrain.esales.employees.service.dto.SearchConditionsDTO;
import jp.co.softbrain.esales.employees.service.dto.SendMailForUsersResponseDTO;
import jp.co.softbrain.esales.employees.service.dto.UpdateEmployeesInDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetOrganizationRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.request.UpdateSettingEmployeeRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetEmployeeBasicResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetEmployeeSuggestionsGlobalResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetOrganizationResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.UpdateDisplayFirstScreenResponse;
import jp.co.softbrain.esales.utils.dto.FileMappingDTO;
import jp.co.softbrain.esales.utils.dto.RelationDataInfosInDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.employees.domain.Employees}.
 */
@XRayEnabled
public interface EmployeesService {

    /**
     * Save a employees.
     *
     * @param employeesDTO the entity to save.
     * @return the persisted entity.
     */
    EmployeesDTO save(EmployeesDTO employeesDTO);
    
    /**
     * Get all the employees.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EmployeesDTO> findAll(Pageable pageable);

    /**
     * Get the "id" employees.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EmployeesDTO> findOne(Long id);

    /**
     * Delete the "id" employees.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Count total employees
     *
     * @param searchConditions - Array of search criteria
     * @return total employees
     * @throws Exception
     */

    public Long getTotalEmployees(SearchConditionsDTO searchConditions, String languageCode);

    /**
     * Get employees list by dynamic search condition.
     *
     * @param searchConditions - Array of search criteria
     * @param isFetchId - fetch id only
     * @param langKey - language of user login
     * @return
     * @throws Exception
     */
    public List<EmployeeInfoDTO> getEmployees(SearchConditionsDTO searchConditions, Boolean isFetchId, String langKey);

    /**
     * convert employeeData of employeesDTO object into key, value, fieldType
     * format
     *
     * @param employees List of employeesDTO object need to convert
     * @param isNeedFieldType true if caller need fieldType of fields in
     *        employeeData
     * @return List of converted object
     */
    public List<EmployeesWithEmployeeDataFormatDTO> toEmployeesWithEmployeeDataFormat(List<EmployeesDTO> employees,
            Boolean isNeedFieldType);

    /**
     * Get relations of the employee for editing
     *
     * @param langCode langCode
     * @return EmployeeRelationsDTO
     */
    public EmployeeRelationsDTO getEmployeeRelations(String langCode);

    /**
     * Update employees
     *
     * @param employees- list employees will update
     * @return list id employee updated
     */
    public List<Long> updateEmployees(List<UpdateEmployeesInDTO> employees, List<FileMappingDTO> files)
            throws IOException;

    /**
     * Get department, my group, shared group in local menu screen.
     *
     * @return information department, my group, shared group.
     */
    public InitializeLocalMenuOutDTO initializeLocalMenu();

    /**
     * Create an employee
     *
     * @param data: employee's data need to create
     * @param files files upload environment
     * @param shouldValidate true if the parameter need to be validated
     * @return Long: id of the created employee
     */
    public Long createEmployee(CreateUpdateEmployeeInDTO data, List<FileMappingDTO> files, Boolean shouldValidate)
            throws IOException;

    /**
     * Update an Employee
     *
     * @param data: employee's data need to update
     * @param employeeId : employee's id need to update
     * @return Long: employeeId
     */
    public Long updateEmployee(Long employeeId, CreateUpdateEmployeeInDTO data, List<FileMappingDTO> files)
            throws IOException;

    /**
     * Get list departments, subscriptions, options
     * @return InitializeInviteModalDTO : data initialization invite modal
     *         including department, subscription and option
     */
    public InitializeInviteModalDTO getInitializeInviteModal();

    /**
     * Send email to invite Employees
     *
     * @param inviteEmployeesIn : List of employees will be invited
     * @return InviteEmployeesOutDTO : List email and member name of invited
     *         employees
     * @throws Exception : when having any errors while invite employees
     */
    InviteEmployeesOutDTO inviteEmployees(List<InviteEmployeesInDTO> inviteEmployeesIn) throws Exception;

    /**
     * Get list departmentId not in database.
     *
     * @param lstDepartmentId : department id
     * @return departments id not exist
     * @throws Exception when having any errors while check exist Department by
     *         Id
     */
    List<Long> getNotExistDepartmentIds(List<Long> lstDepartmentId) throws Exception;

    /**
     * Check exist email of employee in database.
     *
     * @param email email input
     * @return Email list exists in database
     * @throws Exception when having any errors while check exist email of
     *         employee
     */
    public List<String> isExistEmailOfEmployee(List<String> email) throws Exception;

    /**
     * Initialize Manager Modal
     *
     * @param employeeIds
     * @param langKey
     * @return InitializeManagerModalOutDTO
     * @throws Exception
     */
    public InitializeManagerModalOutDTO initializeManagerModal(List<Long> employeeIds, String langKey)
            throws IOException;

    /**
     * Get list mail of employee
     *
     * @param employeeIds - list employee
     * @param groupIds - list group
     * @param departmentIds - list department
     * @return list email return
     */
    public GetEmployeeMailsOutDTO getEmployeeMails(List<Long> employeeIds, List<Long> groupIds,
            List<Long> departmentIds);

    /**
     * Check exsit employee
     *
     * @param keyFieldName - field search
     * @param fieldValue - value search
     * @return number of employee satisfied
     */
    public IsExistEmployeeByKeyOutDTO isExistEmployeeByKey(String keyFieldName, String fieldValue);

    /**
     * Import data CSV.
     *
     * @param importEmployeesInDTO data import.
     * @return Data reference result.
     */
    public ImportEmployeesOutDTO importEmployees(ImportEmployeesInDTO importEmployeesInDTO);

    /**
     * Get fields of employees' service
     *
     * @param langCode language code of login user
     * @param extensionBelong code of screen
     * @return List fields of employees' service
     */
    public List<EmployeeLayoutDTO> getEmployeeLayoutPersonal(int extensionBelong);

    /**
     * Get fields of employees' service
     *
     * @param langCode language code of login user
     * @return List fields of employees' service
     */
    public List<EmployeeLayoutDTO> getEmployeeLayout();

    /**
     * Get employee information according to search criteria to display
     * pulldown.
     *
     * @param keyWords Keywords perform the search
     * @param startTime start time
     * @param endTime end time
     * @param searchType type of search <br />
     *     + null : Search all Department, Employee and Group <br />
     *     + 1    : Search department <br />
     *     + 2    : Search employee <br />
     *     + 3    : Search group <br />
     *     + 4    : Search employee and department <br />
     *     + 5    : Search employee and group <br />
     *     + 6    : Search department and group <br />
     * @param langKey User specified language
     * @param employeeId employeeId token
     * @return DTO out of API getEmployeesSuggestion
     */
    public GetEmployeesSuggestionOutDTO getEmployeesSuggestion(String keyWords, String startTime, String endTime,
            Long searchType, String langKey, Long offSet, Long limit, List<GetEmployeesSuggestionSubInDTO> listItemChoice,
            Long employeeId, Long relationFieldId) throws IOException;

    /**
     * Get group and department by employeeIds
     *
     * @param employeeIds - list employeeId to get
     * @return data response
     */
    public GetGroupAndDepartmentByEmployeeIdsOutDTO getGroupAndDepartmentByEmployeeIds(List<Long> employeeIds);

    /**
     * update employee status
     *
     * @param employeeId employee's id need to update status
     * @param employeeStatus data need to update
     * @param updatedDate The data is needed for check exclusive
     * @return employeeId after update
     */
    public Long updateEmployeeStatus(Long employeeId, Integer employeeStatus, Instant updatedDate)
            throws IOException;

    /**
     * get list id of all employee
     *
     * @return {@link List}
     */
    public List<Long> getAllEmployeeId();

    /**
     * API update data for Relation category
     *
     * @param recordId
     * @param relationDataInfos
     * @return
     */
    public List<Long> updateRelationData(Long recordId, List<RelationDataInfosInDTO> relationDataInfos);

    /**
     * get all the employee for sync schedules
     *
     * @return list Employee DTO response
     */
    public List<EmployeesDTO> getEmployeeForSyncSchedules();

    /**
     * Get info of employee suggest global
     *
     * @param searchValue keyword input from screen
     * @param limit limit
     * @param offSet offSet
     * @return the response DTO of API
     */
    public GetEmployeeSuggestionsGlobalResponse getEmployeeSuggestionsGlobal(String searchValue, Long limit, Long offSet);

    /**
     * get relation data
     *
     * @param fieldName
     * @return
     */
    public List<FieldInfo> getRealationData(String fieldName);

    /**
     * Update setting employee
     *
     * @param request @see UpdateSettingEmployeeRequest
     * @return employee id
     */
    Long updateSettingEmployee(UpdateSettingEmployeeRequest request);

    /**
     * Send mail for user from list display
     *
     * @param request request id list
     * @return - list sendmail result
     */
    SendMailForUsersResponseDTO sendMailForUsers(List<Long> employeeIds);

    /**
     * Update Display First Screen
     *
     * @param employeeId
     * @param isDisplayFirstScreen
     * @return the Entity
     */
    UpdateDisplayFirstScreenResponse updateDisplayFirstScreen(Long employeeId, Boolean isDisplayFirstScreen,
            Instant updatedDate);

    /**
     * Get employee ids by list employee's name
     *
     * @param list employee's name
     * @return list EmployeeNameDTO
     */
    public List<EmployeeNameDTO> getEmployeeIds(List<String> employeeNames);

    /**
     * Get list employee by tenant
     *
     * @param email email
     * @return GetEmployeeByTenantResponse
     */
    public EmployeeOutDTO getEmployeeByTenant(String email);

    /**
     * get Organization
     *
     * @param request info
     * @return - GetOrganizationResponse
     */
    GetOrganizationResponse getOrganization(GetOrganizationRequest request);

    /**
     * @param employeeId id employee
     * @return GetEmployeeBasicResponse basic information of employees
     */
    public GetEmployeeBasicResponse getEmployeeBasic(Long employeeId);
}
