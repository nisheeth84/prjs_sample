/**
 * 
 */
package jp.co.softbrain.esales.employees.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.repository.DepartmentsRepository;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.SuggestionEmployeeService;
import jp.co.softbrain.esales.employees.service.dto.DepartmentPositionDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesWithEmployeeDataFormatDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType1;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType2;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType3;
import jp.co.softbrain.esales.employees.service.dto.ItemChoiceDTO;
import jp.co.softbrain.esales.employees.service.dto.SelectEmployeeElasticsearchInDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.GetEmployeeSuggestionChoiceResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.GetEmployeeSuggestionsChoiceRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.SelectDetailElasticSearchResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.SuggestionsChoiceDTO;
import jp.co.softbrain.esales.employees.service.dto.timelines.GetTimelineGroupsForm;
import jp.co.softbrain.esales.employees.service.dto.timelines.GetTimelineGroupsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.timelines.GetTimelineGroupsSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.timelines.GetTimelineGroupsSubType2DTO;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetSuggestionTimelineResponse;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.SearchItem;

/**
 * Service for function suggestion
 * 
 * @author phamminhphu
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class SuggestionEmployeeServiceImpl implements SuggestionEmployeeService {

    private final Logger log = LoggerFactory.getLogger(SuggestionEmployeeServiceImpl.class);

    private static final Long TIMELINE_SEARCH_TYPE = 4L;

    private static final Integer SUGGESTION_LIMIT = 10;

    private static final Long SUGGESTION_TIME_LIMIT = 5L;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private EmployeesCommonService employeesCommonService;
    @Autowired
    private EmployeesService employeesService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DepartmentsRepositoryCustom departmentsRepositoryCustom;

    @Autowired
    private DepartmentsRepository departmentsRepository;

    /**
     * @see jp.co.softbrain.esales.employees.service.SuggestionEmployeeService#getSuggestionTimeline(java.lang.String,
     *      java.util.List, java.lang.Long, java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetSuggestionTimelineResponse getSuggestionTimeline(String keyWords, List<ItemChoiceDTO> listItemChoice,
            Long timelineGroupId, Long offset) {
        GetSuggestionTimelineResponse response = new GetSuggestionTimelineResponse();
        Long employeeIdToken = jwtTokenUtil.getEmployeeIdFromToken();
        String langKey = jwtTokenUtil.getLanguageKeyFromToken();

        // 1. Call API getTimelineGroups
        Set<Long> inviteIdEmp = new HashSet<>();
        Set<Long> inviteIdDep = new HashSet<>();

        if (timelineGroupId != null) {
            GetTimelineGroupsForm getTimelineReq = new GetTimelineGroupsForm();
            getTimelineReq.setTimelineGroupIds(Collections.singletonList(timelineGroupId));
            List<GetTimelineGroupsSubType1DTO> timelinesGroupList = getTimelineGroup(getTimelineReq);
            List<GetTimelineGroupsSubType2DTO> inviteList = new ArrayList<>();
            timelinesGroupList.forEach(time -> inviteList.addAll(time.getInvites()));

            inviteIdEmp = inviteList.stream()
                    .filter(invite -> ConstantsEmployees.EMPLOYEE_TYPE.equals(invite.getInviteType())
                            && ConstantsEmployees.STATUS_TYPE.equals(invite.getStatus()))
                    .map(GetTimelineGroupsSubType2DTO::getInviteId).collect(Collectors.toSet());
            inviteIdDep = inviteList.stream()
                    .filter(invite -> ConstantsEmployees.DEPARTMENT_TYPE.equals(invite.getInviteType())
                            && ConstantsEmployees.STATUS_TYPE.equals(invite.getStatus()))
                    .map(GetTimelineGroupsSubType2DTO::getInviteId).collect(Collectors.toSet());
        }

        final List<Long> idItemChoiceEmpList = Optional.ofNullable(listItemChoice).map(Collection::stream).orElse(
                Stream.empty())
                .filter(itemChoice -> ConstantsEmployees.EMPLOYEE_SEARCH_TYPE.equals(itemChoice.getSearchType()))
                .map(ItemChoiceDTO::getIdChoice).collect(Collectors.toList());
        final List<Long> idItemChoiceDepList = Optional.ofNullable(listItemChoice).map(Collection::stream).orElse(
                Stream.empty())
                .filter(itemChoice -> ConstantsEmployees.DEPARTMENT_GROUP_SEARCH_TYPE.equals(itemChoice.getSearchType()))
                .map(ItemChoiceDTO::getIdChoice).collect(Collectors.toList());
        
        // 2. Call API getEmployeeSuggestionsChoice
        List<SuggestionsChoiceDTO> historyChoice = new ArrayList<>();
        if (StringUtil.isNull(keyWords)) {
            historyChoice = getEmployeeSuggestionsChoice(employeeIdToken, TIMELINE_SEARCH_TYPE);
            if (CollectionUtils.isEmpty(historyChoice)) {
                return response;
            }
        }

        // Control record
        Long total = 0L;
        Long limitRecord = SUGGESTION_TIME_LIMIT;
        Long offsetRecord = offset;
        Set<Long> idHistoryChoiceList = new HashSet<>();
        Map<Long, Long> historyChoiceIdMap = new HashMap<>();

        // 4. search employees
        for (SuggestionsChoiceDTO choice : historyChoice) {
            if (ConstantsEmployees.EMPLOYEE.equals(choice.getIndex())) {
                idHistoryChoiceList.add(choice.getIdResult());
                historyChoiceIdMap.put(choice.getIdResult(), choice.getSuggestionsChoiceId());
            }
        }

        // list employee id
        List<Long> employeeIds = new ArrayList<>();
        if (StringUtil.isNull(keyWords)) {
            employeeIds.addAll(idHistoryChoiceList);
        } else {
            employeeIds.addAll(getEmployeeIdFromElasticSearch(keyWords));
        }

        // 4.2 Remove employee id unnecessary
        final Set<Long> inviteIdEmpFinal = new HashSet<>(inviteIdEmp);
        if (timelineGroupId != null) {
            employeeIds = employeeIds.stream()
                    .filter(id -> !idItemChoiceEmpList.contains(id) && inviteIdEmpFinal.contains(id))
                    .collect(Collectors.toList());
        } else {
            employeeIds = employeeIds.stream().filter(id -> !idItemChoiceEmpList.contains(id))
                    .collect(Collectors.toList());
        }
        // 4.3 Get employee info
        List<EmployeeInfoDTO> employeeList = new ArrayList<>();
        if (employeeIds != null && !employeeIds.isEmpty()) {
            employeeList = getEmployeeInfoByIds(employeeIds, new ArrayList<>(idHistoryChoiceList), historyChoiceIdMap);
        }
        total = total + employeeList.size();
        Long indexEndSub = (total - offset) <= SUGGESTION_TIME_LIMIT ? total : limitRecord;
        if (indexEndSub > offsetRecord) {
            response.setEmployees(employeeList.subList(Math.toIntExact(offsetRecord), Math.toIntExact(indexEndSub)));
            // fix position_name
            getPositionNameForEmployee(response.getEmployees(), langKey);
        }

        // 3. Search department
        idHistoryChoiceList = new HashSet<>();
        historyChoiceIdMap = new HashMap<>();
        for (SuggestionsChoiceDTO hChoice : historyChoice) {
            if (ConstantsEmployees.EMPLOYEE_DEPARTMENT.equals(hChoice.getIndex())) {
                idHistoryChoiceList.add(hChoice.getIdResult());
                historyChoiceIdMap.put(hChoice.getIdResult(), hChoice.getSuggestionsChoiceId());
            }
        }
        // add inviteId to search IN
        String keyWordsEscapeSql = StringUtil.escapeSqlCommand(keyWords);
        List<GetEmployeesSuggestionSubType1> departmentList;
        if (timelineGroupId != null && (inviteIdDep == null || inviteIdDep.isEmpty())) {
            departmentList = new ArrayList<>();
        } else {
            departmentList = getEmployeesByDepartment(keyWordsEscapeSql, langKey, new ArrayList<>(idHistoryChoiceList),
                    new ArrayList<>(inviteIdDep), idItemChoiceDepList, historyChoiceIdMap);
        }
        Long totalDepartment = Long.valueOf(departmentList.size());

        if (total - offset <= SUGGESTION_TIME_LIMIT && total - offset >= 0) {
            offsetRecord = 0L;
            limitRecord = offset - total + SUGGESTION_TIME_LIMIT;
        } else {
            offsetRecord = offset - total;
            limitRecord = (totalDepartment - offset) < SUGGESTION_TIME_LIMIT ? totalDepartment
                    : offset + SUGGESTION_TIME_LIMIT;
        }

        indexEndSub = (totalDepartment - offset) < 10 ? totalDepartment : limitRecord;
        if (offsetRecord >= 0 && offsetRecord <= totalDepartment && indexEndSub > offsetRecord) {
            response.setDepartments(
                    departmentList.subList(Math.toIntExact(offsetRecord), Math.toIntExact(indexEndSub)));
        }
        return response;
    }

    /**
     * get employees information with searchType = 1
     *
     * @param keyWords
     *            keywords perform the search
     * @param langKey
     *            User specified language
     * @param idHistoryChoiceList
     *            id of employee
     * @param idItemChoiceList
     *            id of employee
     * @param historyChoiceIdMap
     * @return information of department
     */
    private List<GetEmployeesSuggestionSubType1> getEmployeesByDepartment(String keyWords, String langKey,
            List<Long> idHistoryChoiceList, List<Long> inviteId, List<Long> idItemChoiceList,
            Map<Long, Long> historyChoiceIdMap) {
        List<GetEmployeesSuggestionSubType1> listDepartmentFinal = new ArrayList<>();

        List<GetEmployeesSuggestionSubType2> listDepartments = departmentsRepositoryCustom.getDepartmentsTimelineByKeyWord(keyWords,
                idHistoryChoiceList, inviteId, idItemChoiceList);
        Map<Long, List<Long>> listAffiliatedEmployeeId = new HashMap<>();
        long departmentId = 0;
        List<Long> employeeIds;
        GetEmployeesSuggestionSubType1 emSuggesSubType1 = null;
        for (GetEmployeesSuggestionSubType2 emSuggesSubType2 : listDepartments) {
            if (listAffiliatedEmployeeId.get(emSuggesSubType2.getDepartmentId()) == null) {
                departmentId = emSuggesSubType2.getDepartmentId();
                emSuggesSubType1 = new GetEmployeesSuggestionSubType1();
                emSuggesSubType1.setDepartmentId(departmentId);
                emSuggesSubType1.setDepartmentName(emSuggesSubType2.getDepartmentName());
                GetEmployeesSuggestionSubType3 parentDep = new GetEmployeesSuggestionSubType3();
                parentDep.setDepartmentId(emSuggesSubType2.getParentDepartmentId());
                parentDep.setDepartmentName(emSuggesSubType2.getParentDepartmentName());
                emSuggesSubType1.setParentDepartment(parentDep);
                listDepartmentFinal.add(emSuggesSubType1);
                employeeIds = new ArrayList<>();
                if (emSuggesSubType2.getEmployeeId() != null) {
                    employeeIds.add(emSuggesSubType2.getEmployeeId());
                }
                listAffiliatedEmployeeId.put(departmentId, employeeIds);
            } else if (emSuggesSubType2.getEmployeeId() != null) {
                listAffiliatedEmployeeId.get(emSuggesSubType2.getDepartmentId()).add(emSuggesSubType2.getEmployeeId());
            }
        }
        for (Entry<Long, List<Long>> entry : listAffiliatedEmployeeId.entrySet()) {
            List<EmployeesWithEmployeeDataFormatDTO> employeesDepartments = employeesService
                    .toEmployeesWithEmployeeDataFormat(
                    employeesCommonService.getEmployees(entry.getValue(), null, langKey), true);
            final List<EmployeesWithEmployeeDataFormatDTO> employeesDepartmentsFinal = employeesDepartments.stream()
                    .filter(e -> e.getEmployeeStatus() != 1).collect(Collectors.toList());
            listDepartmentFinal.forEach(department -> {
                if (entry.getKey().equals(department.getDepartmentId())) {
                    department.setEmployeesDepartments(employeesDepartmentsFinal);
                }
            });
        }
        // Sort id history
        if (!CollectionUtils.isEmpty(idHistoryChoiceList)) {
            Map<Long, GetEmployeesSuggestionSubType1> departmentListMap = listDepartmentFinal.stream()
                    .collect(Collectors.toMap(GetEmployeesSuggestionSubType1::getDepartmentId, dep -> dep));
            List<GetEmployeesSuggestionSubType1> depListSort = new ArrayList<>();
            idHistoryChoiceList.forEach(idHistory -> {
                if (departmentListMap.get(idHistory) != null) {
                    GetEmployeesSuggestionSubType1 depInfoDto = departmentListMap.get(idHistory);
                    depInfoDto.setIdHistoryChoice(historyChoiceIdMap.get(idHistory));
                    depListSort.add(depInfoDto);
                }
            });
            listDepartmentFinal = depListSort;
        }
        return listDepartmentFinal;
    }

    /**
     * Fix positionName for Employee
     *
     * @param employees2
     */
    private void getPositionNameForEmployee(List<EmployeeInfoDTO> listEmployees, String langkey) {
        if (CollectionUtils.isEmpty(listEmployees)) {
            return;
        }
        for (EmployeeInfoDTO employee : listEmployees) {
            if (CollectionUtils.isEmpty(employee.getEmployeeDepartments())) {
                continue;
            }
            TypeReference<Map<String, Object>> mapRef = new TypeReference<Map<String, Object>>() {};
            for (DepartmentPositionDTO depPos : employee.getEmployeeDepartments()) {
                if (StringUtils.isBlank(depPos.getPositionName())) {
                    depPos.setPositionName("");
                    continue;
                }
                try {
                    Map<String, Object> positions = objectMapper.readValue(depPos.getPositionName(), mapRef);
                    depPos.setPositionName(positions.get(langkey).toString());
                } catch (Exception e) {
                    depPos.setPositionName(depPos.getPositionName());
                }
            }
        }
    }

    /**
     * Get Employee info by list employee ids
     * 
     * @param employeeIds
     *            employeeIds
     * @param historyChoiceIdMap
     *            map id history choice
     * @param idHistoryChoiceList
     *            list data history choice
     * @return list employee info
     */
    private List<EmployeeInfoDTO> getEmployeeInfoByIds(List<Long> employeeIds, List<Long> idHistoryChoiceList,
            Map<Long, Long> historyChoiceIdMap) {
        List<EmployeeInfoDTO> employeeList = employeesCommonService.getEmployeeByIds(employeeIds);
        if (!idHistoryChoiceList.isEmpty()) {
            Map<Long, EmployeeInfoDTO> employeeListMap = employeeList.stream()
                    .collect(Collectors.toMap(EmployeeInfoDTO::getEmployeeId, emp -> emp));
            List<EmployeeInfoDTO> employeeListSort = new ArrayList<>();
            for (Long empIdHistory : employeeIds) {
                if (employeeListMap.get(empIdHistory) != null) {
                    EmployeeInfoDTO empInfoDto = employeeListMap.get(empIdHistory);
                    empInfoDto.setIdHistoryChoice(historyChoiceIdMap.get(empIdHistory));
                    employeeListSort.add(empInfoDto);
                }
            }
            employeeList = employeeListSort.stream().distinct().collect(Collectors.toList());
        } else {
            Collections.sort(employeeList, Comparator.comparing(EmployeeInfoDTO::getEmployeeSurname)
                    .thenComparing(emp -> emp.getEmployeeName() != null));
        }
        return employeeList;
    }

    /**
     * get id of employee in elasticsearch
     * 
     * @param keyWords
     *            word search
     * @param inviteIdEmp
     *            id employee in list invite
     * @return list employee id
     */
    private List<Long> getEmployeeIdFromElasticSearch(String keyWords) {

        // create parameter to search employee from elasticsearch
        SelectEmployeeElasticsearchInDTO inDto = new SelectEmployeeElasticsearchInDTO();
        List<SearchItem> searchOrConditions = createSearchOrCondition(keyWords);
        inDto.setSearchOrConditions(searchOrConditions);
        inDto.setSearchConditions(new ArrayList<>());
        inDto.setColumnId(ConstantsEmployees.EMPLOYEE_ID);
        SelectDetailElasticSearchResponse resFromESearch = employeesCommonService.getEmployeesElasticsearch(inDto);

        // get employee_id list from elastic search result

        List<Long> employeeIdsElastic = new ArrayList<>();
        if (resFromESearch != null && !resFromESearch.getDataElasticSearch().isEmpty()) {
            resFromESearch.getDataElasticSearch().forEach(row -> row.getRow().forEach(item -> {
                if (item.getKey().equals(ConstantsEmployees.EMPLOYEE_ID)) {
                    employeeIdsElastic.add(Double.valueOf(item.getValue()).longValue());
                }
            }));
        }
        return employeeIdsElastic;
    }

    /**
     * Create search or condition
     * 
     * @return list search item
     */
    private List<SearchItem> createSearchOrCondition(String keyWords) {
        List<SearchItem> searchOrConditions = new ArrayList<>();

        SearchItem searchItem = new SearchItem();
        searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
        searchItem.setFieldName(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME);
        searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
        searchItem.setFieldValue(keyWords);
        searchOrConditions.add(searchItem);

        searchItem = new SearchItem();
        searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
        searchItem.setFieldName(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME);
        searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
        searchItem.setFieldValue(keyWords);
        searchOrConditions.add(searchItem);

        return searchOrConditions;
    }

    /**
     * Call API getTimelineGroup
     * 
     * @param getTimelineReq
     *            get timeline group request
     * @return timeline
     */
    private List<GetTimelineGroupsSubType1DTO> getTimelineGroup(GetTimelineGroupsForm getTimelineReq) {
        List<GetTimelineGroupsSubType1DTO> timelineGroup = new ArrayList<>();
        String token = SecurityUtils.getTokenValue().orElse(null);
        try {
            GetTimelineGroupsOutDTO timelinesResponse = restOperationUtils.executeCallApi(Constants.PathEnum.TIMELINES,
                    ConstantsEmployees.URL_API_GET_TIMELINE_GROUPS, HttpMethod.POST, getTimelineReq,
                    GetTimelineGroupsOutDTO.class, token, jwtTokenUtil.getTenantIdFromToken());
            if (timelinesResponse != null && timelinesResponse.getTimelineGroup() != null) {
                timelineGroup.addAll(timelinesResponse.getTimelineGroup());
            }
        } catch (IllegalStateException e) {
            log.error(e.getMessage());
        }
        return timelineGroup;
    }

    /**
     * Call API to get Employee Suggestions Choice
     *
     * @param employeeId
     *            id of employee
     * @param searchType
     * @return
     */
    private List<SuggestionsChoiceDTO> getEmployeeSuggestionsChoice(Long employeeId, Long searchType) {
        List<SuggestionsChoiceDTO> historyChoice = new ArrayList<>();
        try {
            GetEmployeeSuggestionsChoiceRequest reBuilder = new GetEmployeeSuggestionsChoiceRequest();
            List<String> indexList = new ArrayList<>();
            if (searchType == null || searchType == 1 || searchType == 4 || searchType == 6) {
                indexList.add(ConstantsEmployees.EMPLOYEE_DEPARTMENT);
            }
            if (searchType == null || searchType == 2 || searchType == 4 || searchType == 5) {
                indexList.add(ConstantsEmployees.EMPLOYEE);
            }
            if (searchType == null || searchType == 3 || searchType == 5 || searchType == 6) {
                indexList.add(ConstantsEmployees.EMPLOYEE_GROUP);
            }
            reBuilder.setEmployeeId(employeeId);
            reBuilder.setIndex(indexList);
            reBuilder.setLimit(SUGGESTION_LIMIT);
            String token = SecurityUtils.getTokenValue().orElse(null);
            // Get suggestions choice commons
            GetEmployeeSuggestionChoiceResponse suChoiceResponse = restOperationUtils.executeCallApi(
                    Constants.PathEnum.COMMONS, "get-employee-suggestions-choice", HttpMethod.POST, reBuilder,
                    GetEmployeeSuggestionChoiceResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
            if (suChoiceResponse != null && suChoiceResponse.getEmployeeSuggestionsChoice() != null) {
                historyChoice = suChoiceResponse.getEmployeeSuggestionsChoice();
            }
        } catch (Exception e) {
            throw new CustomRestException(e.getMessage(),
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }
        return historyChoice;
    }
}
