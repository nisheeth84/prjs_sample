package jp.co.softbrain.esales.employees.service.impl;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.security.oauth2.common.util.RandomValueStringGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.config.Constants.PathEnum;
import jp.co.softbrain.esales.config.Constants.SearchOptionEnum;
import jp.co.softbrain.esales.config.Constants.SearchTypeEnum;
import jp.co.softbrain.esales.employees.config.ApplicationProperties;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees.OperaDivision;
import jp.co.softbrain.esales.employees.config.UtilsEmployees;
import jp.co.softbrain.esales.employees.domain.Employees;
import jp.co.softbrain.esales.employees.domain.EmployeesDepartments;
import jp.co.softbrain.esales.employees.domain.EmployeesHistories;
import jp.co.softbrain.esales.employees.domain.FieldInfo;
import jp.co.softbrain.esales.employees.repository.DepartmentsRepository;
import jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom;
import jp.co.softbrain.esales.employees.repository.EmployeesDepartmentsRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupsRepositoryCustom;
import jp.co.softbrain.esales.employees.repository.EmployeesHistoriesRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesPackagesRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesRepositoryCustom;
import jp.co.softbrain.esales.employees.repository.FieldInfoRepository;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.AuthenticationService;
import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService;
import jp.co.softbrain.esales.employees.service.EmployeesPackagesService;
import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.MailService;
import jp.co.softbrain.esales.employees.service.TmsService;
import jp.co.softbrain.esales.employees.service.dto.CognitoSettingInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.CognitoUserInfo;
import jp.co.softbrain.esales.employees.service.dto.CreateUpdateEmployeeInDTO;
import jp.co.softbrain.esales.employees.service.dto.CreateUserInputDTO;
import jp.co.softbrain.esales.employees.service.dto.CustomFieldItemDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentPositionDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentPositionIdsDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.DisplayFieldDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeBasicDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeDataType;
import jp.co.softbrain.esales.employees.service.dto.EmployeeDepartmentBasicDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeFullNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeIconDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeLayoutDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeOutDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeeRelationsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDataDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupNameDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesHistoriesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackageSumIdsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackagesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackagesSubtypeDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesWithEmployeeDataFormatDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmpSugGlobalOutDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeeMailsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionInDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionOutDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubInDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType1;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType2;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType3;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType4;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubType5;
import jp.co.softbrain.esales.employees.service.dto.GetGroupAndDepartmentByEmployeeIdsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupAndDepartmentByEmployeeIdsSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupAndDepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.GetOrganizationDepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.GetOrganizationEmployeeDTO;
import jp.co.softbrain.esales.employees.service.dto.GetOrganizationGroupDTO;
import jp.co.softbrain.esales.employees.service.dto.GetParentDepartmentDTO;
import jp.co.softbrain.esales.employees.service.dto.ImportEmployeesInDTO;
import jp.co.softbrain.esales.employees.service.dto.ImportEmployeesOutDTO;
import jp.co.softbrain.esales.employees.service.dto.ImportEmployeesSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.ImportEmployeesSubType2DTO;
import jp.co.softbrain.esales.employees.service.dto.ImportEmployeesSubType4DTO;
import jp.co.softbrain.esales.employees.service.dto.ImportEmployeesSubType5DTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeInviteModalDTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeLocalMenuOutDTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeLocalMenuSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeManagerModalOutDTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeManagerModalSubType1;
import jp.co.softbrain.esales.employees.service.dto.InitializeManagerModalSubType2;
import jp.co.softbrain.esales.employees.service.dto.InitializeManagerModalSubType4;
import jp.co.softbrain.esales.employees.service.dto.InviteEmployeesInDTO;
import jp.co.softbrain.esales.employees.service.dto.InviteEmployeesOutDTO;
import jp.co.softbrain.esales.employees.service.dto.InviteEmployeesSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.IsExistEmployeeByKeyOutDTO;
import jp.co.softbrain.esales.employees.service.dto.LanguagesDTO;
import jp.co.softbrain.esales.employees.service.dto.LookupDataDTO;
import jp.co.softbrain.esales.employees.service.dto.PackagesDTO;
import jp.co.softbrain.esales.employees.service.dto.PositionsDTO;
import jp.co.softbrain.esales.employees.service.dto.RelationDataDTO;
import jp.co.softbrain.esales.employees.service.dto.SearchConditionsDTO;
import jp.co.softbrain.esales.employees.service.dto.SelectEmployeeElasticsearchInDTO;
import jp.co.softbrain.esales.employees.service.dto.SelectEmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.SendMailForUsersResponseDTO;
import jp.co.softbrain.esales.employees.service.dto.SendMailUserResponseDTO;
import jp.co.softbrain.esales.employees.service.dto.TimezonesDTO;
import jp.co.softbrain.esales.employees.service.dto.UpdateEmployeesInDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsItemResponseDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.FieldInfoPersonalsInputDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.GetCustomFieldsInfoByFieldIdsRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.GetCustomFieldsInfoRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.GetEmployeeSuggestionChoiceResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.GetEmployeeSuggestionsChoiceRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.GetLanguagesResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.GetTimezonesResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.SelectDetailElasticSearchResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.SuggestionsChoiceDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.ValidateResponse;
import jp.co.softbrain.esales.employees.service.dto.schedule.GetBusyEmployeesRequest;
import jp.co.softbrain.esales.employees.service.dto.schedule.GetBusyEmployeesResponse;
import jp.co.softbrain.esales.employees.service.dto.schedule.GetBusyEmployeesSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.tenants.AvailableLicensePackage;
import jp.co.softbrain.esales.employees.service.dto.tenants.CompanyNameResponseDTO;
import jp.co.softbrain.esales.employees.service.dto.tenants.GetAvailableLicenseResponse;
import jp.co.softbrain.esales.employees.service.dto.tenants.GetCompanyNameRequest;
import jp.co.softbrain.esales.employees.service.mapper.CreateUpdateEmployeeMapper;
import jp.co.softbrain.esales.employees.service.mapper.CustomFieldItemMapper;
import jp.co.softbrain.esales.employees.service.mapper.DepartmentPositionIdsMapper;
import jp.co.softbrain.esales.employees.service.mapper.DifferenceSettingGrpcMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmloyeesDTOMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmployeeInfoDTOMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmployeeLayoutMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesDepartmentsMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesHistoriesMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesMapper;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesWithEmployeeDataFormatMapper;
import jp.co.softbrain.esales.employees.service.mapper.ItemReflectGrpcMapper;
import jp.co.softbrain.esales.employees.service.mapper.LookupDataGrpcMapper;
import jp.co.softbrain.esales.employees.service.mapper.RelationDataGrpcMapper;
import jp.co.softbrain.esales.employees.service.mapper.SelectOrganizationDataMapper;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetOrganizationRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.request.UpdateSettingEmployeeRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetEmployeeBasicResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetEmployeeSuggestionsGlobalResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetOrganizationResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.UpdateDisplayFirstScreenResponse;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tms.TransIDHolder;
import jp.co.softbrain.esales.utils.CheckUtil;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.DateUtil;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RelationUtil;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;
import jp.co.softbrain.esales.utils.S3FileUtil;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.BaseFileInfosDTO;
import jp.co.softbrain.esales.utils.dto.FileInfosDTO;
import jp.co.softbrain.esales.utils.dto.FileMappingDTO;
import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.RelationDataInfosInDTO;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import jp.co.softbrain.esales.utils.dto.UpdateRelationDataRequest;
import jp.co.softbrain.esales.utils.dto.UpdateRelationDataResponse;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;

/**
 * Service Implementation for managing {@link Employees}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class EmployeesServiceImpl implements EmployeesService {
    private final Logger log = LoggerFactory.getLogger(EmployeesServiceImpl.class);

    public static final Integer EMPLOYEE_STATUS_DEFAULT = 0;
    public static final String TABLE_ALIAS = "emp";
    private static final String EMPLOYEE_DATA_FIELD_NAME = "employeeData";
    private static final String EMPLOYEE_DEPARTMENTS_FIELD_NAME = "employeeDepartments";
    private static final String EMPLOYEE_INVITE_EMPLOYEE_SURNAME = "employeeSurname";
    private static final String EMPLOYEE_INVITE_EMPLOYEE_NAME = "employeeName";
    private static final String EMPLOYEE_INVITE_EMAIL = "email";
    private static final String EMPLOYEE_POSITONS_FIELD_NAME = "employeePositions";
    private static final String EMPLOYEE_MANAGERS_FIELD_NAME = "employeeManagers";
    private static final String EMPLOYEE_DEPARTMENTS_FIELD_NAME_UPDATE_LIST = "departmentIds";
    public static final String EMPLOYEES = "employees";
    public static final String EMPLOYEE = "employee";
    private static final String DEPARTMENTS_FIELD_NAME = "employee_departments";
    private static final String DEPARTMENTS_AND_POSITION = "department_id and position_id";
    private static final String POSITIONS_FIELD_NAME = "employee_positions";
    private static final String EXCLUSIVE = "error-exclusive";
    private static final String STRING_ARRAY_EMPTY = "[]";
    private static final String COLUMN_NAME_EMAIL = "email";
    private static final String COLUMN_NAME_TELEPHONE_NUMBER = "telephone_number";
    private static final String COLUMN_NAME_CELLPHONE_NUMBER = "cellphone_number";
    private static final String NOT_HAVE_PERMISSION = "User does not have permission.";
    private static final String DUPLICATE_DEPARTMENT_POSITION = "Duplicate departmentId and positionId.";
    private static final String INSERT_DATA_CHANGE_FAILED = "Insert data change failed";

    private static final String INVAIL_PACKAGE_ID_MESSAGE = "invail package id";

    private static final int INCREASE_COUNT = 1;
    private static final int CATEGORIZING_RECORDS_EXIST = 1;
    private static final String FIELD_NAME_CHECK_EXISTS_DEPARTMENTS = "departments";
    private static final String FIELD_NAME_CHECK_EXISTS_POSITIONS = "positions";

    private static final String UPDATED_DATE_FIELD = "updatedDate";

    private static final String VALIDATE_FAIL = "Validate failded.";

    private static final String EMPLOYEE_STATUS = "employeeStatus";

    private static final String CONVERT_DATA_ERROR = "Can not convert data";

    private static final int SUGGESTION_LIMIT = 10;

    private static final String GET_CUSTOM_FIELDS_INFO_API = "get-custom-fields-info";

    private static final String FIRST_ITEM = "first";
    private static final String SECOND_ITEM = "second";

    private static final String TENANT_NAME_PARAM = "tenantName";
    private static final String FOMAT_DATE_YYYY_MM_DD = "yyyy-MM-dd";
    private static final String FOMAT_DATE_MM_DD_YYYY = "MM-dd-yyyy";
    private static final String FOMAT_DATE_DD_MM_YYYY = "dd-MM-yyyy";

    public static final String CHECK_EXIST_EMPLOYEE_ID = "check exist employee Id";
    public static final String CHECK_IS_DISPLAY_FIRST_SCREEN = "check exist isDisplayFirstScreen";
    public static final String EMPLOYEE_ID = "employeeId";
    public static final String IS_DISPLAY_FIRST_SCREEN = "isDisplayFirstScreen";
    public static final String HISTORY_OLD_DATA = "old_data";
    public static final String HISTORY_NEW_DATA = "new_data";

    private enum ImportMode {
        INSERT(0), UPDATE(1), INSERT_AND_UPDATE(2);

        private final int typeImportMode;

        private ImportMode(int typeImportMode) {
            this.typeImportMode = typeImportMode;
        }

        public int getTypeImportMode() {
            return this.typeImportMode;
        }
    }

    @Autowired
    private DepartmentPositionIdsMapper departmentPositionIdsMapper;

    @Autowired
    private EmployeesRepository employeesRepository;

    @Autowired
    private CreateUpdateEmployeeMapper createUpdateEmployeeMapper;

    @Autowired
    private EmployeesRepositoryCustom employeesRepositoryCustom;

    @Autowired
    private DepartmentsRepository departmentsRepository;

    @Autowired
    private EmployeesMapper employeesMapper;

    @Autowired
    private EmployeeLayoutMapper employeeLayoutMapper;

    @Autowired
    private CustomFieldItemMapper customFieldItemMapper;

    @Autowired
    private LookupDataGrpcMapper lookupDataGrpcMapper;

    @Autowired
    private ItemReflectGrpcMapper itemReflectGrpcMapper;

    @Autowired
    private RelationDataGrpcMapper relationDataGrpcMapper;

    @Autowired
    private EmployeeInfoDTOMapper employeeInfoDTOMapper;

    @Autowired
    private DifferenceSettingGrpcMapper differenceSettingGrpcMapper;

    @Autowired
    private EmployeesDepartmentsService employeesDepartmentsService;

    @Autowired
    private EmployeesGroupsRepository employeesGroupsRepository;

    @Autowired
    private EmployeesDepartmentsRepository employeesDepartmentsRepository;

    @Autowired
    private DepartmentsRepositoryCustom departmentsRepositoryCustom;

    @Autowired
    private EmployeesGroupsRepositoryCustom employeesGroupsRepositoryCustom;

    @Autowired
    private EmployeesWithEmployeeDataFormatMapper employeesWithEmployeeDataFormatMapper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private EmployeesCommonService employeesCommonService;

    @Autowired
    private MailService mailService;

    @Autowired
    private EmloyeesDTOMapper emloyeesDTOMapper;

    @Autowired
    private EmployeesHistoriesServiceImpl employeesHistoriesServiceImpl;

    @Autowired
    private EmployeesPackagesService employeesPackagesService;

    @Autowired
    private EmployeesHistoriesRepository employeesHistoriesRepository;

    @Autowired
    private EmployeesHistoriesMapper employeesHistoriesMapper;

    @Autowired
    private EmployeesPackagesRepository employeesPackagesRepository;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private HttpServletRequest servletRequest;

    @Autowired
    private FieldInfoRepository fieldInfoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TmsService tmsService;

    private Gson gson = new Gson();

    private static final String SEARCH_VALUE_PARAM = "searchValue";

    private TypeReference<Map<String, Object>> typeRefMap = new TypeReference<>() {};

    private static final String USER_ID_FIELD_NAME = "userId";

    private static final String EMPLOYEE_LANGUAGE = "languageId";
    private static final String COMMENT_FIELD_NAME = "comment";

    @Autowired
    private SelectOrganizationDataMapper selectOrganizationDataMapper;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private EmployeesDepartmentsMapper employeesDepartmentsMapper;

    @Autowired
    private EmployeesService employeesService;

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.employees.service.EmployeesService#save(jp.co.
     * softbrain.esales.employees.service.dto.EmployeesDTO)
     */
    @Override
    public EmployeesDTO save(EmployeesDTO employeesDTO) {
        if (StringUtil.isEmpty(TransIDHolder.getTransID())) {
            Employees employees = employeesMapper.toEntity(employeesDTO);
            return employeesMapper.toDto(employeesRepository.save(employees));
        } else {
            return tmsService.saveEmployee(employeesDTO, TransIDHolder.getTransID());
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<EmployeesDTO> findAll(Pageable pageable) {
        return employeesRepository.findAll(pageable).map(employeesMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<EmployeesDTO> findOne(Long id) {
        Employees entity = employeesRepository.findByEmployeeId(id);
        if (entity != null) {
            return Optional.of(entity).map(employeesMapper::toDto);
        }
        return Optional.empty();
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        employeesRepository.deleteById(id);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getTotalEmployees(jp.co.softbrain.esales.employees.service.dto.SearchConditionsDTO)
     */
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Long getTotalEmployees(SearchConditionsDTO searchConditions, String languageCode) {
        if (StringUtils.isEmpty(languageCode)) {
            languageCode = jwtTokenUtil.getLanguageCodeFromToken();
        }
        searchConditions.setLanguageCode(languageCode);
        return employeesRepositoryCustom.getTotalEmployees(searchConditions);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getEmployees(jp.co.softbrain.esales.employees.service.dto.SearchConditionsDTO,
     *      java.lang.String)
     */
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeeInfoDTO> getEmployees(SearchConditionsDTO searchConditions, Boolean isFetchId,
            String languageCode) {
        if (StringUtils.isEmpty(languageCode)) {
            languageCode = jwtTokenUtil.getLanguageCodeFromToken();
        }

        searchConditions.setLanguageCode(languageCode);
        List<SelectEmployeesDTO> employees = employeesRepositoryCustom.getEmployees(searchConditions);

        List<EmployeeInfoDTO> response = new ArrayList<>();
        if (employees == null || employees.isEmpty()) {
            return response;
        }

        // fetch employeeId only
        if (Boolean.TRUE.equals(isFetchId)) {
            employees.forEach(employee -> {
                EmployeeInfoDTO employeeInfoDTO = new EmployeeInfoDTO();
                employeeInfoDTO.setEmployeeId(employee.getEmployeeId());
                response.add(employeeInfoDTO);
            });
            return response;
        }

        String token = SecurityUtils.getTokenValue().orElse(null);
        // Call api getLanguages
        GetLanguagesResponse responseLanguage = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_GET_LANGUAGE, HttpMethod.POST, null, GetLanguagesResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        Map<Long, LanguagesDTO> languageMap = new HashMap<>();
        if (responseLanguage != null) {
            responseLanguage.getLanguagesDTOList()
                    .forEach(language -> languageMap.put(language.getLanguageId(), language));
        }

        // Call API getTimezones
        GetTimezonesResponse responseTimezone = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_GET_TIMEZONES, HttpMethod.POST, null, GetTimezonesResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        Map<Long, TimezonesDTO> timezoneMap = new HashMap<>();
        if (responseTimezone != null) {
            responseTimezone.getTimezones().forEach(timezone -> timezoneMap.put(timezone.getTimezoneId(), timezone));
        }
        List<CustomFieldsInfoOutDTO> fieldsList = null;

        GetCustomFieldsInfoRequest request = new GetCustomFieldsInfoRequest();
        request.setFieldBelong(FieldBelongEnum.EMPLOYEE.getCode());
        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_GET_CUSTOM_FIELD_INFO, HttpMethod.POST, request,
                CommonFieldInfoResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        if (fieldInfoResponse != null) {
            fieldsList = fieldInfoResponse.getCustomFieldsInfo();
        }

        final List<CustomFieldsInfoOutDTO> finalFieldsList = fieldsList;

        employees.forEach(employee -> {
            EmployeeInfoDTO employeeInfoDTO = employeeInfoDTOMapper.toEmployeeInfoDTO(employee);

            EmployeeIconDTO employeeIcon = new EmployeeIconDTO();
            employeeIcon.setFileName(employee.getPhotoFileName());
            employeeIcon.setFilePath(employee.getPhotoFilePath());
            if (StringUtils.isNotBlank(employee.getPhotoFilePath())) {
                employeeIcon
                        .setFileUrl(S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(),
                                employee.getPhotoFilePath(), applicationProperties.getExpiredSeconds()));
            }
            employeeInfoDTO.setEmployeeIcon(employeeIcon);

            // convert employee_departments
            List<DepartmentPositionDTO> departmentPositionList = employeesRepositoryCustom.findDepartmentByEmployeeId(
                    Arrays.asList(employee.getEmployeeId()), null);
            String language = jwtTokenUtil.getLanguageCodeFromToken();
            for (DepartmentPositionDTO empDeps : departmentPositionList) {
                empDeps.setEmployeeFullName(
                        StringUtil.getFullName(empDeps.getEmployeeSurName(), empDeps.getEmployeeName()));
                empDeps.setPositionName(
                    StringUtil.getFieldLabel(empDeps.getPositionName(), language, objectMapper, typeRefMap));
                if (StringUtils.isNotBlank(empDeps.getPhotoFileUrl())) {
                    empDeps.setPhotoFileUrl(S3CloudStorageClient
                        .generatePresignedURL(applicationProperties.getUploadBucket(), empDeps.getPhotoFileUrl(),
                            applicationProperties.getExpiredSeconds()));
                }
            }
            // 4. Get info parent department
            if (departmentPositionList != null && !departmentPositionList.isEmpty()) {
                List<Long> departmentIds = departmentPositionList.stream().map(DepartmentPositionDTO::getDepartmentId)
                        .collect(Collectors.toList());
                List<GetParentDepartmentDTO> listParent = employeesCommonService.getParentDepartment(departmentIds);
                if (!CollectionUtils.isEmpty(listParent)) {
                    Map<Long, GetParentDepartmentDTO> listParentMap = listParent.stream()
                            .collect(Collectors.toMap(GetParentDepartmentDTO::getDepartmentId, Function.identity()));
                    departmentPositionList.forEach(
                            dep -> dep.setPathTreeName(listParentMap.get(dep.getDepartmentId()).getPathTreeName()));
                }
            }
            employeeInfoDTO.setEmployeeDepartments(departmentPositionList);

            // convert employee_groups
            List<EmployeesGroupNameDTO> employeesGroupNameList = employeesGroupsRepository
                    .findGroupWithEmployeeId(employee.getEmployeeId());
            employeeInfoDTO.setEmployeeGroups(employeesGroupNameList);

            // convert employee_subordinates
            List<EmployeeFullNameDTO> employeeSubordinateList = employeesRepository
                .findStaffWithManagerId(employee.getEmployeeId()).stream().map(emp -> {
                    emp.setEmployeeFullName(StringUtil.getFullName(emp.getEmployeeSurname(), emp.getEmployeeName()));
                    if (StringUtils.isNotBlank(emp.getPhotoFileUrl())) {
                        emp.setPhotoFileUrl(S3CloudStorageClient
                            .generatePresignedURL(applicationProperties.getUploadBucket(), emp.getPhotoFileUrl(),
                                applicationProperties.getExpiredSeconds()));
                    }
                    return emp;
                }).collect(Collectors.toList());
            employeeInfoDTO.setEmployeeSubordinates(employeeSubordinateList);

            // get package for employee
            List<Long> employeeIds = new ArrayList<>();
            employeeIds.add(employeeInfoDTO.getEmployeeId());
            List<EmployeesPackagesSubtypeDTO> listPackage = employeesRepositoryCustom
                .findPackagesByEmployeeId(employeeIds);
            employeeInfoDTO.setEmployeePackages(listPackage);

            // update data for dynamic field
            if (StringUtils.isNotEmpty(employee.getEmployeeData())) {
                try {
                    List<EmployeesDataDTO> employeeDataList = UtilsEmployees.convertEmployeeDataFromString(objectMapper,
                            employee.getEmployeeData(), null, finalFieldsList);

                    employeeDataList.forEach(data -> {
                        if (Integer.valueOf(FieldTypeEnum.FILE.getCode()).equals(data.getFieldType())) {
                            try {
                                data.setValue(objectMapper.writeValueAsString(S3FileUtil.insertFileUrl(data.getValue(),
                                        objectMapper, applicationProperties.getUploadBucket(),
                                        applicationProperties.getExpiredSeconds())));
                            } catch (JsonProcessingException e) {
                                throw new CustomException(CONVERT_DATA_ERROR, e);
                            }
                        }
                    });
                    employeeInfoDTO.setEmployeeData(employeeDataList);
                } catch (IOException e) {
                    log.warn(e.getLocalizedMessage());
                }
            }
            employeeInfoDTO.setLanguage(languageMap.get(employee.getLanguageId()));
            employeeInfoDTO.setTimezone(timezoneMap.get(employee.getTimezoneId()));

            response.add(employeeInfoDTO);
        });

        return response;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#
     * toEmployeesWithEmployeeDataFormat(java.util.List)
     */
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesWithEmployeeDataFormatDTO> toEmployeesWithEmployeeDataFormat(List<EmployeesDTO> employees,
            Boolean isNeedFieldType) {
        List<EmployeesWithEmployeeDataFormatDTO> response = new ArrayList<>();
        if (employees != null && !employees.isEmpty()) {
            List<CustomFieldsInfoOutDTO> fieldsList = null;
            if (Boolean.TRUE.equals(isNeedFieldType)) {
                GetCustomFieldsInfoRequest request = new GetCustomFieldsInfoRequest();
                request.setFieldBelong(FieldBelongEnum.EMPLOYEE.getCode());
                String token = SecurityUtils.getTokenValue().orElse(null);
                CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(
                        Constants.PathEnum.COMMONS, ConstantsEmployees.URL_API_GET_CUSTOM_FIELD_INFO, HttpMethod.POST,
                        request, CommonFieldInfoResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
                if (fieldInfoResponse != null) {
                    fieldsList = fieldInfoResponse.getCustomFieldsInfo();
                }
            }
            response = convertEmployeeData(employees, fieldsList);
        }
        return response;
    }

    /**
     * Convert employeesDTO object to object with employees Data with field type
     * format
     *
     * @param employees List of employeesDTO need to convert
     * @param fieldsList list of employees fields
     * @return list of object converted
     */
    private List<EmployeesWithEmployeeDataFormatDTO> convertEmployeeData(List<EmployeesDTO> employees,
            List<CustomFieldsInfoOutDTO> fieldsList) {
        List<EmployeesWithEmployeeDataFormatDTO> convertedList = new ArrayList<>();
        final List<CustomFieldsInfoOutDTO> finalfieldsList = fieldsList;
        employees.forEach(employee -> {
            EmployeesWithEmployeeDataFormatDTO emp = employeesWithEmployeeDataFormatMapper
                    .toEmployeesWithEmployeeDataFormat(employee);
            if (emp.getPhotoFilePath() != null && StringUtils.isNotBlank(emp.getPhotoFilePath())) {
                emp.setPhotoFileUrl(S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(),
                        emp.getPhotoFilePath(), applicationProperties.getExpiredSeconds()));
            }
            Optional.ofNullable(employee.getEmployeeData()).ifPresent(employeeData -> {
                ObjectMapper mapper = new ObjectMapper();
                TypeReference<Map<String, Object>> typeRef = new TypeReference<Map<String, Object>>() {};
                Map<String, Object> empData = new HashMap<>();
                try {
                    empData = mapper.readValue(employeeData, typeRef);
                } catch (IOException e) {
                    log.error("Error when read employeeData: ", e);
                }
                empData.forEach((key, value) -> {
                    EmployeesDataDTO dataField = new EmployeesDataDTO();
                    dataField.setKey(key);
                    Optional.ofNullable(value).ifPresent(val -> {
                        if (val instanceof Map || val instanceof List) {
                            try {
                                dataField.setValue(objectMapper.writeValueAsString(val));
                            } catch (JsonProcessingException e) {
                                log.error(e.getLocalizedMessage());
                            }
                        } else {
                            dataField.setValue(String.valueOf(val));
                        }
                    });
                    if (finalfieldsList != null && !finalfieldsList.isEmpty()) {
                        for (CustomFieldsInfoOutDTO fields : finalfieldsList) {
                            if (key.equals(fields.getFieldName())) {
                                dataField.setFieldType(fields.getFieldType());
                                break;
                            }
                        }
                    }
                    emp.getEmployeeData().add(dataField);
                });
            });
            convertedList.add(emp);
        });
        return convertedList;
    }

    /**
     * /*
     * (non-Javadoc)
     *
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getEmployeeRelations(java.lang.String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public EmployeeRelationsDTO getEmployeeRelations(String langCode) {
        // 2. check User's authority

        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException(NOT_HAVE_PERMISSION,
                    CommonUtils.putError(ConstantsEmployees.EMPLOYEE_CAPTION, Constants.USER_NOT_PERMISSION));
        }

        EmployeeRelationsDTO outDto = new EmployeeRelationsDTO();

        // 3. Get departments
        List<DepartmentsDTO> departmentList = employeesCommonService.getDepartments();
        // build department children
        List<DepartmentsDTO> departmentTree = buildDepartmentTree(departmentList);
        outDto.setDepartments(departmentTree);

        // 4. Get positions
        List<PositionsDTO> listPositions = employeesCommonService.getPositions();
        outDto.setPositions(listPositions);

        // 5. Get languages
        GetLanguagesResponse languageResponse = new GetLanguagesResponse();
        try {
            String token = SecurityUtils.getTokenValue().orElse(null);
            languageResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsEmployees.URL_API_GET_LANGUAGE, HttpMethod.POST, null, GetLanguagesResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        List<LanguagesDTO> languages = new ArrayList<>();
        if (languageResponse.getLanguagesDTOList() != null) {
            for (LanguagesDTO language : languageResponse.getLanguagesDTOList()) {
                LanguagesDTO dto = new LanguagesDTO();
                dto.setLanguageId(language.getLanguageId());
                dto.setLanguageName(language.getLanguageName());
                dto.setLanguageCode(language.getLanguageCode());
                dto.setDisplayOrder(language.getDisplayOrder() == null ? null
                        : Integer.valueOf(language.getDisplayOrder().toString()));
                dto.setCreatedDate(language.getCreatedDate());
                dto.setCreatedUser(language.getCreatedUser());
                dto.setUpdatedDate(language.getUpdatedDate());
                dto.setUpdatedUser(language.getUpdatedUser());
                languages.add(dto);
            }
        }
        outDto.setLanguages(languages);

        // 6. Get timeszones
        GetTimezonesResponse timezoneResponse = new GetTimezonesResponse();
        try {
            String token = SecurityUtils.getTokenValue().orElse(null);
            timezoneResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsEmployees.URL_API_GET_TIMEZONES, HttpMethod.POST, null, GetTimezonesResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        List<TimezonesDTO> timezones = new ArrayList<>();
        if (timezoneResponse.getTimezones() != null) {
            for (TimezonesDTO timezone : timezoneResponse.getTimezones()) {
                TimezonesDTO dto = new TimezonesDTO();
                dto.setTimezoneId(timezone.getTimezoneId());
                dto.setTimezoneShortName(timezone.getTimezoneShortName());
                dto.setTimezoneName(timezone.getTimezoneName());
                dto.setDisplayOrder(timezone.getDisplayOrder() == null ? null
                        : Integer.valueOf(timezone.getDisplayOrder().toString()));
                dto.setCreatedDate(timezone.getCreatedDate());
                dto.setCreatedUser(timezone.getCreatedUser());
                dto.setUpdatedDate(timezone.getUpdatedDate());
                dto.setUpdatedUser(timezone.getUpdatedUser());
                timezones.add(dto);
            }
        }
        outDto.setTimezones(timezones);
        return outDto;
    }

    /**
     * Build department tree from flat list
     *
     * @param departmentList
     * @return
     */
    private List<DepartmentsDTO> buildDepartmentTree(List<DepartmentsDTO> departmentList) {

        if (departmentList == null || departmentList.isEmpty()) {
            return departmentList;
        }
        Map<Long, DepartmentsDTO> departmentMap = new HashMap<>();
        for (DepartmentsDTO dto : departmentList) {
            departmentMap.put(dto.getDepartmentId(), dto);
        }
        List<DepartmentsDTO> departmentTree = new ArrayList<>();
        for (DepartmentsDTO dto : departmentList) {
            if (dto.getParentId() != null) {
                DepartmentsDTO pDto = departmentMap.get(dto.getParentId());
                if (pDto != null) {
                    List<DepartmentsDTO> childList = pDto.getDepartmentChild();
                    if (childList == null) {
                        childList = new ArrayList<>();
                    }
                    childList.add(dto);
                    pDto.setDepartmentChild(childList);
                } else {
                    departmentTree.add(dto);
                }
            } else {
                departmentTree.add(dto);
            }
        }
        return departmentTree;
    }

    /**
     * @throws JsonProcessingException
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#updateEmployees(java.util.List)
     */
    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public List<Long> updateEmployees(List<UpdateEmployeesInDTO> employees, List<FileMappingDTO> files)
            throws IOException {
        // 0. Get employeeId from token
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();

        // 0.1 get-date format
        String formatDate = getFormatDate();

        // 1. Validate parameters
        validateParameter(employees, formatDate);
        // 2. check User's authority
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException(NOT_HAVE_PERMISSION,
                    CommonUtils.putError(EMPLOYEES, Constants.USER_NOT_PERMISSION));
        }

        // 3. check duplicate email
        int indextEmployee = 0;
        List<Map<String, Object>> errors = new ArrayList<>();
        for (UpdateEmployeesInDTO employee : employees) {
            String emailCheckExist = employee.getEmail();
            if (!StringUtil.isNull(emailCheckExist)) {
                int numEmail = employeesRepository.checkExistedEmail(emailCheckExist, employee.getEmployeeId());
                if (numEmail > 0) {
                    Map<String, Object> item = new HashMap<>();
                    item.put(Constants.ROW_ID, indextEmployee);
                    item.put(Constants.ERROR_ITEM, ConstantsEmployees.EMAIL);
                    item.put(Constants.ERROR_CODE, ConstantsEmployees.EXIST_EMAIL_ERROR);
                    item.put(ConstantsEmployees.EMAIL, emailCheckExist);
                    errors.add(item);
                }
            }
            indextEmployee++;
        }
        if (!errors.isEmpty()) {
            throw new CustomRestException(VALIDATE_FAIL, errors);
        }

        List<Long> rtnUpdateEmpId = new ArrayList<>();
        Map<Long, Map<String, List<FileInfosDTO>>> uploadData = S3FileUtil.uploadDataFile(employeeId, files,
                jwtTokenUtil.getTenantIdFromToken(), applicationProperties.getUploadBucket(), FieldBelongEnum.EMPLOYEE);
        Map<Long, Map<String, Object>> contentChangeMap = new HashMap<>();
        List<Long> changeNameEmpIds = new ArrayList<>();
        Map<Long, String> emailMap = new HashMap<>();

        // get available license package
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        MultiValueMap<String, String> getAvailableLicenseParams = new LinkedMultiValueMap<>();
        getAvailableLicenseParams.add(TENANT_NAME_PARAM, tenantName);
        GetAvailableLicenseResponse getLicenseRes = restOperationUtils.executeCallGetPublicApi(
                Constants.PathEnum.TENANTS, ConstantsEmployees.URL_API_GET_AVAILABLE_LICENSE, getAvailableLicenseParams,
                tenantName, GetAvailableLicenseResponse.class);

        // checkInvalidPackage
        Map<Long, AvailableLicensePackage> packagesMap = null;
        if (getLicenseRes.getData() != null) {
            packagesMap = getLicenseRes.getData().getPackages().stream().collect(Collectors.toMap(
                    AvailableLicensePackage::getPackageId, packages -> packages, (package1, package2) -> package1));
        }
        final Map<Long, AvailableLicensePackage> packagesMapCheckFinal = packagesMap;

        employees.forEach(emp -> {
            // update employee package
            List<Long> employeePackageIds = emp.getPackagesId();
            if (employeePackageIds != null && !employeePackageIds.isEmpty()) {
                List<EmployeesPackageSumIdsDTO> empPackageIdList = employeesPackagesService
                        .getSumEmployeePackageByIds(employeePackageIds);
                Map<Long, Integer> mapCountPackageId = new HashMap<>();
                if (!CollectionUtils.isEmpty(empPackageIdList)) {
                    empPackageIdList.forEach(pack -> mapCountPackageId.put(pack.getPackageId(),
                            Math.toIntExact(pack.getCountPackageId())));
                }
                List<String> itemName = new ArrayList<>();
                List<Long> errorPackIds = new ArrayList<>();
                employeePackageIds.forEach(empPackageId -> {
                    Integer countPackageId = mapCountPackageId.get(empPackageId) != null
                            ? mapCountPackageId.get(empPackageId)
                            : 0;
                    if (countPackageId >= packagesMapCheckFinal.get(empPackageId).getAvailablePackageNumber()) {
                        itemName.add(packagesMapCheckFinal.get(empPackageId).getPackageName());
                        errorPackIds.add(empPackageId);
                    }
                });
                if (!CollectionUtils.isEmpty(errorPackIds)) {
                    Map<String, Object> item = new HashMap<>();
                    item.put(Constants.ROW_ID, emp.getEmployeeId());
                    item.put(Constants.ERROR_ITEM, ConstantsEmployees.EMPLOYEE_PACKAGES);
                    item.put(Constants.ERROR_CODE, ConstantsEmployees.INVAIL_PACKAGE_ID);
                    item.put("itemName", itemName);
                    item.put("packagesId", errorPackIds);
                    errors.add(item);
                }
            }
        });
        if (!errors.isEmpty()) {
            throw new CustomRestException(VALIDATE_FAIL, errors);
        }

        for (UpdateEmployeesInDTO employee : employees) {
            // 5. Insert department
            if (!CollectionUtils.isEmpty(employee.getDepartmentIds())) {
                insertDeparment(employeeId, employee);
            }
            // 6. Update employees
            // employeesRepository.findByEmployeeId(employeeId)
            Employees empEntity = employeesRepository.findByEmployeeId(employee.getEmployeeId());
            if (empEntity != null) {
                // 6.1. Check change name
                boolean isSameSurName = checkSameName(empEntity.getEmployeeSurname(), employee.getEmployeeSurname());
                if (!isSameSurName || !checkSameName(empEntity.getEmployeeName(), employee.getEmployeeName())) {
                    changeNameEmpIds.add(employee.getEmployeeId());
                }
                Map<String, Object> contentChange = new HashMap<>();
                EmployeesDTO empDto = employeesMapper.toDto(empEntity);
                getContentChange(empDto, employee, contentChange, uploadData, formatDate);
                empDto.setUpdatedUser(employeeId);
                EmployeesHistoriesDTO employeesHistoriesDTO = emloyeesDTOMapper.toDto(empDto);
                employeesHistoriesDTO.setContentChange(objectMapper.writeValueAsString(contentChange));
                this.save(empDto);

                // add to map for update cognito user
                emailMap.put(employee.getEmployeeId(), empEntity.getEmail());
                contentChangeMap.put(employee.getEmployeeId(), contentChange);

                employeesHistoriesServiceImpl.save(employeesHistoriesDTO);

                // update employee package
                if (getLicenseRes.getData() != null) {
                    final Map<Long, AvailableLicensePackage> packagesMapFinal = getLicenseRes.getData().getPackages()
                            .stream().collect(Collectors.toMap(AvailableLicensePackage::getPackageId,
                                    packages -> packages, (package1, package2) -> package1));
                    // Check lisence of packet
                    List<Long> employeePackageIds = employee.getPackagesId();
                    if (employeePackageIds != null && !employeePackageIds.isEmpty()) {
                        List<EmployeesPackageSumIdsDTO> empPackageIdList = employeesPackagesService
                                .getSumEmployeePackageByIds(employeePackageIds);
                        Map<Long, Integer> mapCountPackageId = new HashMap<>();
                        if (!CollectionUtils.isEmpty(empPackageIdList)) {
                            empPackageIdList.forEach(pack -> mapCountPackageId.put(pack.getPackageId(),
                                    Math.toIntExact(pack.getCountPackageId())));
                        }
                        // delete old employee packages
                        employeesPackagesRepository.deleteByEmployeeId(employee.getEmployeeId());
                        employeePackageIds.stream().filter(packagesMap::containsKey)
                                .forEach(empPackageId -> insertEmployeePackagesUpdateEmployees(mapCountPackageId,
                                        packagesMapFinal, empDto.getEmployeeId(), employeeId, empPackageId));
                    }
                }
                rtnUpdateEmpId.add(empDto.getEmployeeId());
            } else {
                log.warn("[UpdateEmployees] Record not found [{}]", employee.getEmployeeId());
            }

        }

        // update employee_package

        List<TimezonesDTO> timezones = getTimezones();
        List<LanguagesDTO> languages = getLanguages();

        // Create Cognito user
        Map<String, String> changeObj;
        for (Map.Entry<Long, Map<String, Object>> contentChange : contentChangeMap.entrySet()) {
            if (contentChange.getValue() != null || contentChange.getValue().isEmpty()) {
                continue;
            }
            CognitoUserInfo cognitoUser = new CognitoUserInfo();
            boolean hasChange = false;
            cognitoUser.setEmployeeId(contentChange.getKey());
            cognitoUser.setUsername(emailMap.get(contentChange.getKey()));

            if (contentChange.getValue().get(ConstantsEmployees.COLUMN_NAME_EMAIL) != null) {
                changeObj = (Map<String, String>) contentChange.getValue().get(ConstantsEmployees.COLUMN_NAME_EMAIL);
                cognitoUser.setEmail(changeObj.get(ConstantsEmployees.NEW_VALUE));
                hasChange = true;
            }
            if (contentChange.getValue().get(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME) != null) {
                changeObj = (Map<String, String>) contentChange.getValue()
                        .get(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME);
                cognitoUser.setEmployeeSurname(changeObj.get(ConstantsEmployees.NEW_VALUE));
                hasChange = true;
            }
            if (contentChange.getValue().get(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME) != null) {
                changeObj = (Map<String, String>) contentChange.getValue()
                        .get(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME);
                cognitoUser.setEmployeeName(changeObj.get(ConstantsEmployees.NEW_VALUE));
                hasChange = true;
            }
            if (contentChange.getValue().get(ConstantsEmployees.COLUMN_NAME_FORMAT_DATE_ID) != null) {
                changeObj = (Map<String, String>) contentChange.getValue()
                        .get(ConstantsEmployees.COLUMN_NAME_FORMAT_DATE_ID);

                // 1 : 2001-01-31, 2 : 01-31-2001, 3 : 31-01-2001
                switch (Integer.valueOf(changeObj.get(ConstantsEmployees.NEW_VALUE))) {
                case 1:
                    cognitoUser.setFormatDate(FOMAT_DATE_YYYY_MM_DD);
                    break;
                case 2:
                    cognitoUser.setFormatDate(FOMAT_DATE_MM_DD_YYYY);
                    break;
                case 3:
                    cognitoUser.setFormatDate(FOMAT_DATE_DD_MM_YYYY);
                    break;
                default:
                    cognitoUser.setFormatDate(FOMAT_DATE_YYYY_MM_DD);
                    break;
                }
                hasChange = true;
            }
            if (contentChange.getValue().get(ConstantsEmployees.COLUMN_NAME_TIMEZONE_ID) != null) {
                changeObj = (Map<String, String>) contentChange.getValue()
                        .get(ConstantsEmployees.COLUMN_NAME_TIMEZONE_ID);
                String timezoneIdStr = changeObj.getOrDefault(ConstantsEmployees.NEW_VALUE, "0");
                Long timezoneId = Long.valueOf(timezoneIdStr);

                timezones.forEach(timezone -> {
                    if (timezone.getTimezoneId().equals(timezoneId)) {
                        cognitoUser.setTimezoneName(timezone.getTimezoneShortName());
                    }
                });
                if (StringUtils.isNotBlank(cognitoUser.getTimezoneName())) {
                    hasChange = true;
                }
            }
            if (contentChange.getValue().get(ConstantsEmployees.COLUMN_NAME_LANGUAGE_ID) != null) {
                changeObj = (Map<String, String>) contentChange.getValue()
                        .get(ConstantsEmployees.COLUMN_NAME_LANGUAGE_ID);
                String langId = changeObj.getOrDefault(ConstantsEmployees.NEW_VALUE, "0");
                Long languageId = Long.valueOf(langId);

                languages.forEach(language -> {
                    if (language.getLanguageId().equals(languageId)) {
                        cognitoUser.setLanguageCode(language.getLanguageCode());
                    }
                });
                if (StringUtils.isNotBlank(cognitoUser.getLanguageCode())) {
                    hasChange = true;
                }
            }

            if (hasChange) {
                cognitoUser.setIsModifyEmployee(true);
                authenticationService.updateUserAttributes(cognitoUser, null);
            }
        }

        // 8. request create data for ElasticSearch
        if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(rtnUpdateEmpId, null, null,
                Constants.ChangeAction.UPDATE.getValue()))) {
            throw new CustomRestException(INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        return rtnUpdateEmpId;
    }

    /**
     * validate parameters
     *
     * @param employees - list employee will update
     */
    private void validateParameter(List<UpdateEmployeesInDTO> employees, String formatDate) {
        // a. Validate local
        if (employees == null || employees.isEmpty()) {
            throw new CustomRestException("Param [employees] is null.",
                    CommonUtils.putError(EMPLOYEES, Constants.RIQUIRED_CODE));
        }
        // b. Validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        // create List<Map> customParams
        List<Map<String, Object>> customParams = new ArrayList<>();
        employees.forEach(employee -> {

            Map<String, Object> customField = new HashMap<>();
            customField.put("rowId", employee.getEmployeeId());

            if (employee.getLanguageId() != null) {
                customField.put(EMPLOYEE_LANGUAGE, employee.getLanguageId());
            }

            customField.putAll(jsonBuilder
                    .convertObjectExcludeFields(employee,
                            Arrays.asList(EMPLOYEE_DATA_FIELD_NAME, EMPLOYEE_DEPARTMENTS_FIELD_NAME_UPDATE_LIST,
                                    EMPLOYEE_LANGUAGE))
                    .entrySet().stream().filter(entry -> entry.getValue() != null)
                    .collect(Collectors.toMap(Entry::getKey, Entry::getValue)));
            customField.putAll(jsonBuilder.convertKeyValueList(employee.getEmployeeData()));

            // Validate department: null-case is field does not exists,
            // empty-validate required.
            if (employee.getDepartmentIds() != null) {
                getDataDepartmentForValidate(customField, employee.getDepartmentIds());
            }
            customParams.add(customField);
        });
        String validateJson = jsonBuilder.build(FieldBelong.EMPLOYEE.getValue(), null, customParams, formatDate);
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(VALIDATE_FAIL, response.getErrors());
        }
    }

    /**
     * get Data department For Validate
     *
     * @param customField data for validate
     * @param listDepartmentPositionIds list department data
     */
    private void getDataDepartmentForValidate(Map<String, Object> customField,
            List<DepartmentPositionIdsDTO> listDepartmentPositionIds) {
        List<Long> employeeDepartments = new ArrayList<>();
        List<Integer> employeePositions = new ArrayList<>();
        List<Long> employeeManagers = new ArrayList<>();
        if (listDepartmentPositionIds != null && !listDepartmentPositionIds.isEmpty()) {
            for (DepartmentPositionIdsDTO data : listDepartmentPositionIds) {
                if (data != null) {
                    if (data.getDepartmentId() != null && data.getDepartmentId() > 0) {
                        employeeDepartments.add(data.getDepartmentId());
                    }
                    if (data.getPositionId() != null && data.getPositionId() > 0) {
                        employeePositions.add(data.getPositionId());
                    }
                    if (data.getManagerId() != null && data.getManagerId() > 0) {
                        employeeManagers.add(data.getManagerId());
                    }
                }
            }
        }
        customField.put(EMPLOYEE_DEPARTMENTS_FIELD_NAME, employeeDepartments);
        customField.put(EMPLOYEE_POSITONS_FIELD_NAME, employeePositions);
        customField.put(EMPLOYEE_MANAGERS_FIELD_NAME, employeeManagers);
    }

    /**
     * Insert related parts array
     *
     * @param employeeId - id user login
     * @param employee - employee information will update
     */
    private void insertDeparment(Long employeeId, UpdateEmployeesInDTO employee) {
        List<EmployeesDepartments> existedEmpDep = employeesDepartmentsRepository
                .findByEmployeeId(employee.getEmployeeId());

        List<DepartmentPositionIdsDTO> depPosIdsParam = employee.getDepartmentIds();
        List<Long> newDepartmentIds;

        List<EmployeesDepartments> listEmpDepDelete = new ArrayList<>();
        List<EmployeesDepartments> listEmpDepUpdate = new ArrayList<>();
        List<EmployeesDepartments> listEmpDepCreate = new ArrayList<>();
        for (EmployeesDepartments oldEmpDep : existedEmpDep) {
            newDepartmentIds = depPosIdsParam.stream().map(DepartmentPositionIdsDTO::getDepartmentId)
                    .collect(Collectors.toList());
            // build list employees_departments to delete
            if (!newDepartmentIds.contains(oldEmpDep.getDepartmentId())) {
                listEmpDepDelete.add(oldEmpDep);
            }
            // build list employees_departments to update
            else {
                depPosIdsParam.stream()
                        .filter(newDepPos -> newDepPos.getDepartmentId().equals(oldEmpDep.getDepartmentId()))
                        .findFirst().ifPresent(newEmpDep -> {
                            EmployeesDepartmentsDTO updateDTO = employeesDepartmentsMapper.toDto(oldEmpDep);
                            updateDTO.setPositionId(newEmpDep.getPositionId() == null ? null
                                    : Long.valueOf(newEmpDep.getPositionId().toString()));
                            listEmpDepUpdate.add(employeesDepartmentsMapper.toEntity(updateDTO));
                            depPosIdsParam.remove(newEmpDep);
                        });
            }
        }

        for (DepartmentPositionIdsDTO depPosIdParam : depPosIdsParam) {
            // build list employees_departments to create
            EmployeesDepartmentsDTO employeesDepartments = departmentPositionIdsMapper.toDto(depPosIdParam);
            employeesDepartments.setEmployeeId(employee.getEmployeeId());
            employeesDepartments.setCreatedUser(employeeId);
            employeesDepartments.setUpdatedUser(employeeId);
            listEmpDepCreate.add(employeesDepartmentsMapper.toEntity(employeesDepartments));
        }

        employeesDepartmentsRepository.deleteAll(listEmpDepDelete);
        employeesDepartmentsRepository.saveAll(listEmpDepUpdate);
        employeesDepartmentsRepository.saveAll(listEmpDepCreate);
    }

    /**
     * create content change to insert in table history
     *
     * @param empDto - employee in DB
     * @param employee - employee information will update
     * @param contentChange - content change
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     */
    private void getContentChange(EmployeesDTO empDto, UpdateEmployeesInDTO employee, Map<String, Object> contentChange,
            Map<Long, Map<String, List<FileInfosDTO>>> uploadData, String formatDate) throws IOException {
        if (employee.getEmployeeSurname() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME, empDto.getEmployeeSurname(),
                    employee.getEmployeeSurname());
            empDto.setEmployeeSurname(employee.getEmployeeSurname());
        }
        if (employee.getEmployeeName() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME, empDto.getEmployeeName(),
                    employee.getEmployeeName());
            empDto.setEmployeeName(employee.getEmployeeName());
        }
        if (employee.getEmployeeSurnameKana() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME_KANA,
                    empDto.getEmployeeSurnameKana(), employee.getEmployeeSurnameKana());
            empDto.setEmployeeSurnameKana(employee.getEmployeeSurnameKana());
        }
        if (employee.getEmployeeNameKana() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME_KANA,
                    empDto.getEmployeeNameKana(), employee.getEmployeeNameKana());
            empDto.setEmployeeNameKana(employee.getEmployeeNameKana());
        }
        if (employee.getEmail() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMAIL, empDto.getEmail(), employee.getEmail());
            empDto.setEmail(employee.getEmail());
        }
        if (employee.getTelephoneNumber() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_TELEPHONE_NUMBER, empDto.getTelephoneNumber(),
                    employee.getTelephoneNumber());
            empDto.setTelephoneNumber(employee.getTelephoneNumber());
        }
        if (employee.getCellphoneNumber() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_CELLPHONE_NUMBER, empDto.getCellphoneNumber(),
                    employee.getCellphoneNumber());
            empDto.setCellphoneNumber(employee.getCellphoneNumber());
        }
        if (employee.getUserId() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_USER_ID, empDto.getUserId(),
                    employee.getUserId());
            empDto.setUserId(employee.getUserId());
        }
        if (employee.getLanguageId() != null) {
            String oldLanguagueId = empDto.getLanguageId() != null ? empDto.getLanguageId().toString() : "";
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_LANGUAGE_ID, oldLanguagueId,
                    employee.getLanguageId().toString());
            empDto.setLanguageId(employee.getLanguageId());
        }
        if (employee.getTimezoneId() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_TIMEZONE_ID, empDto.getTimezoneId().toString(),
                    employee.getTimezoneId().toString());
            empDto.setTimezoneId(employee.getTimezoneId());
        }
        if (employee.getFormatDateId() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_FORMAT_DATE_ID,
                    empDto.getFormatDateId().toString(), employee.getFormatDateId().toString());
            empDto.setFormatDateId(employee.getFormatDateId());
        }
        List<EmployeeDataType> listEmployeeData = employee.getEmployeeData();
        Map<String, List<FileInfosDTO>> employeeNewFile = uploadData.get(empDto.getEmployeeId());

        if (employee.getEmployeeIcon() != null) {
            FileInfosDTO employeeIcon = processEmployeeIcon(employeeNewFile, employee.getEmployeeIcon());
            if (employeeIcon != null) {
                setOldNewData(contentChange, ConstantsEmployees.FIELD_NAME_EMPLOYEE_ICON, empDto.getPhotoFileName(),
                        employeeIcon.getFileName());
                empDto.setPhotoFileName(employeeIcon.getFileName());
                empDto.setPhotoFilePath(employeeIcon.getFilePath());
            } else {
                setOldNewData(contentChange, ConstantsEmployees.FIELD_NAME_EMPLOYEE_ICON, empDto.getPhotoFileName(),
                        "");
                empDto.setPhotoFileName(null);
                empDto.setPhotoFilePath(null);
            }
        }
        String newEmpData = createJsonEmployeeData(empDto, listEmployeeData, contentChange, employeeNewFile,
                formatDate);
        empDto.setEmployeeData(newEmpData);
    }

    /**
     * get Json for comlumn employee_data
     *
     * @param empDto - employee in DB
     * @param listEmployeeData - dynamic list data item
     * @param contentChange - content change
     * @return
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     */
    private String createJsonEmployeeData(EmployeesDTO empDto, List<EmployeeDataType> listEmployeeData,
            Map<String, Object> contentChange, Map<String, List<FileInfosDTO>> listFilesUploaded, String formatDate)
            throws IOException {
        Map<String, Object> empData = null;
        if (StringUtils.isNotBlank(empDto.getEmployeeData())) {
            empData = objectMapper.readValue(empDto.getEmployeeData(), typeRefMap);
        }
        Map<String, Object> oldEmpDataInDB = empData;
        if (empData == null) {
            empData = new HashMap<>();
        }
        ObjectMapper mapper = new ObjectMapper();
        if (listEmployeeData != null && !listEmployeeData.isEmpty()) {
            for (EmployeeDataType data : listEmployeeData) {
                String fieldType = data.getFieldType();
                if (FieldTypeEnum.PULLDOWN.getCode().equals(fieldType)
                        || FieldTypeEnum.RADIO.getCode().equals(fieldType)
                        || FieldTypeEnum.NUMBER.getCode().equals(fieldType)) {
                    createNumberTypeEmployeeData(empData, data);
                } else if (FieldTypeEnum.MULTIPLE_PULLDOWN.getCode().equals(fieldType)
                        || FieldTypeEnum.CHECKBOX.getCode().equals(fieldType)
                        || FieldTypeEnum.RELATION.getCode().equals(fieldType)) {
                    // "2", "Multiple pulldown" || "3", "Checkbox"
                    List<Long> fValue = null;
                    try {
                        TypeReference<ArrayList<Long>> typeRef = new TypeReference<ArrayList<Long>>() {};
                        fValue = objectMapper.readValue(data.getValue(), typeRef);
                    } catch (IOException e) {
                        log.error(e.getLocalizedMessage());
                    }
                    empData.put(data.getKey(), fValue);
                } else if (FieldTypeEnum.FILE.getCode().equals(fieldType)) {
                    creatEmployeesFileJson(listFilesUploaded, empData, mapper, data);
                } else if (FieldTypeEnum.DATE.getCode().equals(data.getFieldType())) {
                    getSystemDate(empData, formatDate, data.getValue(), data.getKey(), null);
                } else if (FieldTypeEnum.TIME.getCode().equals(data.getFieldType())) {
                    getSystemTime(empData, DateUtil.FORMAT_HOUR_MINUTE, data.getValue(), data.getKey());
                } else if (FieldTypeEnum.DATETIME.getCode().equals(data.getFieldType())) {
                    String date = StringUtils.isNotBlank(data.getValue())
                            ? data.getValue().substring(0, formatDate.length())
                            : "";
                    String hour = StringUtils.isNotBlank(data.getValue())
                            ? data.getValue().substring(formatDate.length())
                            : "";
                    getSystemDate(empData, formatDate, date, data.getKey(), hour);
                } else if (FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(data.getFieldType())) {
                    List<Object> fValue = null;
                    try {
                        TypeReference<ArrayList<Object>> typeRef = new TypeReference<ArrayList<Object>>() {};
                        fValue = objectMapper.readValue(data.getValue(), typeRef);
                    } catch (IOException e) {
                        log.error(e.getLocalizedMessage());
                    }
                    empData.put(data.getKey(), fValue);
                } else if (FieldTypeEnum.LINK.getCode().equals(data.getFieldType())) {
                    Map<String, String> fValue = new HashMap<>();
                    try {
                        TypeReference<Map<String, String>> typeRef = new TypeReference<Map<String, String>>() {};
                        fValue = objectMapper.readValue(data.getValue(), typeRef);
                        empData.put(data.getKey(), fValue);
                    } catch (Exception e) {
                        log.error(e.getLocalizedMessage());
                    }
                } else {
                    empData.put(data.getKey(), data.getValue());
                }
            }
        }
        String oldValue = objectMapper.writeValueAsString(oldEmpDataInDB);
        String newValue = objectMapper.writeValueAsString(empData);
        setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMPLOYEE_DATA, oldValue, newValue);
        return newValue;
    }

    /**
     * @param empData bject contain employees extend data in number
     * @param data employees data object
     */
    private void createNumberTypeEmployeeData(Map<String, Object> empData, EmployeeDataType data) {
        if (StringUtils.isBlank(data.getValue())) {
            if (empData.containsKey(data.getKey())) {
                empData.remove(data.getKey());
            }
        } else if (CheckUtil.isNumeric(data.getValue())) {
            empData.put(data.getKey(), Long.valueOf(data.getValue()));
        } else {
            empData.put(data.getKey(), Double.valueOf(data.getValue()));
        }
    }

    /**
     * @param listFilesUploaded list of uploaded files
     * @param empData object contain employees extend data in string
     * @param mapper mapper object
     * @param data employees data object
     * @throws JsonProcessingException
     */
    private void creatEmployeesFileJson(Map<String, List<FileInfosDTO>> listFilesUploaded, Map<String, Object> empData,
            ObjectMapper mapper, EmployeeDataType data) throws JsonProcessingException {
        List<FileInfosDTO> listFiles = new ArrayList<>();
        getEmployeesFileUpdateData(listFilesUploaded, mapper, data, listFiles);
        List<BaseFileInfosDTO> listFilesSaveDB = new ArrayList<>();
        listFiles.forEach(file -> {
            BaseFileInfosDTO dbFile = new BaseFileInfosDTO();
            dbFile.setFileName(file.getFileName());
            dbFile.setFilePath(file.getFilePath());
            listFilesSaveDB.add(dbFile);
        });
        empData.put(data.getKey(), objectMapper.writeValueAsString(listFilesSaveDB));
    }

    /**
     * set data to content_change field in table history
     *
     * @param contentChange - content change
     * @param fieldName - column change
     * @param oldData - old data
     * @param newData - new data
     */
    private void setOldNewData(Map<String, Object> contentChange, String fieldName, String oldData, String newData) {
        Map<String, String> contentChangeValue = null;
        if (oldData == null) {
            oldData = "";
        }
        if (!oldData.equals(newData)) {
            contentChangeValue = new HashMap<>();
            contentChangeValue.put(ConstantsEmployees.OLD_VALUE, oldData);
            contentChangeValue.put(ConstantsEmployees.NEW_VALUE, newData);
            contentChange.put(fieldName, contentChangeValue);
        }
    }

    /**
     * set data to content_change field in table history
     *
     * @param contentChange - content change
     * @param fieldName - column change
     * @param oldData - old data
     * @param newData - new data
     */
    private void setOldNewDataObject(Map<String, Object> contentChange, String fieldName, Object oldData,
            Object newData) {
        Map<String, String> contentChangeValue = null;
        String oldDataString = oldData != null ? oldData.toString() : "";
        if (!oldDataString.equals(newData.toString())) {
            contentChangeValue = new HashMap<>();
            contentChangeValue.put(ConstantsEmployees.OLD_VALUE, oldDataString);
            contentChangeValue.put(ConstantsEmployees.NEW_VALUE, newData.toString());
            contentChange.put(fieldName, contentChangeValue);
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#initializeLocalMenu()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public InitializeLocalMenuOutDTO initializeLocalMenu() {

        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();

        // Get departments
        List<DepartmentsDTO> departmentsDTOList = employeesCommonService.getDepartments();

        // get group and department of employeeId
        List<Long> groupIds = new ArrayList<>();
        List<Long> departmentIds = new ArrayList<>();

        GetGroupAndDepartmentByEmployeeIdsOutDTO groupDepOut = employeesService
                .getGroupAndDepartmentByEmployeeIds(Arrays.asList(employeeId));

        if (groupDepOut != null && !CollectionUtils.isEmpty(groupDepOut.getEmployees())) {
            groupDepOut.getEmployees().forEach(emp -> {
                if (!CollectionUtils.isEmpty(emp.getDepartmentIds())) {
                    departmentIds.addAll(emp.getDepartmentIds());
                }
                if (!CollectionUtils.isEmpty(emp.getDepartmentIds())) {
                    groupIds.addAll(emp.getGroupIds());
                }
            });
        }

        // Get my groups list
        List<EmployeesGroupsDTO> myGroupsList = employeesCommonService.getMyGroups(employeeId);

        // Get shared groups list
        List<InitializeLocalMenuSubType1DTO> sharedGroupsList = new ArrayList<>();

        Map<Long, EmployeesGroupsDTO> sharedGroupsListMap = new LinkedHashMap<>();

        List<EmployeesGroupsDTO> sharedGroups = employeesCommonService.getSharedGroups(employeeId, departmentIds,
                groupIds, false);

        // Remove duplicate
        for (EmployeesGroupsDTO sharedGroup : sharedGroups) {
            if ((!sharedGroupsListMap.containsKey(sharedGroup.getGroupId())) || (sharedGroupsListMap
                    .get(sharedGroup.getGroupId()).getParticipantType() < sharedGroup.getParticipantType())) {
                sharedGroupsListMap.put(sharedGroup.getGroupId(), sharedGroup);
            }
        }

        sharedGroupsListMap.entrySet().stream().forEach(entry -> {
            EmployeesGroupsDTO employeesGroupsDTO = entry.getValue();
            InitializeLocalMenuSubType1DTO initializeLocalMenuSubType1DTO = new InitializeLocalMenuSubType1DTO();
            initializeLocalMenuSubType1DTO.setGroupId(employeesGroupsDTO.getGroupId());
            initializeLocalMenuSubType1DTO.setGroupName(employeesGroupsDTO.getGroupName());
            initializeLocalMenuSubType1DTO.setIsAutoGroup(employeesGroupsDTO.getIsAutoGroup());
            initializeLocalMenuSubType1DTO.setUpdatedDate(employeesGroupsDTO.getUpdatedDate());
            initializeLocalMenuSubType1DTO.setParticipantType(employeesGroupsDTO.getParticipantType());
            sharedGroupsList.add(initializeLocalMenuSubType1DTO);
        });

        InitializeLocalMenuOutDTO initializeLocalMenuOutDTO = new InitializeLocalMenuOutDTO();
        initializeLocalMenuOutDTO.setDepartments(buildDepartmentTree(departmentsDTOList));
        initializeLocalMenuOutDTO.setMyGroups(myGroupsList);
        initializeLocalMenuOutDTO.setSharedGroups(sharedGroupsList);
        return initializeLocalMenuOutDTO;
    }

    /**
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#createEmployee(jp.co.softbrain.esales.employees.service.dto.CreateUpdateEmployeeInDTO)
     */
    @Override
    @Transactional
    public Long createEmployee(CreateUpdateEmployeeInDTO employee, List<FileMappingDTO> files, Boolean shouldValidate)
            throws IOException {
        // 0. Get employeeId from token
        Long employeeIdPerform = jwtTokenUtil.getEmployeeIdFromToken();

        // 0.1 get-date format
        String formatDate = getFormatDate();

        if (Boolean.TRUE.equals(shouldValidate)) {
            // 1. check User's authority
            if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
                throw new CustomRestException(NOT_HAVE_PERMISSION,
                        CommonUtils.putError(EMPLOYEES, Constants.USER_NOT_PERMISSION));
            }

            // 2.1 Validate internal
            if (checkDuplicateDepartmenAndPosition(employee.getEmployeeDepartments())) {
                throw new CustomRestException(DUPLICATE_DEPARTMENT_POSITION, CommonUtils
                        .putError(DEPARTMENTS_AND_POSITION, ConstantsEmployees.DUPLICATE_DEPARTMEN_AND_POSITION));
            }

            // Check exist email
            String email = employee.getEmail();
            if (!StringUtil.isNull(email)) {
                int numEmail = employeesRepository.checkExistedEmail(email);
                if (numEmail > 0) {
                    List<Map<String, Object>> errors = new ArrayList<>();
                    Map<String, Object> item = new HashMap<>();
                    item.put(Constants.ERROR_ITEM, ConstantsEmployees.EMAIL);
                    item.put(Constants.ERROR_CODE, ConstantsEmployees.EXIST_EMAIL_ERROR);
                    item.put(ConstantsEmployees.EMAIL, email);
                    errors.add(item);
                    throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, errors);
                }
            }

            // 2.2 Validate commons
            CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
            Map<String, Object> customParams = jsonBuilder.convertObjectExcludeFields(employee, Arrays.asList(
                    EMPLOYEE_DATA_FIELD_NAME, EMPLOYEE_DEPARTMENTS_FIELD_NAME, USER_ID_FIELD_NAME, COMMENT_FIELD_NAME));
            if (employee.getEmployeeData() != null) {
                customParams.putAll(jsonBuilder.convertKeyValueList(employee.getEmployeeData()));
            }
            List<DepartmentPositionIdsDTO> listDepartmentPositionIds = employee.getEmployeeDepartments();
            getDataDepartmentForValidate(customParams, listDepartmentPositionIds);
            String validateJson = jsonBuilder.build(FieldBelong.EMPLOYEE.getValue(), null, customParams, formatDate);
            validateCommon(validateJson);
        }

        // 3. Insert data employee
        EmployeesDTO employeesDTO = createUpdateEmployeeMapper.toEmployeesDTOWithoutEmployeeData(employee);
        List<EmployeeDataType> listEmployeeData = employee.getEmployeeData();
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        Map<Long, Map<String, List<FileInfosDTO>>> uploadData = S3FileUtil.uploadDataFile(employeeIdPerform, files,
                tenantName, applicationProperties.getUploadBucket(), FieldBelongEnum.EMPLOYEE);
        Map<String, List<FileInfosDTO>> employeesFilesMap = null;
        if (uploadData != null) {
            employeesFilesMap = uploadData.get(0L);
        }
        FileInfosDTO iconFile = processEmployeeIcon(employeesFilesMap, employee.getEmployeeIcon());
        String newEmpData = getJsonEmployeeDataCreate(listEmployeeData, uploadData, formatDate);
        employeesDTO.setEmployeeData(newEmpData);
        if (iconFile != null) {
            employeesDTO.setPhotoFileName(iconFile.getFileName());
            employeesDTO.setPhotoFilePath(iconFile.getFilePath());
        }
        employeesDTO.setUserId(employee.getEmail());
        employeesDTO.setEmployeeStatus(EMPLOYEE_STATUS_DEFAULT);
        if (employeesDTO.getFormatDateId() == null || employeesDTO.getFormatDateId().intValue() == 0) {
            employeesDTO.setFormatDateId(ConstantsEmployees.EMPLOYEE_FORMAT_DATE_DEFAULT);
        }
        employeesDTO.setIsAdmin(Boolean.TRUE.equals(employee.getIsAdmin()));
        employeesDTO.setCreatedUser(employeeIdPerform);
        employeesDTO.setUpdatedUser(employeeIdPerform);
        EmployeesDTO employeeCreated = this.save(employeesDTO);
        Long idEmployeeCreated = employeeCreated.getEmployeeId();

        // 3.1 Get license info
        MultiValueMap<String, String> getAvailableLicenseParams = new LinkedMultiValueMap<>();
        getAvailableLicenseParams.add(TENANT_NAME_PARAM, tenantName);
        GetAvailableLicenseResponse getLicenseRes = restOperationUtils.executeCallGetPublicApi(
                Constants.PathEnum.TENANTS, ConstantsEmployees.URL_API_GET_AVAILABLE_LICENSE, getAvailableLicenseParams,
                tenantName, GetAvailableLicenseResponse.class);

        if (getLicenseRes.getData() != null) {
            Map<Long, AvailableLicensePackage> packagesMap = getLicenseRes.getData().getPackages().stream()
                    .collect(Collectors.toMap(AvailableLicensePackage::getPackageId, packages -> packages,
                            (package1, package2) -> package1));

            // 3.2 Insert data packet for employee
            List<Long> employeePackageIds = employee.getPackageIds();
            if (employeePackageIds != null && !employeePackageIds.isEmpty()) {
                List<EmployeesPackageSumIdsDTO> empPackageIdList;
                if (StringUtil.isEmpty(TransIDHolder.getTransID())) {
                    empPackageIdList = employeesPackagesService.getSumEmployeePackageByIds(employeePackageIds);
                } else {
                    empPackageIdList = tmsService.getSumEmployeePackageByIds(employeePackageIds,
                            TransIDHolder.getTransID());
                }
                Map<Long, Integer> mapCountPackageId = new HashMap<>();
                if (!CollectionUtils.isEmpty(empPackageIdList)) {
                    empPackageIdList.forEach(pack -> mapCountPackageId.put(pack.getPackageId(),
                            Math.toIntExact(pack.getCountPackageId())));
                }
                employeePackageIds.stream().filter(packagesMap::containsKey)
                        .forEach(empPackageId -> insertEmployeePackages(mapCountPackageId,
                                packagesMap.get(empPackageId).getAvailablePackageNumber(), idEmployeeCreated,
                                employeeIdPerform, empPackageId));
            }
        }

        // 4. Insert data employees_departments
        if (employee.getEmployeeDepartments() != null && !employee.getEmployeeDepartments().isEmpty()) {
            List<EmployeesDepartments> employeesDepartmentsList = new ArrayList<>();
            for (DepartmentPositionIdsDTO data : employee.getEmployeeDepartments()) {
                EmployeesDepartmentsDTO employeesDepartmentsDTO = departmentPositionIdsMapper.toDto(data);
                employeesDepartmentsDTO.setEmployeeId(idEmployeeCreated);
                employeesDepartmentsDTO.setCreatedUser(employeeIdPerform);
                employeesDepartmentsDTO.setUpdatedUser(employeeIdPerform);
                employeesDepartmentsList.add(employeesDepartmentsMapper.toEntity(employeesDepartmentsDTO));
            }
            if (!employeesDepartmentsList.isEmpty()) {
                employeesDepartmentsRepository.saveAll(employeesDepartmentsList);
            }
        }

        // 5. Insert data history employee
        String token = SecurityUtils.getTokenValue().orElse(null);
        EmployeesHistoriesDTO employeesHistoriesDTO = emloyeesDTOMapper.toDto(employeesDTO);
        employeesHistoriesDTO.setEmployeeId(idEmployeeCreated);
        employeesHistoriesServiceImpl.save(employeesHistoriesDTO);

        GetCustomFieldsInfoRequest request = new GetCustomFieldsInfoRequest();
        request.setFieldBelong(FieldBelongEnum.EMPLOYEE.getCode());
        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                GET_CUSTOM_FIELDS_INFO_API, HttpMethod.POST, request, CommonFieldInfoResponse.class, token, tenantName);
        // update relation data
        updateRelationData(Collections.emptyMap(), employee.getEmployeeData(), fieldInfoResponse.getCustomFieldsInfo(),
                idEmployeeCreated);

        String password = getPassword();
        String companyName = jwtTokenUtil.getTenantIdFromToken();

        // Create Cognito user
        CognitoUserInfo cognitoUser = new CognitoUserInfo();
        cognitoUser.setEmployeeId(idEmployeeCreated);
        cognitoUser.setEmail(employeesDTO.getEmail());
        cognitoUser.setUsername(employeesDTO.getEmail());
        cognitoUser.setPassword(password);
        cognitoUser.setEmployeeSurname(employeesDTO.getEmployeeSurname());
        cognitoUser.setEmployeeName(employeesDTO.getEmployeeName());
        cognitoUser.setCompanyName(companyName);
        cognitoUser.setIsAdmin(Boolean.TRUE.equals(employeesDTO.getIsAdmin()));
        cognitoUser.setUpdatedAt(new Date());
        cognitoUser.setTenantId(TenantContextHolder.getTenant());
        cognitoUser.setIsAccessContract(Boolean.TRUE.equals(employee.getIsAccessContractSite()));

        // 1 : 2001-01-31, 2 : 01-31-2001, 3 : 31-01-2001
        if (employeesDTO.getFormatDateId() == null) {
            cognitoUser.setFormatDate(FOMAT_DATE_YYYY_MM_DD);
        } else {
            switch (employeesDTO.getFormatDateId()) {
            case 1:
                cognitoUser.setFormatDate(FOMAT_DATE_YYYY_MM_DD);
                break;
            case 2:
                cognitoUser.setFormatDate(FOMAT_DATE_MM_DD_YYYY);
                break;
            case 3:
                cognitoUser.setFormatDate(FOMAT_DATE_DD_MM_YYYY);
                break;
            default:
                cognitoUser.setFormatDate(FOMAT_DATE_YYYY_MM_DD);
                break;
            }
        }

        List<TimezonesDTO> timezones = getTimezones();
        timezones.forEach(timezone -> {
            if (employeesDTO.getTimezoneId() != null && timezone.getTimezoneId().equals(employeesDTO.getLanguageId())) {
                cognitoUser.setTimezoneName(timezone.getTimezoneShortName());
            }
        });

        List<LanguagesDTO> languages = getLanguages();
        languages.forEach(language -> {
            if (employeesDTO.getLanguageId() != null && language.getLanguageId().equals(employeesDTO.getLanguageId())) {
                cognitoUser.setLanguageCode(language.getLanguageCode());
            }
        });

        cognitoUser.setIsModifyEmployee(true);
        cognitoUser.setIsSendMail(employee.getIsSendMail());
        authenticationService.createNewUser(cognitoUser);

        // Send mail to employee
        if (employee.getIsSendMail() != null && employee.getIsSendMail()) {
            // 6. Create password and send mail for Employee

            // create userLogin
            CreateUserInputDTO createUserInput = new CreateUserInputDTO();
            createUserInput.setEmployeeId(idEmployeeCreated);
            createUserInput.setComment(employee.getComment());
            createUserInput.setEmployeeName(employee.getEmployeeName());
            createUserInput.setEmployeeSurname(employee.getEmployeeSurname());
            createUserInput.setEmail(employee.getEmail());
            createUserInput.setPassword(password);
            createUserInput.setUserNameImplement(jwtTokenUtil.getEmployeeNameFromToken());
            createUserInput.setTenantName(jwtTokenUtil.getTenantIdFromToken());
            createUserInput.setUserNameImplement(jwtTokenUtil.getEmployeeNameFromToken());
            createUserInput.setCompanyName(companyName);
            // call sendMail
            try {
                mailService.sendMailForCreateUser(createUserInput);
            } catch (Exception e) {
                log.debug(ConstantsEmployees.COULD_NOT_SEND_MAIL_MESSAGE, e.getLocalizedMessage());
            }
        }

        // 8. request create data for ElasticSearch
        List<Long> newEmployeeIds = new ArrayList<>();
        newEmployeeIds.add(idEmployeeCreated);
        if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(newEmployeeIds, null, null,
                Constants.ChangeAction.INSERT.getValue()))) {
            throw new CustomRestException(INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        return idEmployeeCreated;
    }

    /**
     * Get company name by tenant name
     *
     * @param tenantIdFromToken - tenant name
     * @return company name
     */
    public String getCompanyName(String tenantIdFromToken) {
        GetCompanyNameRequest getCompanyRequest = new GetCompanyNameRequest();
        getCompanyRequest.setTenantName(tenantIdFromToken);
        CompanyNameResponseDTO response = restOperationUtils.executeCallApi(PathEnum.TENANTS,
                ConstantsEmployees.URL_API_GET_COMPANY_NAME, HttpMethod.POST, getCompanyRequest,
                CompanyNameResponseDTO.class, SecurityUtils.getTokenValue().orElse(null), tenantIdFromToken);
        return response.getCompanyName();
    }

    /**
     * Insert into Employee Packages
     *
     * @param empPackageIdList empPackageIdList
     * @param packagesMap packagesMap
     * @param empPackageId
     */
    private void insertEmployeePackages(Map<Long, Integer> mapCountPackageId, Integer availablePackagesNumber,
            Long employeeId, Long employeeIdPerform, Long empPackageId) {

        Integer countPackageId = mapCountPackageId.get(empPackageId) != null ? mapCountPackageId.get(empPackageId) : 0;
        if (countPackageId >= availablePackagesNumber) {
            throw new CustomRestException(INVAIL_PACKAGE_ID_MESSAGE, CommonUtils.putError(ConstantsEmployees.PACKAGE_ID,
                    ConstantsEmployees.INVAIL_PACKAGE_ID, Math.toIntExact(empPackageId)));
        } else {
            EmployeesPackagesDTO employeesPackagesDTO = new EmployeesPackagesDTO();
            employeesPackagesDTO.setEmployeeId(employeeId);
            employeesPackagesDTO.setPackageId(empPackageId);
            employeesPackagesDTO.setCreatedUser(employeeIdPerform);
            employeesPackagesDTO.setUpdatedUser(employeeIdPerform);
            if (StringUtil.isEmpty(TransIDHolder.getTransID())) { // @TMS
                employeesPackagesService.save(employeesPackagesDTO);
            } else {
                tmsService.saveEmployeePackage(employeesPackagesDTO, TransIDHolder.getTransID());
            }
        }
    }

    /**
     * Insert into Employee Packages
     *
     * @param empPackageIdList
     *        empPackageIdList
     * @param packagesMap
     *        packagesMap
     * @param empPackageId
     */
    private void insertEmployeePackagesUpdateEmployees(Map<Long, Integer> mapCountPackageId,
            Map<Long, AvailableLicensePackage> packagesMapFinal, Long employeeId, Long employeeIdPerform,
            Long empPackageId) {

        Integer countPackageId = mapCountPackageId.get(empPackageId) != null ? mapCountPackageId.get(empPackageId) : 0;
        if (countPackageId >= packagesMapFinal.get(empPackageId).getAvailablePackageNumber()) {
            List<Map<String, Object>> errors = new ArrayList<>();
            Map<String, Object> item = new HashMap<>();
            item.put(Constants.ROW_ID, employeeId);
            item.put(Constants.ERROR_ITEM, ConstantsEmployees.EMPLOYEE_PACKAGES);
            item.put(Constants.ERROR_CODE, ConstantsEmployees.INVAIL_PACKAGE_ID);
            List<String> itemName = new ArrayList<>();
            itemName.add(packagesMapFinal.get(empPackageId).getPackageName());
            item.put("itemName", itemName);
            List<Long> errorPackIds = new ArrayList<>();
            errorPackIds.add(empPackageId);
            item.put("packagesId", errorPackIds);
            errors.add(item);
            throw new CustomRestException(VALIDATE_FAIL, errors);
        } else {
            EmployeesPackagesDTO employeesPackagesDTO = new EmployeesPackagesDTO();
            employeesPackagesDTO.setEmployeeId(employeeId);
            employeesPackagesDTO.setPackageId(empPackageId);
            employeesPackagesDTO.setCreatedUser(employeeIdPerform);
            employeesPackagesDTO.setUpdatedUser(employeeIdPerform);
            employeesPackagesService.save(employeesPackagesDTO);
        }
    }

    /**
     * @param validateJson
     */
    private void validateCommon(String validateJson) {
        if (StringUtil.isEmpty(validateJson)) {
            return;
        }
        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(VALIDATE_FAIL, response.getErrors());
        }
    }

    /**
     * process Employee Icon update data
     *
     * @param employeesFilesMap employee icon upload
     * @param iconUpdateData data of icon that either be kept or deleted
     * @return employee icon data string to insert into db
     */
    private FileInfosDTO processEmployeeIcon(Map<String, List<FileInfosDTO>> employeesFilesMap, String oldIcon) {
        List<FileInfosDTO> listFiles = null;
        if (employeesFilesMap != null) {
            listFiles = employeesFilesMap.get(ConstantsEmployees.FIELD_NAME_EMPLOYEE_ICON);
        }
        if (listFiles == null) {
            listFiles = new ArrayList<>();
        }
        KeyValue keyVal = new KeyValue();
        keyVal.setKey(ConstantsEmployees.FIELD_NAME_EMPLOYEE_ICON);
        if (StringUtils.isBlank(oldIcon)) {
            oldIcon = STRING_ARRAY_EMPTY;
        }
        keyVal.setValue(oldIcon);
        S3FileUtil.processUpdateFileInfo(keyVal, listFiles, objectMapper, applicationProperties.getUploadBucket());
        return !listFiles.isEmpty() ? listFiles.get(0) : null;
    }

    /**
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#updateEmployee(java.lang.Long,
     *      jp.co.softbrain.esales.employees.service.dto.CreateUpdateEmployeeInDTO)
     */
    @Transactional
    @SuppressWarnings({ "unchecked" })
    @Override
    public Long updateEmployee(Long employeeUpdateId, CreateUpdateEmployeeInDTO employee, List<FileMappingDTO> files)
            throws IOException {
        // Get employeeId from token
        Long userId = jwtTokenUtil.getEmployeeIdFromToken();

        // 0.1 get-date format
        String formatDate = getFormatDate();

        // 1. check User's authority
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException(NOT_HAVE_PERMISSION,
                    CommonUtils.putError(EMPLOYEES, Constants.USER_NOT_PERMISSION));
        }
        // 2.1 Validate internal
        if (checkDuplicateDepartmenAndPosition(employee.getEmployeeDepartments())) {
            throw new CustomRestException(DUPLICATE_DEPARTMENT_POSITION, CommonUtils.putError(DEPARTMENTS_AND_POSITION,
                    ConstantsEmployees.DUPLICATE_DEPARTMEN_AND_POSITION));
        }
        // Check exist email
        String emailCheckExist = employee.getEmail();
        if (!StringUtil.isNull(emailCheckExist)) {
            int numEmail = employeesRepository.checkExistedEmail(emailCheckExist, employeeUpdateId);
            if (numEmail > 0) {
                List<Map<String, Object>> errors = new ArrayList<>();
                Map<String, Object> item = new HashMap<>();
                item.put(Constants.ERROR_ITEM, ConstantsEmployees.EMAIL);
                item.put(Constants.ERROR_CODE, ConstantsEmployees.EXIST_EMAIL_ERROR);
                item.put(ConstantsEmployees.EMAIL, employee.getEmail());
                errors.add(item);
                throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, errors);
            }
        }

        // 2.2 Validate commons
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> customParams = jsonBuilder.convertObjectExcludeFields(employee,
                Arrays.asList(EMPLOYEE_DATA_FIELD_NAME, EMPLOYEE_DEPARTMENTS_FIELD_NAME, USER_ID_FIELD_NAME));
        if (employee.getEmployeeData() != null) {
            customParams.putAll(jsonBuilder.convertKeyValueList(employee.getEmployeeData()));
        }
        List<DepartmentPositionIdsDTO> listDepartmentPositionIds = employee.getEmployeeDepartments();
        getDataDepartmentForValidate(customParams, listDepartmentPositionIds);
        String validateJson = jsonBuilder.build(FieldBelong.EMPLOYEE.getValue(), null, customParams, formatDate);
        validateCommon(validateJson);

        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        Map<Long, Map<String, List<FileInfosDTO>>> uploadData = S3FileUtil.uploadDataFile(userId, files, tenantName,
                applicationProperties.getUploadBucket(), FieldBelongEnum.EMPLOYEE);

        // 6. Update employees
        Map<String, Object> contentChange = new HashMap<>();
        CognitoUserInfo cognitoUser = new CognitoUserInfo();
        EmployeesDTO empDto = this.findOne(employeeUpdateId).orElse(null);

        if (empDto == null) {
            throw new CustomException("Employee [" + employeeUpdateId + "] not existed.");
        }

        String oldDynamicDataString = empDto.getEmployeeData();
        String token = SecurityUtils.getTokenValue().orElse(null);
        GetCustomFieldsInfoRequest request = new GetCustomFieldsInfoRequest();
        request.setFieldBelong(FieldBelongEnum.EMPLOYEE.getCode());
        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                GET_CUSTOM_FIELDS_INFO_API, HttpMethod.POST, request, CommonFieldInfoResponse.class, token, tenantName);
        Map<String, List<FileInfosDTO>> employeesFilesMap = null;
        if (uploadData != null) {
            employeesFilesMap = uploadData.get(employeeUpdateId);
        }
        FileInfosDTO iconFile = processEmployeeIcon(employeesFilesMap, employee.getEmployeeIcon());
        if (iconFile != null) {
            employee.setPhotoFileName(iconFile.getFileName());
            employee.setPhotoFilePath(iconFile.getFilePath());
        } else {
            employee.setPhotoFileName("");
            employee.setPhotoFilePath("");
        }
        String oldMail = empDto.getEmail();

        // 5. Update employees
        try {
            getEmployeesDTO(empDto, employee, contentChange, fieldInfoResponse.getCustomFieldsInfo(), uploadData,
                    formatDate);
        } catch (JsonProcessingException ex) {
            throw new CustomException(CONVERT_DATA_ERROR, ex);
        }
        empDto.setUpdatedUser(userId);
        empDto.setIsAdmin(Boolean.TRUE.equals(employee.getIsAdmin()));
        EmployeesHistoriesDTO employeesHistoriesDTO = emloyeesDTOMapper.toDto(empDto);
        this.save(empDto);

        updateRelationData(oldDynamicDataString, employee.getEmployeeData(), fieldInfoResponse.getCustomFieldsInfo(),
                employeeUpdateId);

        // 5.3. Call API getAvailableLicense
        MultiValueMap<String, String> getAvailableLicenseParams = new LinkedMultiValueMap<>();
        getAvailableLicenseParams.add(TENANT_NAME_PARAM, tenantName);
        GetAvailableLicenseResponse getLicenseRes = restOperationUtils.executeCallGetPublicApi(
                Constants.PathEnum.TENANTS, ConstantsEmployees.URL_API_GET_AVAILABLE_LICENSE, getAvailableLicenseParams,
                tenantName, GetAvailableLicenseResponse.class);

        // 5.4 Update data employee packet
        if (getLicenseRes.getData() != null) {
            Map<Long, AvailableLicensePackage> packagesMap = getLicenseRes.getData().getPackages().stream()
                    .collect(Collectors.toMap(AvailableLicensePackage::getPackageId, packages -> packages,
                            (package1, package2) -> package1));
            // Check lisence of packet
            List<Long> employeePackageIds = employee.getPackageIds();
            employeesPackagesService.deleteByEmployeeId(employeeUpdateId);
            if (employeePackageIds != null && !employeePackageIds.isEmpty()) {
                List<EmployeesPackageSumIdsDTO> empPackageIdList;
                if (StringUtil.isEmpty(TransIDHolder.getTransID())) {
                    empPackageIdList = employeesPackagesService.getSumEmployeePackageByIds(employeePackageIds);
                } else {
                    empPackageIdList = tmsService.getSumEmployeePackageByIds(employeePackageIds,
                            TransIDHolder.getTransID());
                }
                Map<Long, Integer> mapCountPackageId = new HashMap<>();
                if (!CollectionUtils.isEmpty(empPackageIdList)) {
                    empPackageIdList.forEach(pack -> mapCountPackageId.put(pack.getPackageId(),
                            Math.toIntExact(pack.getCountPackageId())));
                }
                employeePackageIds.stream().filter(packagesMap::containsKey)
                        .forEach(empPackageId -> insertEmployeePackages(mapCountPackageId,
                                packagesMap.get(empPackageId).getAvailablePackageNumber(), empDto.getEmployeeId(),
                                userId, empPackageId));
            }
        }

        // 6. update data employees_departments
        List<EmployeesDepartments> existedEmpDep = employeesDepartmentsRepository.findByEmployeeId(employeeUpdateId);

        List<Long> oldDepartmentIds = existedEmpDep.stream().map(EmployeesDepartments::getDepartmentId)
                .collect(Collectors.toList());
        List<Long> newDepartmentIds = employee.getEmployeeDepartments().stream()
                .map(DepartmentPositionIdsDTO::getDepartmentId).collect(Collectors.toList());

        List<EmployeesDepartments> listEmpDepDelete = new ArrayList<>();
        List<EmployeesDepartments> listEmpDepUpdate = new ArrayList<>();
        List<EmployeesDepartments> listEmpDepCreate = new ArrayList<>();
        List<DepartmentPositionIdsDTO> depPosIdsParam = employee.getEmployeeDepartments();
        List<Long> newDepartmentIdsProcess;
        for (EmployeesDepartments oldEmpDep : existedEmpDep) {
            newDepartmentIdsProcess = depPosIdsParam.stream().map(DepartmentPositionIdsDTO::getDepartmentId)
                    .collect(Collectors.toList());
            // build list employees_departments to delete
            if (!newDepartmentIdsProcess.contains(oldEmpDep.getDepartmentId())) {
                listEmpDepDelete.add(oldEmpDep);
            }
            // build list employees_departments to update
            else {
                depPosIdsParam.stream()
                        .filter(newDepPos -> newDepPos.getDepartmentId().equals(oldEmpDep.getDepartmentId()))
                        .findFirst().ifPresent(newEmpDep -> {
                            EmployeesDepartmentsDTO updateDTO = employeesDepartmentsMapper.toDto(oldEmpDep);
                            updateDTO.setPositionId(newEmpDep.getPositionId() == null ? null
                                    : Long.valueOf(newEmpDep.getPositionId().toString()));
                            listEmpDepUpdate.add(employeesDepartmentsMapper.toEntity(updateDTO));
                            depPosIdsParam.remove(newEmpDep);
                        });
            }
        }

        for (DepartmentPositionIdsDTO depPosIdParam : depPosIdsParam) {
            // build list employees_departments to create
            EmployeesDepartmentsDTO employeesDepartments = departmentPositionIdsMapper.toDto(depPosIdParam);
            employeesDepartments.setEmployeeId(empDto.getEmployeeId());
            employeesDepartments.setCreatedUser(userId);
            employeesDepartments.setUpdatedUser(userId);
            listEmpDepCreate.add(employeesDepartmentsMapper.toEntity(employeesDepartments));
        }
        if (StringUtil.isEmpty(TransIDHolder.getTransID())) {
            // @TMS
            employeesDepartmentsRepository.deleteAll(listEmpDepDelete);
            employeesDepartmentsRepository.saveAll(listEmpDepUpdate);
            employeesDepartmentsRepository.saveAll(listEmpDepCreate);
        } else {
            tmsService.deleteAllEmployeesDepartments(listEmpDepDelete, TransIDHolder.getTransID());
            tmsService.saveAllEmployeesDepartments(listEmpDepUpdate, TransIDHolder.getTransID());
            tmsService.saveAllEmployeesDepartments(listEmpDepCreate, TransIDHolder.getTransID());
        }
        if (!listEmpDepDelete.isEmpty() || !listEmpDepUpdate.isEmpty() || !listEmpDepCreate.isEmpty()) {
            setOldNewData(contentChange, ConstantsEmployees.DEPARTMENT_ID, oldDepartmentIds.toString(),
                    newDepartmentIds.toString());
        }
        try {
            employeesHistoriesDTO.setContentChange(objectMapper.writeValueAsString(contentChange));
        } catch (JsonProcessingException e) {
            log.error(e.getLocalizedMessage());
        }
        employeesHistoriesServiceImpl.save(employeesHistoriesDTO);

        // Update Cognito user
        Integer status = empDto.getEmployeeStatus();
        Map<String, String> changeObj;
        if (contentChange.get(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_STATUS) != null) {
            changeObj = (Map<String, String>) contentChange.get(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_STATUS);
            status = Integer.valueOf(changeObj.get(ConstantsEmployees.NEW_VALUE));
        }
        if (status == 0) {
            cognitoUser.setUsername(oldMail);
            cognitoUser.setEmail(empDto.getEmail());

            if (contentChange.get(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME) != null) {
                changeObj = (Map<String, String>) contentChange.get(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME);
                cognitoUser.setEmployeeSurname(changeObj.get(ConstantsEmployees.NEW_VALUE));
            }
            if (contentChange.get(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME) != null) {
                changeObj = (Map<String, String>) contentChange.get(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME);
                cognitoUser.setEmployeeName(changeObj.get(ConstantsEmployees.NEW_VALUE));
            }
            if (contentChange.get(ConstantsEmployees.COLUMN_NAME_LANGUAGE_ID) != null) {
                changeObj = (Map<String, String>) contentChange.get(ConstantsEmployees.COLUMN_NAME_LANGUAGE_ID);
                String langId = changeObj.getOrDefault(ConstantsEmployees.NEW_VALUE, "0");
                Long languageId = Long.valueOf(langId);
                List<LanguagesDTO> languages = getLanguages();
                languages.forEach(language -> {
                    if (language.getLanguageId().equals(languageId)) {
                        cognitoUser.setLanguageCode(language.getLanguageCode());
                    }
                });
            }
            if (employee.getIsAccessContractSite() != null) {
                cognitoUser.setIsAccessContract(employee.getIsAccessContractSite());
            }
            if (employee.getIsAdmin() != null) {
                cognitoUser.setIsAdmin(employee.getIsAdmin());
            }
            if (contentChange.get(ConstantsEmployees.COLUMN_NAME_FORMAT_DATE_ID) != null) {
                changeObj = (Map<String, String>) contentChange.get(ConstantsEmployees.COLUMN_NAME_FORMAT_DATE_ID);

                // 1 : 2001-01-31, 2 : 01-31-2001, 3 : 31-01-2001
                switch (Integer.valueOf(changeObj.get(ConstantsEmployees.NEW_VALUE))) {
                case 1:
                    cognitoUser.setFormatDate(FOMAT_DATE_YYYY_MM_DD);
                    break;
                case 2:
                    cognitoUser.setFormatDate(FOMAT_DATE_MM_DD_YYYY);
                    break;
                case 3:
                    cognitoUser.setFormatDate(FOMAT_DATE_DD_MM_YYYY);
                    break;
                default:
                    cognitoUser.setFormatDate(FOMAT_DATE_YYYY_MM_DD);
                    break;
                }
            }
            if (contentChange.get(ConstantsEmployees.COLUMN_NAME_TIMEZONE_ID) != null) {
                changeObj = (Map<String, String>) contentChange.get(ConstantsEmployees.COLUMN_NAME_TIMEZONE_ID);
                String timezoneIdStr = changeObj.getOrDefault(ConstantsEmployees.NEW_VALUE, "0");
                Long timezoneId = Long.valueOf(timezoneIdStr);

                List<TimezonesDTO> timezones = getTimezones();
                timezones.forEach(timezone -> {
                    if (timezone.getTimezoneId().equals(timezoneId)) {
                        cognitoUser.setTimezoneName(timezone.getTimezoneShortName());
                    }
                });
            }

            cognitoUser.setIsModifyEmployee(true);
            authenticationService.updateUserAttributes(cognitoUser, null);
        } else {
            // delete cognito user
            authenticationService.deleteUser(cognitoUser.getUsername(), null, null, true);
        }

        // 9. request create data for ElasticSearch
        List<Long> employeeIds = new ArrayList<>();
        employeeIds.add(employeeUpdateId);
        if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(employeeIds, null, null,
                Constants.ChangeAction.UPDATE.getValue()))) {
            throw new CustomRestException(INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        return employeeUpdateId;
    }

    /**
     * Check employee change name
     *
     * @param nameOld name before update
     * @param nameParam name after update
     * @return true if same , false if not same
     */
    private boolean checkSameName(String nameOld, String nameParam) {
        boolean result = false;
        if ((nameOld == null && nameParam == null) || (nameOld != null && nameOld.equals(nameParam))) {
            result = true;
        }
        return result;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getNotExistDepartmentIds(java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<Long> getNotExistDepartmentIds(List<Long> lstDepartmentId) throws Exception {
        List<Long> lstExistedDepartmentId = departmentsRepository.getExistDepartmentByIds(lstDepartmentId);
        lstDepartmentId.removeAll(lstExistedDepartmentId);
        return lstDepartmentId;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#isExistEmailOfEmployee(java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<String> isExistEmailOfEmployee(List<String> lstEmail) throws Exception {
        return employeesRepository.getExistEmail(lstEmail);
    }

    /**
     * check duplicate departmenId and position id
     *
     * @param DepartmentPositionIdsDTO
     * @return true : duplicate departmenId and position id
     *         false : !duplicate departmenId and position id
     */
    private boolean checkDuplicateDepartmenAndPosition(List<DepartmentPositionIdsDTO> departmentIds) {
        boolean checkDuplicate = false;
        if (departmentIds != null) {
            for (int i = 0; i < departmentIds.size(); i++) {
                if (departmentIds.get(i) == null || departmentIds.get(i).getDepartmentId() == null
                        || departmentIds.get(i).getPositionId() == null) {
                    continue;
                }
                for (int j = i + 1; j < departmentIds.size(); j++) {
                    if (departmentIds.get(i).getDepartmentId().equals(departmentIds.get(j).getDepartmentId())
                            && departmentIds.get(i).getPositionId().equals(departmentIds.get(j).getPositionId())) {
                        checkDuplicate = true;
                        break;
                    }
                }
            }
        }
        return checkDuplicate;
    }

    /**
     * get employeesDTO
     *
     * @param employee
     * @param contentChange
     * @param fieldsList
     * @param employeeStatus
     * @return employeesDTO
     * @throws JsonProcessingException
     */
    private void getEmployeesDTO(EmployeesDTO empDto, CreateUpdateEmployeeInDTO employee,
            Map<String, Object> contentChange,
            List<jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO> fieldsList,
            Map<Long, Map<String, List<FileInfosDTO>>> uploadData, String formatDate) throws JsonProcessingException {
        if (employee.getPhotoFileName() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_PHOTO_FILE_NAME, empDto.getPhotoFileName(),
                    employee.getPhotoFileName());
            empDto.setPhotoFileName(employee.getPhotoFileName());
        }
        if (employee.getPhotoFilePath() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_PHOTO_FILE_PATH, empDto.getPhotoFilePath(),
                    employee.getPhotoFilePath());
            empDto.setPhotoFilePath(employee.getPhotoFilePath());
        }
        if (employee.getEmployeeSurname() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME, empDto.getEmployeeSurname(),
                    employee.getEmployeeSurname());
            empDto.setEmployeeSurname(employee.getEmployeeSurname());
        }
        if (employee.getEmployeeName() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME, empDto.getEmployeeName(),
                    employee.getEmployeeName());
            empDto.setEmployeeName(employee.getEmployeeName());
        }
        if (employee.getEmployeeSurnameKana() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME_KANA,
                    empDto.getEmployeeSurnameKana(), employee.getEmployeeSurnameKana());
            empDto.setEmployeeSurnameKana(employee.getEmployeeSurnameKana());
        }
        if (employee.getEmployeeNameKana() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME_KANA,
                    empDto.getEmployeeNameKana(), employee.getEmployeeNameKana());
            empDto.setEmployeeNameKana(employee.getEmployeeNameKana());
        }
        if (employee.getEmail() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMAIL, empDto.getEmail(), employee.getEmail());
            empDto.setEmail(employee.getEmail());
        }
        if (employee.getTelephoneNumber() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_TELEPHONE_NUMBER, empDto.getTelephoneNumber(),
                    employee.getTelephoneNumber());
            empDto.setTelephoneNumber(employee.getTelephoneNumber());
        }
        if (employee.getCellphoneNumber() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_CELLPHONE_NUMBER, empDto.getCellphoneNumber(),
                    employee.getCellphoneNumber());
            empDto.setCellphoneNumber(employee.getCellphoneNumber());
        }
        if (employee.getEmail() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_USER_ID, empDto.getUserId(),
                    employee.getEmail());
            empDto.setUserId(employee.getEmail());
        }
        if (employee.getLanguageId() != null) {
            String languageIdOld = null;
            if (empDto.getLanguageId() != null) {
                languageIdOld = empDto.getLanguageId().toString();
            }
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_LANGUAGE_ID, languageIdOld,
                    employee.getLanguageId().toString());
            empDto.setLanguageId(employee.getLanguageId());
        }
        if (employee.getTimezoneId() != null) {
            String timezoneIdOld = null;
            if (empDto.getTimezoneId() != null) {
                timezoneIdOld = empDto.getTimezoneId().toString();
            }
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_TIMEZONE_ID, timezoneIdOld,
                    employee.getTimezoneId().toString());
            empDto.setTimezoneId(employee.getTimezoneId());
        }
        if (employee.getFormatDateId() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_FORMAT_DATE_ID,
                    empDto.getFormatDateId().toString(), employee.getFormatDateId().toString());
            empDto.setFormatDateId(employee.getFormatDateId());
        }
        if (employee.getEmployeeStatus() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMPLOYEE_STATUS,
                    empDto.getEmployeeStatus().toString(), employee.getEmployeeStatus().toString());
            empDto.setEmployeeStatus(employee.getEmployeeStatus());
        }
        if (employee.getIsAdmin() != null) {
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_IS_ADMIN, String.valueOf(empDto.getIsAdmin()),
                    String.valueOf(employee.getIsAdmin()));
            empDto.setIsAdmin(employee.getIsAdmin());
        }

        List<EmployeeDataType> listEmployeeData = employee.getEmployeeData();

        String newEmpData = getJsonEmployeeDataUpdate(empDto, listEmployeeData, contentChange, fieldsList,
                uploadData.get(empDto.getEmployeeId()), formatDate);
        empDto.setEmployeeData(newEmpData);
    }

    /**
     * get Json for column employee_data
     *
     * @param listEmployeeData
     * @param contentChange
     * @param contentChange
     * @return String
     * @throws JsonProcessingException
     */
    private String getJsonEmployeeDataCreate(List<EmployeeDataType> listEmployeeData,
            Map<Long, Map<String, List<FileInfosDTO>>> uploadData, String formatDate) throws JsonProcessingException {
        Map<String, Object> empData = new HashMap<>();
        Map<String, List<FileInfosDTO>> employeesFilesMap = null;
        if (uploadData != null) {
            employeesFilesMap = uploadData.get(0L);
        }
        if (listEmployeeData != null && !listEmployeeData.isEmpty()) {
            for (EmployeeDataType data : listEmployeeData) {
                List<FileInfosDTO> listFiles = null;
                if (employeesFilesMap != null) {
                    listFiles = employeesFilesMap.get(data.getKey());
                }
                getDataFromEmployeeDataCreate(empData, data, listFiles, formatDate);
            }
        }
        return objectMapper.writeValueAsString(empData);
    }

    /**
     * get Json for comlumn employee_data for update
     *
     * @param listEmployeeData
     * @param contentChange
     * @param contentChange
     * @param fieldsList
     * @return String
     * @throws JsonProcessingException
     */
    private String getJsonEmployeeDataUpdate(EmployeesDTO empDto, List<EmployeeDataType> listEmployeeData,
            Map<String, Object> contentChange,
            List<jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO> fieldsList,
            Map<String, List<FileInfosDTO>> uploadData, String formatDate) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<Map<String, Object>> typeRef = new TypeReference<Map<String, Object>>() {};
        Map<String, Object> empData = new HashMap<>();
        if (StringUtils.isNotBlank(empDto.getEmployeeData())) {
            try {
                empData = mapper.readValue(empDto.getEmployeeData(), typeRef);
            } catch (IOException e) {
                throw new CustomException(CONVERT_DATA_ERROR, e);
            }
        }

        if (fieldsList != null && !fieldsList.isEmpty() && listEmployeeData != null && !listEmployeeData.isEmpty()) {
            for (EmployeeDataType data : listEmployeeData) {
                for (jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO fields : fieldsList) {
                    if ((fields.getIsDefault() == null || !fields.getIsDefault().booleanValue())
                            && fields.getModifyFlag() > 0 && fields.getFieldName().equals(data.getKey())) {
                        data.setFieldType(StringUtil.toString(fields.getFieldType()));

                        List<FileInfosDTO> listFiles = new ArrayList<>();
                        if (FieldTypeEnum.FILE.getCode().equals(String.valueOf(fields.getFieldType()))) {
                            getEmployeesFileUpdateData(uploadData, mapper, data, listFiles);
                        }
                        getDataFromEmployeeDataUpdate(empData, data, listFiles, formatDate);
                        break;
                    }
                }
            }
        }
        String rtn;
        try {
            rtn = objectMapper.writeValueAsString(empData);
        } catch (JsonProcessingException e) {
            throw new CustomException(CONVERT_DATA_ERROR, e);
        }
        setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMPLOYEE_DATA, empDto.getEmployeeData(), rtn);
        return rtn;
    }

    /**
     * get data for updated file of employee
     *
     * @param uploadData List of dto contain file data
     * @param mapper object mapper
     * @param data object contain employee data
     * @param listFiles list of new uploaded files of employees
     */
    private void getEmployeesFileUpdateData(Map<String, List<FileInfosDTO>> uploadData, ObjectMapper mapper,
            EmployeeDataType data, List<FileInfosDTO> listFiles) {
        S3FileUtil.processUpdateFileInfo(data, listFiles, mapper, applicationProperties.getUploadBucket());

        List<FileInfosDTO> listFileUpload = null;
        if (uploadData != null) {
            listFileUpload = uploadData.get(data.getKey());
        }
        if (listFileUpload != null) {
            listFiles.addAll(listFileUpload);
        }
    }

    /**
     * add data for Map<String, Object> empData
     *
     * @throws JsonProcessingException
     */
    private void getDataFromEmployeeDataCreate(Map<String, Object> empData, EmployeeDataType data,
            List<FileInfosDTO> listFiles, String formatDate) throws JsonProcessingException {
        if (FieldTypeEnum.FILE.getCode().equals(data.getFieldType())) {
            if (listFiles != null) {
                List<BaseFileInfosDTO> listSaveDb = new ArrayList<>();
                listFiles.forEach(file -> {
                    BaseFileInfosDTO fileSaveDb = new BaseFileInfosDTO();
                    fileSaveDb.setFileName(file.getFileName());
                    fileSaveDb.setFilePath(file.getFilePath());
                    listSaveDb.add(fileSaveDb);
                });
                empData.put(data.getKey(), objectMapper.writeValueAsString(listSaveDb));
            }
        } else if (StringUtils.isNotBlank(data.getValue()) && !STRING_ARRAY_EMPTY.equals(data.getValue())) {
            if (FieldTypeEnum.PULLDOWN.getCode().equals(data.getFieldType())
                    || FieldTypeEnum.RADIO.getCode().equals(data.getFieldType())) {
                empData.put(data.getKey(), Long.valueOf(data.getValue()));
            } else if (FieldTypeEnum.MULTIPLE_PULLDOWN.getCode().equals(data.getFieldType())
                    || FieldTypeEnum.CHECKBOX.getCode().equals(data.getFieldType())
                    || FieldTypeEnum.RELATION.getCode().equals(data.getFieldType())) {
                List<Long> fValue = null;
                try {
                    TypeReference<ArrayList<Long>> typeRef = new TypeReference<ArrayList<Long>>() {};
                    fValue = objectMapper.readValue(data.getValue(), typeRef);
                } catch (IOException e) {
                    log.error(e.getLocalizedMessage());
                }
                empData.put(data.getKey(), fValue);
            } else if (FieldTypeEnum.NUMBER.getCode().equals(data.getFieldType())) {
                if (CheckUtil.isNumeric(data.getValue())) {
                    empData.put(data.getKey(), Long.valueOf(data.getValue()));
                } else {
                    empData.put(data.getKey(), Double.valueOf(data.getValue()));
                }
            } else if (FieldTypeEnum.DATE.getCode().equals(data.getFieldType())) {
                getSystemDate(empData, formatDate, data.getValue(), data.getKey(), null);
            } else if (FieldTypeEnum.TIME.getCode().equals(data.getFieldType())) {
                getSystemTime(empData, DateUtil.FORMAT_HOUR_MINUTE, data.getValue(), data.getKey());
            } else if (FieldTypeEnum.DATETIME.getCode().equals(data.getFieldType())) {
                String date = data.getValue().substring(0, formatDate.length());
                String hour = data.getValue().substring(formatDate.length());
                getSystemDate(empData, formatDate, date, data.getKey(), hour);
            } else if (FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(data.getFieldType())) {
                List<Object> fValue = null;
                try {
                    TypeReference<ArrayList<Object>> typeRef = new TypeReference<ArrayList<Object>>() {};
                    fValue = objectMapper.readValue(data.getValue(), typeRef);
                } catch (IOException e) {
                    log.error(e.getLocalizedMessage());
                }
                empData.put(data.getKey(), fValue);
            } else if (FieldTypeEnum.LINK.getCode().equals(data.getFieldType())) {
                Map<String, String> fValue = new HashMap<>();
                try {
                    TypeReference<Map<String, String>> typeRef = new TypeReference<Map<String, String>>() {};
                    fValue = objectMapper.readValue(data.getValue(), typeRef);
                    empData.put(data.getKey(), fValue);
                } catch (Exception e) {
                    log.error(e.getLocalizedMessage());
                }
            } else {
                empData.put(data.getKey(), data.getValue());
            }
        }
    }

    /**
     * @param empData
     * @param formatDate
     * @param value
     * @param key
     */
    private void getSystemDate(Map<String, Object> empData, String formatDate, String value, String key, String hour) {
        String dbDateFormat = DateUtil.FORMAT_YEAR_MONTH_DAY_HYPHEN;
        if (!StringUtils.isBlank(hour)) {
            formatDate += " " + DateUtil.FORMAT_HOUR_MINUTE;
            value += " " + hour;
            dbDateFormat += " " + DateUtil.FORMAT_HOUR_MINUTE_SECOND;
        }
        SimpleDateFormat userFormat = new SimpleDateFormat(formatDate);
        String systemDateFormat = dbDateFormat;
        try {
            Date date = userFormat.parse(value);
            String dateSystem = new SimpleDateFormat(systemDateFormat).format(date);
            empData.put(key, dateSystem);
        } catch (ParseException e) {
            String dateSystem = "";
            empData.put(key, dateSystem);
        }
    }

    private void getSystemTime(Map<String, Object> empData, String formatTime, String value, String key) {
        try {
            SimpleDateFormat dbTimeFormater = new SimpleDateFormat(DateUtil.FORMAT_HOUR_MINUTE_SECOND);
            empData.put(key, dbTimeFormater.format(new SimpleDateFormat(formatTime).parse(value)));
        } catch (ParseException e) {
            empData.put(key, "");
        }
    }

    /**
     * update data for Map<String, Object> empData
     *
     * @throws JsonProcessingException
     */
    private void getDataFromEmployeeDataUpdate(Map<String, Object> empData, EmployeeDataType data,
            List<FileInfosDTO> listFiles, String formatDate) throws JsonProcessingException {
        if (FieldTypeEnum.FILE.getCode().equals(data.getFieldType())) {
            if (listFiles != null) {
                List<BaseFileInfosDTO> listSaveDb = new ArrayList<>();
                listFiles.forEach(file -> {
                    BaseFileInfosDTO fileSaveDb = new BaseFileInfosDTO();
                    fileSaveDb.setFileName(file.getFileName());
                    fileSaveDb.setFilePath(file.getFilePath());
                    listSaveDb.add(fileSaveDb);
                });
                empData.put(data.getKey(), objectMapper.writeValueAsString(listSaveDb));
            } else {
                empData.put(data.getKey(), STRING_ARRAY_EMPTY);
            }
        } else if (FieldTypeEnum.MULTIPLE_PULLDOWN.getCode().equals(data.getFieldType())
                || FieldTypeEnum.CHECKBOX.getCode().equals(data.getFieldType())
                || FieldTypeEnum.RELATION.getCode().equals(data.getFieldType())) {
            List<Long> fValue = null;
            try {
                TypeReference<ArrayList<Long>> typeRef = new TypeReference<ArrayList<Long>>() {};
                fValue = objectMapper.readValue(data.getValue(), typeRef);
            } catch (IOException e) {
                log.error(e.getLocalizedMessage());
            }
            empData.put(data.getKey(), fValue);
        } else if (FieldTypeEnum.PULLDOWN.getCode().equals(data.getFieldType())
                || FieldTypeEnum.RADIO.getCode().equals(data.getFieldType())
                || FieldTypeEnum.NUMBER.getCode().equals(data.getFieldType())) {
            if (StringUtils.isBlank(data.getValue())) {
                if (empData.containsKey(data.getKey())) {
                    empData.remove(data.getKey());
                }
            } else {
                if (CheckUtil.isNumeric(data.getValue())) {
                    empData.put(data.getKey(), Long.valueOf(data.getValue()));
                } else {
                    empData.put(data.getKey(), Double.valueOf(data.getValue()));
                }
            }
        } else if (FieldTypeEnum.DATE.getCode().equals(data.getFieldType())) {
            getSystemDate(empData, formatDate, data.getValue(), data.getKey(), null);
        } else if (FieldTypeEnum.TIME.getCode().equals(data.getFieldType())) {
            getSystemTime(empData, DateUtil.FORMAT_HOUR_MINUTE, data.getValue(), data.getKey());
        } else if (FieldTypeEnum.DATETIME.getCode().equals(data.getFieldType())) {
            String date = StringUtils.isNotBlank(data.getValue()) ? data.getValue().substring(0, formatDate.length())
                    : "";
            String hour = StringUtils.isNotBlank(data.getValue()) ? data.getValue().substring(formatDate.length()) : "";
            getSystemDate(empData, formatDate, date, data.getKey(), hour);
        } else if (FieldTypeEnum.SELECT_ORGANIZATION.getCode().equals(data.getFieldType())) {
            List<Object> fValue = null;
            try {
                TypeReference<ArrayList<Object>> typeRef = new TypeReference<ArrayList<Object>>() {};
                fValue = objectMapper.readValue(data.getValue(), typeRef);
            } catch (IOException e) {
                log.error(e.getLocalizedMessage());
            }
            empData.put(data.getKey(), fValue);
        } else if (FieldTypeEnum.LINK.getCode().equals(data.getFieldType())) {
            Map<String, String> fValue = new HashMap<>();
            try {
                TypeReference<Map<String, String>> typeRef = new TypeReference<Map<String, String>>() {};
                fValue = objectMapper.readValue(data.getValue(), typeRef);
                empData.put(data.getKey(), fValue);
            } catch (Exception e) {
                log.error(e.getLocalizedMessage());
            }
        } else {
            empData.put(data.getKey(), data.getValue());
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getInitializeInviteModal(boolean)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public InitializeInviteModalDTO getInitializeInviteModal() {
        // 2. check User's authority
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException(NOT_HAVE_PERMISSION,
                    CommonUtils.putError(EMPLOYEES, Constants.USER_NOT_ADMIN));
        }
        // Request to get list Departments, License, Option
        InitializeInviteModalDTO outDto = new InitializeInviteModalDTO();

        // Get department list
        // 1. Get departments
        List<DepartmentsDTO> lstDepartments = employeesCommonService.getDepartments();
        List<DepartmentDTO> lstDepartment = new ArrayList<>();
        if (lstDepartments != null) {
            for (DepartmentsDTO department : lstDepartments) {
                DepartmentDTO departmentDto = new DepartmentDTO();
                departmentDto.setDepartmentId(department.getDepartmentId());
                departmentDto.setDepartmentName(department.getDepartmentName());
                departmentDto.setUpdatedDate(department.getUpdatedDate());
                lstDepartment.add(departmentDto);
            }
        }
        outDto.setDepartments(lstDepartment);

        // Call API get AvailableLicensePackage
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        MultiValueMap<String, String> getAvailableLicenseParams = new LinkedMultiValueMap<>();
        getAvailableLicenseParams.add(TENANT_NAME_PARAM, tenantName);
        GetAvailableLicenseResponse getLicenseRes = restOperationUtils.executeCallGetPublicApi(
                Constants.PathEnum.TENANTS, ConstantsEmployees.URL_API_GET_AVAILABLE_LICENSE, getAvailableLicenseParams,
                tenantName, GetAvailableLicenseResponse.class);

        if (getLicenseRes.getData() != null) {
            Map<Long, AvailableLicensePackage> packagesMap = getLicenseRes.getData().getPackages().stream()
                    .collect(Collectors.toMap(AvailableLicensePackage::getPackageId, packages -> packages));
            // get used packages
            List<EmployeesPackageSumIdsDTO> empPackageIdList = employeesPackagesService.getSumEmployeePackage();
            outDto.setPackages(getPackagesInfoOut(empPackageIdList, packagesMap));
        }

        return outDto;
    }

    /**
     * get list pakage for response
     *
     * @param empPackageIdList list package used
     * @param packagesMap list package avaiable
     * @return list PackagesDTO
     */
    private List<PackagesDTO> getPackagesInfoOut(List<EmployeesPackageSumIdsDTO> empPackageIdList,
            Map<Long, AvailableLicensePackage> packagesMap) {
        List<PackagesDTO> listPackage = new ArrayList<>();

        Map<Long, Integer> mapCountPackageId = new HashMap<>();
        if (!CollectionUtils.isEmpty(empPackageIdList)) {
            empPackageIdList.forEach(
                    pack -> mapCountPackageId.put(pack.getPackageId(), Math.toIntExact(pack.getCountPackageId())));
        }
        packagesMap.forEach((packageId, abLicensePackage) -> {
            Integer countPackageId = mapCountPackageId.get(packageId) != null ? mapCountPackageId.get(packageId) : 0;
            PackagesDTO packagesDTO = new PackagesDTO();
            packagesDTO.setPackageId(packageId);
            packagesDTO.setPackageName(abLicensePackage.getPackageName());
            packagesDTO.setRemainPackages(
                    Long.valueOf(abLicensePackage.getAvailablePackageNumber() - (long) countPackageId));
            listPackage.add(packagesDTO);
        });
        return listPackage;
    }

    /**
     * get password
     * Cognito password policies min lenght: 8
     *
     * @return
     */
    private static String getPassword() {
        RandomValueStringGenerator randomValueStringGenerator = new RandomValueStringGenerator(8);
        String pass = randomValueStringGenerator.generate().toLowerCase();
        if (!pass.matches("^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$")) {
            pass = getPassword();
        }
        return pass;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#inviteEmployees(java.util.List)
     */
    @Override
    @Transactional
    public InviteEmployeesOutDTO inviteEmployees(List<InviteEmployeesInDTO> inviteEmployeesIn) throws Exception {
        boolean isSentMailError = false;

        // 1. check User's authority
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException(NOT_HAVE_PERMISSION,
                    CommonUtils.putError(EMPLOYEES, Constants.USER_NOT_ADMIN));
        }
        // 2. Validate
        validateInviteEmployees(inviteEmployeesIn);

        // 3. get lst Department Id
        List<String> lstEmail = new ArrayList<>();
        List<Long> lstDepartmentId = new ArrayList<>();
        for (InviteEmployeesInDTO inviteEmployee : inviteEmployeesIn) {
            lstEmail.add(inviteEmployee.getEmail());
            if (inviteEmployee.getDepartmentIds() != null) {
                lstDepartmentId.addAll(inviteEmployee.getDepartmentIds());
            }
        }
        lstDepartmentId = lstDepartmentId.stream().distinct().collect(Collectors.toList());

        // 4. Check exist department
        this.checkExitDepartment(lstDepartmentId);

        // 5. Check exist email
        List<Map<String, Object>> errors = new ArrayList<>();
        List<String> existedEmails = isExistEmailOfEmployee(lstEmail);
        int[] lstIndexEmails = new int[existedEmails.size()];
        for (int i = 0; i < existedEmails.size(); i++) {
            lstIndexEmails[i] = lstEmail.indexOf(existedEmails.get(i));
            Map<String, Object> item = new HashMap<>();
            item.put(Constants.ROW_ID, lstIndexEmails[i]);
            item.put(Constants.ERROR_ITEM, ConstantsEmployees.EMAIL);
            item.put(Constants.ERROR_CODE, ConstantsEmployees.EXIST_EMAIL_ERROR);
            item.put(ConstantsEmployees.EMAIL, existedEmails.get(i));
            errors.add(item);
        }
        if (!errors.isEmpty()) {
            throw new CustomRestException(VALIDATE_FAIL, errors);
        }

        // 3. insert data
        List<InviteEmployeesSubType1DTO> listSendedMails = new ArrayList<>();
        Map<Long, InviteEmployeesInDTO> employeeCreatedMap = new HashMap<>();
        List<Long> listEmployeeIdCreated = new ArrayList<>();
        InviteEmployeesOutDTO outDto = new InviteEmployeesOutDTO();

        // get userId, languageCode and languageId from current employee logged
        Long userId = jwtTokenUtil.getEmployeeIdFromToken();
        String languageCode = jwtTokenUtil.getLanguageCodeFromToken();
        Long languageId = 1L; // default ja_jp
        for (LanguagesDTO lang : getLanguages()) {
            if (languageCode.equals(lang.getLanguageCode())) {
                languageId = lang.getLanguageId();
                break;
            }
        }

        for (InviteEmployeesInDTO inviteEmployeeIn : inviteEmployeesIn) {
            // 3.1 Create employees
            InviteEmployeesSubType1DTO sendedMailResults = new InviteEmployeesSubType1DTO();

            EmployeesDTO dtoToSave = new EmployeesDTO();
            dtoToSave.setEmployeeSurname(inviteEmployeeIn.getEmployeeSurname());
            dtoToSave.setEmployeeName(inviteEmployeeIn.getEmployeeName());
            dtoToSave.setEmail(inviteEmployeeIn.getEmail());
            dtoToSave.setUserId(inviteEmployeeIn.getEmail());
            dtoToSave.setEmployeeStatus(EMPLOYEE_STATUS_DEFAULT);
            dtoToSave.setIsAdmin(inviteEmployeeIn.getIsAdmin());
            dtoToSave.setCreatedUser(userId);
            dtoToSave.setUpdatedUser(userId);
            dtoToSave.setLanguageId(languageId);
            dtoToSave.setFormatDateId(1);
            Long employeeIdCreated = this.save(dtoToSave).getEmployeeId();

            // set data use for create cognito user
            inviteEmployeeIn.setLanguage(languageCode);

            // set password to mail
            // Cognito password policies min lenght: 8
            inviteEmployeeIn.setPassword(getPassword());
            employeeCreatedMap.put(employeeIdCreated, inviteEmployeeIn);

            // 3.2 insert data employees_departments
            if (!CollectionUtils.isEmpty(inviteEmployeeIn.getDepartmentIds())) {
                List<Long> listEmployeeDepartmentId = inviteEmployeeIn.getDepartmentIds().stream().distinct()
                        .collect(Collectors.toList());
                listEmployeeDepartmentId.stream().forEach(depId -> {
                    EmployeesDepartmentsDTO empDepDto = new EmployeesDepartmentsDTO();
                    empDepDto.setEmployeeId(employeeIdCreated);
                    empDepDto.setDepartmentId(depId);
                    empDepDto.setCreatedUser(userId);
                    empDepDto.setUpdatedUser(userId);
                    employeesDepartmentsService.save(empDepDto);
                });
            }

            // 3.3 insert data employees_histories
            EmployeesHistoriesDTO employeeHistory = new EmployeesHistoriesDTO();
            employeeHistory.setEmployeeId(employeeIdCreated);
            employeeHistory.setCreatedUser(userId);
            employeeHistory.setUpdatedUser(userId);
            employeesHistoriesServiceImpl.save(employeeHistory);
            listEmployeeIdCreated.add(employeeIdCreated);

            // call API getAvailableLicense
            String tenantName = jwtTokenUtil.getTenantIdFromToken();
            MultiValueMap<String, String> getAvailableLicenseParams = new LinkedMultiValueMap<>();
            getAvailableLicenseParams.add(TENANT_NAME_PARAM, tenantName);
            GetAvailableLicenseResponse getLicenseRes = restOperationUtils.executeCallGetPublicApi(
                    Constants.PathEnum.TENANTS, ConstantsEmployees.URL_API_GET_AVAILABLE_LICENSE,
                    getAvailableLicenseParams, tenantName, GetAvailableLicenseResponse.class);

            if (getLicenseRes.getData() != null) {
                Map<Long, AvailableLicensePackage> packagesMap = getLicenseRes.getData().getPackages().stream()
                        .collect(Collectors.toMap(AvailableLicensePackage::getPackageId, packages -> packages));

                // 3.2 Insert data packet for employee
                List<Long> employeePackageIds = inviteEmployeeIn.getPackageIds();
                if (!CollectionUtils.isEmpty(employeePackageIds)) {
                    List<EmployeesPackageSumIdsDTO> empPackageIdList = employeesPackagesService
                            .getSumEmployeePackageByIds(employeePackageIds);
                    Map<Long, Integer> mapCountPackageId = new HashMap<>();
                    if (!CollectionUtils.isEmpty(empPackageIdList)) {
                        empPackageIdList.forEach(pack -> mapCountPackageId.put(pack.getPackageId(),
                                Math.toIntExact(pack.getCountPackageId())));
                    }
                    employeePackageIds.stream().filter(packagesMap::containsKey)
                            .forEach(empPackageId -> insertEmployeePackages(mapCountPackageId,
                                    packagesMap.get(empPackageId).getAvailablePackageNumber(), employeeIdCreated,
                                    userId, empPackageId));
                }
            }
            sendedMailResults
                    .setMemberName(inviteEmployeeIn.getEmployeeName() + " " + inviteEmployeeIn.getEmployeeSurname());
            sendedMailResults.setEmailAddress(inviteEmployeeIn.getEmail());

            // 4. Create login account
            String tenantId = jwtTokenUtil.getTenantIdFromToken();
            inviteEmployeeIn.setCompanyName(getCompanyName(tenantId));
            inviteEmployeeIn.setTenantName(tenantId);
            isSentMailError = false;
            try {
                mailService.sendInviteEmployeeMail(inviteEmployeeIn);
            } catch (Exception e) {
                log.error(String.format(ConstantsEmployees.COULD_NOT_SEND_MAIL_MESSAGE, e.getLocalizedMessage()), e);
                isSentMailError = true;
            }
            sendedMailResults.setSentEmailError(isSentMailError);
            listSendedMails.add(sendedMailResults);
        }
        outDto.setEmployees(listSendedMails);

        // Create Cognito user
        List<String> listUserCognito = new ArrayList<>();
        try {
            for (Map.Entry<Long, InviteEmployeesInDTO> employee : employeeCreatedMap.entrySet()) {
                CognitoUserInfo cognitoUser = new CognitoUserInfo();
                cognitoUser.setEmployeeId(employee.getKey());
                cognitoUser.setEmail(employee.getValue().getEmail());
                cognitoUser.setUsername(employee.getValue().getEmail());
                cognitoUser.setPassword(employee.getValue().getPassword());
                cognitoUser.setEmployeeSurname(employee.getValue().getEmployeeSurname());
                cognitoUser.setEmployeeName(employee.getValue().getEmployeeName());
                cognitoUser.setIsAdmin(employee.getValue().getIsAdmin());
                cognitoUser.setUpdatedAt(new Date());
                cognitoUser.setTenantId(TenantContextHolder.getTenant());
                cognitoUser.setIsAccessContract(employee.getValue().getIsAccessContractSite());
                cognitoUser.setLanguageCode(employee.getValue().getLanguage());
                cognitoUser.setCompanyName(employee.getValue().getCompanyName());
                cognitoUser.setTimezoneName("Asia/Tokyo");
                cognitoUser.setFormatDate(FOMAT_DATE_YYYY_MM_DD);
                cognitoUser.setIsModifyEmployee(true);
                authenticationService.createNewUser(cognitoUser);
                listUserCognito.add(cognitoUser.getUsername());
            }
        } catch (Exception e) {

            // rollback
            CognitoSettingInfoDTO cognitoSettings = authenticationService.getCognitoSetting();
            listUserCognito
                    .forEach(userName -> authenticationService.deleteUser(userName, null, cognitoSettings, true));
        }

        // 5. request create data for ElasticSearch
        if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(listEmployeeIdCreated, null,
                null, Constants.ChangeAction.INSERT.getValue()))) {
            throw new CustomRestException(INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        return outDto;
    }

    /**
     * check exit department
     *
     * @param lstDepartmentId the departmentId list
     * @throws Exception
     */
    private void checkExitDepartment(List<Long> lstDepartmentId) throws Exception {
        List<Long> notExistedDepartmentIds = getNotExistDepartmentIds(lstDepartmentId);
        String[] lstNotExistedDepartmentIds = new String[notExistedDepartmentIds.size()];
        for (int i = 0; i < notExistedDepartmentIds.size(); i++) {
            lstNotExistedDepartmentIds[i] = String.valueOf(notExistedDepartmentIds.get(i));
        }
        if (!notExistedDepartmentIds.isEmpty()) {
            throw new CustomRestException("Department ID = [" + notExistedDepartmentIds + "] not exist",
                    List.of(Map.of("departmentsId", lstNotExistedDepartmentIds, Constants.ERROR_CODE,
                            ConstantsEmployees.NOT_EXIST_DEPARTMENT_ERROR)));
        }

    }

    /**
     * Check validate
     *
     * @param inviteEmployees: List invited employees
     */
    private void validateInviteEmployees(List<InviteEmployeesInDTO> inviteEmployees) {
        // 1. Validate parameters
        if (inviteEmployees == null || inviteEmployees.isEmpty()) {
            throw new CustomRestException("Param [employeesMails] is null.",
                    CommonUtils.putError("employeesMails", Constants.RIQUIRED_CODE));
        }

        // 2.2 Validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        // create List<Map> customParams
        List<Map<String, Object>> customParams = new ArrayList<>();
        List<Map<String, Object>> errors = new ArrayList<>();
        List<String> lstEmail = new ArrayList<>();
        int index = 0;
        for (InviteEmployeesInDTO inviteEmployee : inviteEmployees) {
            Map<String, Object> customField = new HashMap<>();
            customField.put("rowId", index);
            customField.putAll(jsonBuilder.convertObjectIncludeFields(inviteEmployee, Arrays
                    .asList(EMPLOYEE_INVITE_EMPLOYEE_SURNAME, EMPLOYEE_INVITE_EMPLOYEE_NAME, EMPLOYEE_INVITE_EMAIL)));
            customField.put(EMPLOYEE_DEPARTMENTS_FIELD_NAME, inviteEmployee.getDepartmentIds());
            customParams.add(customField);

            // 2.1 Validate existed
            if (StringUtils.isBlank(inviteEmployee.getEmail())) {
                errors.add(CommonUtils.putError(ConstantsEmployees.EMAIL, Constants.RIQUIRED_CODE, index));
            }
            // Check duplicate email
            if (lstEmail.contains(inviteEmployee.getEmail())) {
                errors.add(CommonUtils.putError(ConstantsEmployees.EMAIL, ConstantsEmployees.DUPLICATE_EMAIL_ERROR,
                        index));
            }
            lstEmail.add(inviteEmployee.getEmail());
            // 4.1 Check total department invite
            if (inviteEmployee.getDepartmentIds().size() > ConstantsEmployees.TOTAL_DEPARTMENT_CAN_INVITE) {
                errors.add(CommonUtils.putError(ConstantsEmployees.EMPLOYEE_DEPARTMENTS_ATTR,
                        ConstantsEmployees.MAXIMUM_DEPARTMENT_ERROR, index));
            }
            index++;
        }
        String validateJson = jsonBuilder.build(FieldBelong.EMPLOYEE.getValue(), null, customParams);
        if (validateJson != null) {
            String token = SecurityUtils.getTokenValue().orElse(null);
            // Validate commons
            ValidateRequest validateRequest = new ValidateRequest(validateJson);
            ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsEmployees.URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class,
                    token, jwtTokenUtil.getTenantIdFromToken());
            if (response.getErrors() != null && !response.getErrors().isEmpty()) {
                errors.addAll(response.getErrors());
            }
        }
        if (!errors.isEmpty()) {
            throw new CustomRestException(VALIDATE_FAIL, errors);
        }
    }

    /**
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#initializeManagerModal(java.util.List,
     *      java.lang.String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public InitializeManagerModalOutDTO initializeManagerModal(List<Long> employeeIds, String langKey)
            throws IOException {
        InitializeManagerModalOutDTO responsesDTO = new InitializeManagerModalOutDTO();
        // 1. Validate parameter
        // a. validate intestine
        if (employeeIds == null || employeeIds.isEmpty()) {
            throw new CustomRestException("Param [employeeIds] is null.",
                    CommonUtils.putError(ConstantsEmployees.PARAM_EMPLOYEE_IDS, Constants.RIQUIRED_CODE));
        }
        // b. call method validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsEmployees.PARAM_EMPLOYEE_IDS, employeeIds);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        validateCommon(validateJson);

        // 2. Check User permissions
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException("User does not have edit permission",
                    CommonUtils.putError(EMPLOYEES, Constants.USER_NOT_PERMISSION));
        }

        // 3. Get employee information
        List<EmployeeInfoDTO> lstEmployeeFilter = employeesCommonService.getEmployeeByIds(employeeIds);

        // something else
        // 4. Filter data
        if (lstEmployeeFilter == null || lstEmployeeFilter.isEmpty()) {
            return responsesDTO;
        }
        List<InitializeManagerModalSubType2> departments = new ArrayList<>();

        // employee
        List<InitializeManagerModalSubType1> employees = new ArrayList<>();
        lstEmployeeFilter.forEach(employee -> {
            InitializeManagerModalSubType1 subType1 = new InitializeManagerModalSubType1();
            subType1.setEmployeeId(employee.getEmployeeId());
            subType1.setEmployeeSurname(employee.getEmployeeSurname());
            subType1.setEmployeeName(employee.getEmployeeName());
            subType1.setEmployeePhoto(employee.getEmployeeIcon());

            // departments
            List<InitializeManagerModalSubType2> departmentsEmployee = new ArrayList<>();
            departmentsRepository.findAllDepartmentByEmployeeId(employee.getEmployeeId()).forEach(department -> {
                InitializeManagerModalSubType2 subType2 = new InitializeManagerModalSubType2();
                subType2.setDepartmentId(department.getDepartmentId());
                subType2.setDepartmentName(department.getDepartmentName());
                subType2.setManagerId(department.getManagerId());
                setManagerForDeparment(subType2);

                // departmentUpdates
                List<InitializeManagerModalSubType4> departmentUpdates = new ArrayList<>();
                employeesDepartmentsService.findByDepartmentIdAndEmployeeIds(department.getDepartmentId(), employeeIds)
                        .forEach(employeeDepartment -> {
                            InitializeManagerModalSubType4 subType4 = new InitializeManagerModalSubType4();
                            subType4.setEmployeeId(employeeDepartment.getEmployeeId());
                            subType4.setUpdatedDate(employeeDepartment.getUpdatedDate());
                            departmentUpdates.add(subType4);
                        });
                subType2.setDepartmentUpdates(departmentUpdates);

                departmentsEmployee.add(subType2);
                if (departments.stream()
                        .noneMatch(dep -> dep.getDepartmentId().compareTo(subType2.getDepartmentId()) == 0)) {
                    departments.add(subType2);
                }
            });
            subType1.setDepartments(departmentsEmployee);
            employees.add(subType1);
        });
        responsesDTO.setEmployees(employees);

        // departments
        responsesDTO.setDepartments(departments);

        // 5. Response
        return responsesDTO;
    }

    /**
     * build manager for department
     *
     * @param deparment
     */
    private void setManagerForDeparment(InitializeManagerModalSubType2 deparment) {
        if (deparment.getManagerId() == null) {
            return;
        }
        Optional<EmployeesDTO> manager = this.findOne(deparment.getManagerId());
        if (!manager.isPresent()) {
            deparment.setManagerId(null);
            return;
        }
        EmployeesDTO employee = manager.get();
        deparment.setManagerName(StringUtil.getFullName(employee.getEmployeeSurname(), employee.getEmployeeName()));
        // set photo
        EmployeeIconDTO managerIcon = new EmployeeIconDTO();
        managerIcon.setFileName(employee.getPhotoFileName());
        managerIcon.setFilePath(employee.getPhotoFilePath());
        if (StringUtils.isNotBlank(employee.getPhotoFilePath())) {
            managerIcon.setFileUrl(S3CloudStorageClient.generatePresignedURL(applicationProperties.getUploadBucket(),
                    employee.getPhotoFilePath(), applicationProperties.getExpiredSeconds()));
        }
        deparment.setManagerPhoto(managerIcon);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getEmployeeMails(java.util.List,
     *      java.util.List, java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetEmployeeMailsOutDTO getEmployeeMails(List<Long> employeeIds, List<Long> groupIds,
            List<Long> departmentIds) {
        // Check null and empty list param
        boolean emptyEmployeeId = employeeIds == null || employeeIds.isEmpty();
        boolean emptyGroupIds = groupIds == null || groupIds.isEmpty();
        boolean emptyDepartmentIds = departmentIds == null || departmentIds.isEmpty();
        // If param null or empty data
        if (emptyEmployeeId && emptyGroupIds && emptyDepartmentIds) {
            throw new CustomRestException("メールを取得するリストID",
                    CommonUtils.putError("parameter invalid", Constants.PARAMETER_INVALID));
        }
        List<String> mailEmployees = employeesRepositoryCustom.getEmployeeMails(employeeIds, groupIds, departmentIds);
        GetEmployeeMailsOutDTO dto = new GetEmployeeMailsOutDTO();
        dto.setMails(mailEmployees);
        return dto;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#isExistEmployeeByKey(java.lang.String,
     *      java.lang.String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public IsExistEmployeeByKeyOutDTO isExistEmployeeByKey(String keyFieldName, String fieldValue) {
        // If Validate error
        if (StringUtils.isEmpty(keyFieldName)) {
            throw new CustomRestException("Param [keyFieldName] is null or empty",
                    CommonUtils.putError("keyFieldName", Constants.RIQUIRED_CODE));
        }
        if (StringUtils.isEmpty(fieldValue)) {
            throw new CustomRestException("Param [fieldValue] is null or empty",
                    CommonUtils.putError("fieldValue", Constants.RIQUIRED_CODE));
        }
        IsExistEmployeeByKeyOutDTO exist = new IsExistEmployeeByKeyOutDTO();
        Long countEmployee = employeesRepositoryCustom.countEmployeeByKey(keyFieldName, fieldValue);
        exist.setIsExist(countEmployee == 1);
        return exist;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#importEmployees(jp.co.softbrain.esales.employees.service.dto.ImportEmployeesInDTO)
     */
    @Override
    public ImportEmployeesOutDTO importEmployees(ImportEmployeesInDTO importEmployeesInDTO) {
        // 1. Validate parameter
        List<String> matchingKeys = importEmployeesInDTO.getMatchingKeys();
        List<ImportEmployeesSubType1DTO> mappingDefinitions = importEmployeesInDTO.getMappingDefinitions();
        List<List<String>> fileCsvContent = importEmployeesInDTO.getFileCsvContent();
        if (matchingKeys == null || matchingKeys.isEmpty() // check matchingKeys
                || mappingDefinitions == null || mappingDefinitions.isEmpty() // mappingDefinitions
                || fileCsvContent == null || fileCsvContent.isEmpty() // fileCsvContent
                || fileCsvContent.get(0) == null || fileCsvContent.get(0).isEmpty() // header
                || fileCsvContent.get(1) == null || fileCsvContent.get(1).isEmpty()) {
            throw new CustomRestException("ImportEmployees",
                    CommonUtils.putError("Validate parameter error", Constants.RIQUIRED_CODE));
        }

        // Validate parameter mappingDefinition.departments.csvHeader
        // and mappingDefinition.positions.csvHeader
        boolean hasDepartments = false;
        boolean hasPositions = false;
        for (ImportEmployeesSubType1DTO processImportSubType1DTO : importEmployeesInDTO.getMappingDefinitions()) {
            if (FIELD_NAME_CHECK_EXISTS_DEPARTMENTS.equals(processImportSubType1DTO.getFieldName())
                    && processImportSubType1DTO.getCsvHeader() != null) {
                hasDepartments = true;
            }
            if (FIELD_NAME_CHECK_EXISTS_POSITIONS.equals(processImportSubType1DTO.getFieldName())
                    && processImportSubType1DTO.getCsvHeader() != null) {
                hasPositions = true;
            }
        }
        if (!hasDepartments || !hasPositions) {
            throw new CustomRestException("ImportEmployees",
                    CommonUtils.putError("Validate parameter error", Constants.RIQUIRED_CODE));
        }
        // 2. Import data CSV
        ImportEmployeesSubType4DTO processImportSubType4DTO = importDataCSV(importEmployeesInDTO);

        // 4. Send mail

        // 4.1. Call API get list mail address
        // TODO

        // 4.2. Call API send mail to import employees.
        // TODO

        // 4.3. Call API to send mail to the relevant employees.

        // Dummy data
        ImportEmployeesOutDTO processImportOutDTO = new ImportEmployeesOutDTO();
        processImportOutDTO.setSummary(processImportSubType4DTO);
        processImportOutDTO.setResults(new ImportEmployeesSubType5DTO());
        return processImportOutDTO;
    }

    /**
     * Import data CSV.
     *
     * @param importEmployeesInDTO data import.
     * @return Data reference result.
     */
    private ImportEmployeesSubType4DTO importDataCSV(ImportEmployeesInDTO importEmployeesInDTO) {
        // 2.1. Mapping CSV file and Database.
        Map<String, Map<String, String>> mappingDefinitions = separationMappingDefinitions(
                importEmployeesInDTO.getMappingDefinitions());
        Map<String, String> mappingDefinitionsMap = mappingDefinitions.get(FIRST_ITEM);
        Map<String, String> mappingDefinitionsEmployeeDataMap = mappingDefinitions.get(SECOND_ITEM);

        // Build map column mapping header CSV
        Map<Integer, String> columnMap = new HashMap<>();
        Map<Integer, String> columnEmployeeDataMap = new HashMap<>();
        List<String> csvContentHeader = importEmployeesInDTO.getFileCsvContent().get(0);
        for (int i = 0; i < csvContentHeader.size(); i++) {
            String column = mappingDefinitionsMap.get(csvContentHeader.get(i));
            String columnEmployeeData = mappingDefinitionsEmployeeDataMap.get(csvContentHeader.get(i));
            if (column != null) {
                columnMap.put(i, column);
            } else if (columnEmployeeData != null) {
                columnEmployeeDataMap.put(i, columnEmployeeData);
            }
        }
        // Build map column check duplicated
        Map<Integer, String> columnCheckDuplicatedMap = new HashMap<>();
        columnMap.forEach((key, value) -> {
            if (importEmployeesInDTO.getMatchingKeys().contains(value)) {
                columnCheckDuplicatedMap.put(key, value);
            }
        });

        ImportEmployeesSubType4DTO processImportSubType4DTO = new ImportEmployeesSubType4DTO();
        processImportSubType4DTO.setTotalRecords(importEmployeesInDTO.getFileCsvContent().size() - 1);
        List<List<String>> csvDataProcessedList = new ArrayList<>();
        for (int i = 1; i < importEmployeesInDTO.getFileCsvContent().size(); i++) {
            List<String> csvContentRow = importEmployeesInDTO.getFileCsvContent().get(i);
            String employeeDataJson = buildEmployeeDataJson(csvContentRow, columnEmployeeDataMap);
            String customParamsJson = customParamsJson(csvContentRow, columnMap, employeeDataJson);
            // 2.2. Validate data CSV
            if (Constants.RESPONSE_FAILED == validateDataCSV(customParamsJson)) {
                processImportSubType4DTO
                        .setInvalidDataCount(processImportSubType4DTO.getInvalidDataCount() + INCREASE_COUNT);
            } else {
                // 2.3. Classification of data processing results CSV.
                // get employee id list in database.
                List<Long> employeeDuplicateList = employeesRepositoryCustom
                        .getEmployeeIdsByCondition(columnCheckDuplicatedMap, csvContentRow);
                // Check record exists in the DB and CSV
                int countDuplicateRecord = countRecordInDBAndCSV(employeeDuplicateList, columnMap,
                        importEmployeesInDTO.isSimulationMode(), csvContentRow, csvDataProcessedList);
                // 2.4. Import employees
                processImportSubType4DTO = categorizingResults(importEmployeesInDTO, employeeDuplicateList,
                        countDuplicateRecord, processImportSubType4DTO, customParamsJson, employeeDataJson, columnMap);
            }
            csvDataProcessedList.add(csvContentRow);
            processImportSubType4DTO
                    .setProcessedRecordCount(processImportSubType4DTO.getProcessedRecordCount() + INCREASE_COUNT);
        }

        return processImportSubType4DTO;
    }

    /**
     * separationMappingDefinitions
     *
     * @param mappingDefinitions List defines mapping column CSV and DB.
     * @return separation mapping definitions
     */
    private Map<String, Map<String, String>> separationMappingDefinitions(
            List<ImportEmployeesSubType1DTO> mappingDefinitions) {
        Map<String, String> mappingDefinitionsMap = new HashMap<>();
        Map<String, String> mappingDefinitionsEmployeeDataMap = new HashMap<>();
        for (ImportEmployeesSubType1DTO mappingDefinition : mappingDefinitions) {
            if (Boolean.TRUE.equals(mappingDefinition.getIsDefault())) {
                mappingDefinitionsMap.put(mappingDefinition.getCsvHeader(), mappingDefinition.getFieldName());
                continue;
            }
            mappingDefinitionsEmployeeDataMap.put(mappingDefinition.getCsvHeader(), mappingDefinition.getFieldName());
            if (mappingDefinition.getMappingOptionValue() != null) {
                for (ImportEmployeesSubType2DTO mappingOption : mappingDefinition.getMappingOptionValue()) {
                    mappingDefinitionsEmployeeDataMap.put(mappingOption.getCsvOptionValue(),
                            mappingOption.getCsvOptionValue());
                }
            }
        }

        Map<String, Map<String, String>> outMap = new HashMap<>();
        outMap.put(FIRST_ITEM, mappingDefinitionsMap);
        outMap.put(SECOND_ITEM, mappingDefinitionsEmployeeDataMap);
        return outMap;
    }

    /**
     * Categorizing results.
     *
     * @param importEmployeesInDTO data import.
     * @param employeeDuplicateList employee id list in database.
     * @param countDuplicateRecord count duplicate record
     * @param processImportSubType4DTO Data reference result.
     * @param customParamsJson custom params JSON.
     * @param employeeDataJson employee data JSON.
     * @param columnMap column map
     * @return Data reference result.
     */
    private ImportEmployeesSubType4DTO categorizingResults(ImportEmployeesInDTO importEmployeesInDTO,
            List<Long> employeeDuplicateList, int countDuplicateRecord,
            ImportEmployeesSubType4DTO processImportSubType4DTO, String customParamsJson, String employeeDataJson,
            Map<Integer, String> columnMap) {
        ImportEmployeesSubType4DTO result = processImportSubType4DTO;
        int importMode = importEmployeesInDTO.getImportMode();
        Long employeeId = importEmployeesInDTO.getEmployeeId();
        // Categorizing results of data processing CSV.
        if (importMode != ImportMode.INSERT.getTypeImportMode() && importMode != ImportMode.UPDATE.getTypeImportMode()
                && importMode != ImportMode.INSERT_AND_UPDATE.getTypeImportMode()) {
            return result;
        }
        if (importMode == ImportMode.INSERT.getTypeImportMode()) {
            if (countDuplicateRecord == CATEGORIZING_RECORDS_EXIST) {
                return updateDataCSVToDB(employeeId, customParamsJson, employeeDataJson, columnMap,
                        employeeDuplicateList.get(0), processImportSubType4DTO);
            }
            if (countDuplicateRecord > CATEGORIZING_RECORDS_EXIST) {
                result.setDuplicatedCount(processImportSubType4DTO.getDuplicatedCount() + INCREASE_COUNT);
                return result;
            }
            result.setNotRegistedNewCount(processImportSubType4DTO.getNotRegistedNewCount() + INCREASE_COUNT);
            return result;
        }
        if (importMode == ImportMode.UPDATE.getTypeImportMode()) {
            if (countDuplicateRecord == CATEGORIZING_RECORDS_EXIST) {
                return updateDataCSVToDB(employeeId, customParamsJson, employeeDataJson, columnMap,
                        employeeDuplicateList.get(0), processImportSubType4DTO);
            }
            if (countDuplicateRecord > CATEGORIZING_RECORDS_EXIST) {
                result.setDuplicatedCount(processImportSubType4DTO.getDuplicatedCount() + INCREASE_COUNT);
                return result;
            }
            return insertDataCSVToDB(employeeId, customParamsJson, employeeDataJson, columnMap,
                    processImportSubType4DTO);
        }
        if (importEmployeesInDTO.isRegistDuplicatedMode()) {
            return insertDataCSVToDB(employeeId, customParamsJson, employeeDataJson, columnMap,
                    processImportSubType4DTO);
        }
        if (countDuplicateRecord == CATEGORIZING_RECORDS_EXIST) {
            result.setDuplicatedCount(processImportSubType4DTO.getDuplicatedCount() + INCREASE_COUNT);
            return result;
        }
        if (countDuplicateRecord > CATEGORIZING_RECORDS_EXIST) {
            result.setNotUpdatedOldCount(processImportSubType4DTO.getNotUpdatedOldCount() + INCREASE_COUNT);
            return result;
        }
        return insertDataCSVToDB(employeeId, customParamsJson, employeeDataJson, columnMap, processImportSubType4DTO);
    }

    /**
     * Validate data CSV
     *
     * @param customParamsJson custom params json.
     * @return validate result.
     */
    private int validateDataCSV(String customParamsJson) {
        // build validate JSON
        StringBuilder validateJson = new StringBuilder();
        validateJson.append("{");
        validateJson.append("    \"fieldBelong\": " + FieldBelong.EMPLOYEE.getValue() + ",");
        validateJson.append("    \"customParams\": ");
        validateJson.append(customParamsJson);
        validateJson.append("}");

        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        ValidateRequest validateRequest = new ValidateRequest(String.valueOf(validateJson));
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        return (response.getErrors() == null || response.getErrors().isEmpty()) ? Constants.RESPONSE_SUCCESS
                : Constants.RESPONSE_FAILED;
    }

    /**
     * build custom params JSON.
     *
     * @param csvContentRow CSV content row
     * @param columnMap column map
     * @param employeeDataJson employee data JSON.
     * @return custom params JSON.
     */
    private String customParamsJson(List<String> csvContentRow, Map<Integer, String> columnMap,
            String employeeDataJson) {
        StringBuilder validateJson = new StringBuilder();
        validateJson.append(" [{ ");
        String concatChar = ConstantsEmployees.EMPTY;
        for (int i = 0; i < csvContentRow.size(); i++) {
            if (columnMap.containsKey(i)) {
                validateJson.append(concatChar);
                validateJson.append(ConstantsEmployees.QOUTE);
                validateJson.append(columnMap.get(i));
                validateJson.append(ConstantsEmployees.QOUTE);
                validateJson.append(ConstantsEmployees.COLON);
                validateJson.append(ConstantsEmployees.QOUTE);
                validateJson.append(csvContentRow.get(i));
                validateJson.append(ConstantsEmployees.QOUTE);
                concatChar = ConstantsEmployees.COMMA;
            }
        }
        validateJson.append(concatChar);
        validateJson.append(employeeDataJson);
        validateJson.append(" }]");
        return validateJson.toString();
    }

    /**
     * Build employee data json.
     *
     * @param csvContentRow csv content row.
     * @param columnEmployeeDataMap column employee data map.
     * @return employee data json.
     */
    private String buildEmployeeDataJson(List<String> csvContentRow, Map<Integer, String> columnEmployeeDataMap) {
        StringBuilder employeeDataJson = new StringBuilder();
        String concatChar = ConstantsEmployees.EMPTY;
        for (int i = 0; i < csvContentRow.size(); i++) {
            if (columnEmployeeDataMap.containsKey(i)) {
                employeeDataJson.append(concatChar);
                employeeDataJson.append(ConstantsEmployees.QOUTE);
                employeeDataJson.append(columnEmployeeDataMap.get(i));
                employeeDataJson.append(ConstantsEmployees.QOUTE);
                employeeDataJson.append(ConstantsEmployees.COLON);
                employeeDataJson.append(ConstantsEmployees.QOUTE);
                employeeDataJson.append(csvContentRow.get(i));
                employeeDataJson.append(ConstantsEmployees.QOUTE);
                concatChar = ConstantsEmployees.COMMA;
            }
        }
        return employeeDataJson.toString();
    }

    /**
     * Count record in DB and CSV
     *
     * @param employeeDuplicateList employee id list exists in the DB.
     * @param columnMap column map
     * @param isSimulationMode flag set to handle duplicate data.
     * @param csvContentRow csv content row.
     * @param csvDataProcessedList csv data processed list.
     * @return total record in DB and CSV.
     */
    private int countRecordInDBAndCSV(List<Long> employeeDuplicateList, Map<Integer, String> columnMap,
            boolean isSimulationMode, List<String> csvContentRow, List<List<String>> csvDataProcessedList) {
        // Check record exists in the DB
        int countRecordDB = 0;
        if (!employeeDuplicateList.isEmpty()) {
            countRecordDB = employeeDuplicateList.size();
        }
        // Check record exists in the CSV
        int countRecordCSV = 0;
        if (!isSimulationMode) {
            return countRecordDB;
        }
        for (List<String> csvContent : csvDataProcessedList) {
            for (Map.Entry<Integer, String> column : columnMap.entrySet()) {
                if (csvContent.get(column.getKey()).equals(csvContentRow.get(column.getKey()))) {
                    countRecordCSV++;
                }
            }
        }
        return countRecordDB + countRecordCSV;
    }

    /**
     * build employee DTO by Json.
     *
     * @param customParamsJson custom params json
     * @param employeeDataJson employee data json
     * @param columnMap column in DB.
     * @param employeesInfoOld employeesDTO old.
     * @return employee DTO
     */
    private EmployeesDTO buildEmployeeDTO(String customParamsJson, String employeeDataJson,
            Map<Integer, String> columnMap, EmployeesDTO employeesInfoOld) {
        try {
            JSONObject dataJSONEmployee = new JSONArray(customParamsJson).getJSONObject(0);
            EmployeesDTO employeesDTO = convertDataJSONToDTO(dataJSONEmployee, columnMap, employeesInfoOld);
            if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_DATA)) {
                employeesDTO.setEmployeeData("{" + employeeDataJson + "}");
            }

            List<DepartmentPositionDTO> departmentPositionDTOList = new ArrayList<>();
            String departments = dataJSONEmployee.getString(FIELD_NAME_CHECK_EXISTS_DEPARTMENTS);
            String positions = dataJSONEmployee.getString(FIELD_NAME_CHECK_EXISTS_POSITIONS);
            if (!departments.isEmpty()) {
                for (int i = 0; i < departments.split(ConstantsEmployees.SLASH_STAND).length; i++) {
                    DepartmentPositionDTO departmentPositionDTO = new DepartmentPositionDTO();
                    departmentPositionDTO
                            .setDepartmentId(Long.valueOf(departments.split(ConstantsEmployees.SLASH_STAND)[i]));
                    departmentPositionDTO
                            .setPositionId(Long.valueOf(positions.split(ConstantsEmployees.SLASH_STAND)[i]));
                    departmentPositionDTOList.add(departmentPositionDTO);
                }
            }
            employeesDTO.setDepartments(departmentPositionDTOList);

            return employeesDTO;
        } catch (JSONException e) {
            return null;
        }
    }

    /**
     * Convert data JSON to DTO
     *
     * @param dataJSONEmployee data JSON employee.
     * @param columnMap column in DB map.
     * @param employeesInfoOld employeesDTO old.
     * @return Employees DTO
     * @throws JSONException Exception when convert.
     */
    private EmployeesDTO convertDataJSONToDTO(JSONObject dataJSONEmployee, Map<Integer, String> columnMap,
            EmployeesDTO employeesInfoOld) throws JSONException {
        EmployeesDTO employeesDTO = employeesInfoOld;
        if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_PHOTO_FILE_NAME)) {
            employeesDTO.setPhotoFileName(dataJSONEmployee.getString(ConstantsEmployees.COLUMN_NAME_PHOTO_FILE_NAME));
        }
        if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_PHOTO_FILE_PATH)) {
            employeesDTO.setPhotoFilePath(dataJSONEmployee.getString(ConstantsEmployees.COLUMN_NAME_PHOTO_FILE_PATH));
        }
        if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME)) {
            employeesDTO
                    .setEmployeeSurname(dataJSONEmployee.getString(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME));
        }
        if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME)) {
            employeesDTO.setEmployeeName(dataJSONEmployee.getString(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME));
        }
        if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME_KANA)) {
            employeesDTO.setEmployeeSurnameKana(
                    dataJSONEmployee.getString(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME_KANA));
        }
        if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME_KANA)) {
            employeesDTO
                    .setEmployeeNameKana(dataJSONEmployee.getString(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME_KANA));
        }
        if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_EMAIL)) {
            employeesDTO.setEmail(dataJSONEmployee.getString(ConstantsEmployees.COLUMN_NAME_EMAIL));
        }
        if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_TELEPHONE_NUMBER)) {
            employeesDTO
                    .setTelephoneNumber(dataJSONEmployee.getString(ConstantsEmployees.COLUMN_NAME_TELEPHONE_NUMBER));
        }
        if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_CELLPHONE_NUMBER)) {
            employeesDTO
                    .setCellphoneNumber(dataJSONEmployee.getString(ConstantsEmployees.COLUMN_NAME_CELLPHONE_NUMBER));
        }
        if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_USER_ID)) {
            employeesDTO.setUserId(dataJSONEmployee.getString(ConstantsEmployees.COLUMN_NAME_USER_ID));
        }
        if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_LANGUAGE_ID)) {
            employeesDTO.setLanguageId(dataJSONEmployee.getLong(ConstantsEmployees.COLUMN_NAME_LANGUAGE_ID));
        }
        if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_TIMEZONE_ID)) {
            employeesDTO.setTimezoneId(dataJSONEmployee.getLong(ConstantsEmployees.COLUMN_NAME_TIMEZONE_ID));
        }
        if (columnMap.containsValue(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_STATUS)) {
            employeesDTO.setEmployeeStatus(dataJSONEmployee.getInt(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_STATUS));
        }
        return employeesDTO;
    }

    /**
     * Insert data CSV to DB
     *
     * @param employeeId employeeId import
     * @param customParamsJson custom params json
     * @param employeeDataJson employee data json
     * @param columnMap column in DB.
     * @param processImportSubType4DTO Data reference result.
     * @return Data reference result.
     */
    private ImportEmployeesSubType4DTO insertDataCSVToDB(Long employeeId, String customParamsJson,
            String employeeDataJson, Map<Integer, String> columnMap,
            ImportEmployeesSubType4DTO processImportSubType4DTO) {
        ImportEmployeesSubType4DTO result = processImportSubType4DTO;
        EmployeesDTO employeesDTO = buildEmployeeDTO(customParamsJson, employeeDataJson, columnMap, new EmployeesDTO());
        if (employeesDTO == null) {
            result.setNotRegistedNewCount(processImportSubType4DTO.getNotRegistedNewCount() + INCREASE_COUNT);
            return result;
        }

        // 2.4.1.Insert employee
        employeesDTO.setEmployeeId(null);
        employeesDTO.setCreatedDate(Instant.now());
        employeesDTO.setCreatedUser(employeeId);
        employeesDTO.setUpdatedDate(Instant.now());
        employeesDTO.setUpdatedUser(employeeId);
        EmployeesDTO employeeCreated = this.save(employeesDTO);
        Long idEmployeeCreated = employeeCreated.getEmployeeId();

        // Insert data employees_departments
        insertDataEmployeesDepartments(employeesDTO.getDepartments(), employeeId, idEmployeeCreated);

        // TODO Insert employee history after changes

        result.setRegisteredRecordCount(processImportSubType4DTO.getRegisteredRecordCount() + INCREASE_COUNT);
        return result;
    }

    /**
     * Insert data employees departments
     *
     * @param departments department list.
     * @param employeeId employeeId import
     * @param idEmployee
     */
    private void insertDataEmployeesDepartments(List<DepartmentPositionDTO> departments, Long employeeId,
            Long idEmployee) {
        // Insert data employees_departments
        for (DepartmentPositionDTO departmentPositionDTO : departments) {
            EmployeesDepartmentsDTO employeesDepartmentsDTO = new EmployeesDepartmentsDTO();
            employeesDepartmentsDTO.setEmployeeId(idEmployee);
            employeesDepartmentsDTO.setDepartmentId(departmentPositionDTO.getDepartmentId());
            employeesDepartmentsDTO.setPositionId(departmentPositionDTO.getPositionId());
            employeesDepartmentsDTO.setCreatedUser(employeeId);
            employeesDepartmentsDTO.setUpdatedDate(Instant.now());
            employeesDepartmentsDTO.setUpdatedUser(employeeId);
            employeesDepartmentsService.save(employeesDepartmentsDTO);
        }
    }

    /**
     * Update data CSV to DB
     *
     * @param employeeId employeeId import
     * @param customParamsJson custom params json
     * @param employeeDataJson employee data json
     * @param columnMap column in DB.
     * @param employeeIdOld employees id old.
     * @param processImportSubType4DTO Data reference result.
     * @return Data reference result.
     */
    private ImportEmployeesSubType4DTO updateDataCSVToDB(Long employeeId, String customParamsJson,
            String employeeDataJson, Map<Integer, String> columnMap, Long employeeIdOld,
            ImportEmployeesSubType4DTO processImportSubType4DTO) {
        ImportEmployeesSubType4DTO result = processImportSubType4DTO;
        this.findOne(employeeIdOld).ifPresent(empDTO -> {
            EmployeesDTO employeesDTO = buildEmployeeDTO(customParamsJson, employeeDataJson, columnMap, empDTO);
            if (employeesDTO == null || employeesDTO.getEmployeeId() == null) {
                result.setNotUpdatedOldCount(processImportSubType4DTO.getNotUpdatedOldCount() + INCREASE_COUNT);
                return;
            }
            // 2.4.2. Update employee
            // Delete department
            employeesDepartmentsService.deleteByEmployeeId(employeeId);
            // Insert department
            insertDataEmployeesDepartments(employeesDTO.getDepartments(), employeeId, employeesDTO.getEmployeeId());

            // Update employees
            employeesDTO.setUpdatedDate(Instant.now());
            employeesDTO.setUpdatedUser(employeeId);
            this.save(employeesDTO);

            // TODO Insert employee history after changes

            result.setUpdatedRecordCount(processImportSubType4DTO.getUpdatedRecordCount() + INCREASE_COUNT);
        });

        return result;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#
     * getEmployeeLayoutPersonal(java.lang.String, int)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeeLayoutDTO> getEmployeeLayoutPersonal(int extensionBelong) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();

        // 1.Call Grpc getCustomFieldsInfo
        CommonFieldInfoResponse fieldInfoResponse = new CommonFieldInfoResponse();
        FieldInfoPersonalsInputDTO request = new FieldInfoPersonalsInputDTO();
        request.setEmployeeId(employeeId);
        request.setExtensionBelong(extensionBelong);
        request.setSelectedTargetId(0L);
        request.setSelectedTargetType(0);
        request.setFieldBelong(FieldBelongEnum.EMPLOYEE.getCode());
        try {
            String token = SecurityUtils.getTokenValue().orElse(null);
            fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    "get-field-info-personals", HttpMethod.POST, request, CommonFieldInfoResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            throw new CustomRestException(e.getMessage(),
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }
        if (fieldInfoResponse == null) {
            return new ArrayList<>();
        }
        List<CustomFieldsInfoOutDTO> fieldsListGrpc = new ArrayList<>();
        fieldInfoResponse.getFieldInfoPersonals().forEach(field -> {
            List<CustomFieldsItemResponseDTO> itemList = new ArrayList<>();
            field.getFieldItems().forEach(item -> {
                CustomFieldsItemResponseDTO fieldItem = new CustomFieldsItemResponseDTO();
                fieldItem.setItemId(item.getItemId());
                fieldItem.setIsDefault(item.getIsDefault());
                fieldItem.setItemOrder(item.getItemOrder());
                fieldItem.setItemLabel(item.getItemLabel());
                fieldItem.setUpdatedDate(item.getUpdatedDate());
                itemList.add(fieldItem);
            });

            CustomFieldsInfoOutDTO fields = new CustomFieldsInfoOutDTO();
            fields.setFieldId(field.getFieldId());
            fields.setFieldBelong(field.getFieldBelong());
            fields.setFieldBelong(field.getFieldBelong());
            fields.setFieldName(field.getFieldName());
            fields.setFieldLabel(field.getFieldLabel());
            fields.setFieldType(field.getFieldType());
            fields.setFieldOrder(field.getFieldOrder());
            fields.setIsDefault(field.getIsDefault());
            fields.setMaxLength(field.getMaxLength());
            fields.setModifyFlag(field.getModifyFlag());
            fields.setAvailableFlag(field.getAvailableFlag());
            fields.setIsDefault(field.getIsDefault());
            fields.setDefaultValue(field.getDefaultValue());
            fields.setCurrencyUnit(field.getCurrencyUnit());
            fields.setTypeUnit(field.getTypeUnit());
            fields.setDecimalPlace(field.getDecimalPlace());
            fields.setUrlTarget(field.getUrlTarget());
            fields.setUrlText(field.getUrlText());
            fields.setUrlType(field.getUrlType());
            fields.setLinkTarget(field.getLinkTarget());
            fields.setConfigValue(field.getConfigValue());
            fields.setIsLinkedGoogleMap(field.getIsLinkedGoogleMap());
            fields.setFieldGroup(field.getFieldGroup());
            fields.setLookupData(field.getLookupData());
            fields.setRelationData(field.getRelationData());
            fields.setTabData(field.getTabData());
            fields.setUpdatedDate(field.getUpdatedDate());
            fields.setUrlType(field.getUrlType());
            fields.setFieldItems(itemList);
            fieldsListGrpc.add(fields);
        });
        return getEmployeeLayoutField(fieldsListGrpc);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getEmployeeLayout(java.lang.String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeeLayoutDTO> getEmployeeLayout() {
        // 1.Call API getCustomFieldsInfo
        CommonFieldInfoResponse fieldInfoResponse = new CommonFieldInfoResponse();
        try {
            String token = SecurityUtils.getTokenValue().orElse(null);
            fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    GET_CUSTOM_FIELDS_INFO_API, HttpMethod.POST, FieldBelongEnum.EMPLOYEE.getCode(),
                    CommonFieldInfoResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        if (fieldInfoResponse == null || fieldInfoResponse.getCustomFieldsInfo() == null
                || fieldInfoResponse.getCustomFieldsInfo().isEmpty()) {
            return new ArrayList<>();
        }
        return getEmployeeLayoutField(fieldInfoResponse.getCustomFieldsInfo());
    }

    /**
     * @param langCode language code
     * @param response response data of API getEmployeeLayout
     * @param commonChannel grpc channel of common service
     * @param fieldsList list of field from APi getCustomFieldInfo
     */
    private List<EmployeeLayoutDTO> getEmployeeLayoutField(List<CustomFieldsInfoOutDTO> fieldsList) {
        List<EmployeeLayoutDTO> response = new ArrayList<>();
        List<LanguagesDTO> languages = null;
        List<TimezonesDTO> timezones = null;
        List<PositionsDTO> positions = null;
        List<DepartmentsDTO> departments = null;
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        for (CustomFieldsInfoOutDTO fields : fieldsList) {
            EmployeeLayoutDTO empLayout = employeeLayoutMapper.toEmployeeLayout(fields);
            if (fields.getSelectOrganizationData() != null) {
                empLayout.setSelectOrganizationData(
                        selectOrganizationDataMapper.toDto(fields.getSelectOrganizationData()));
            }
            if (fields.getDifferenceSetting() != null) {
                empLayout.setDifferenceSetting(differenceSettingGrpcMapper.toDto(fields.getDifferenceSetting()));
            }
            Optional.ofNullable(fields.getLookupData()).ifPresent(lData -> {
                LookupDataDTO lookupData = lookupDataGrpcMapper.toDTOWithoutItemReflect(lData);
                lookupData.setItemReflect(itemReflectGrpcMapper.toDto(lData.getItemReflect()));
                empLayout.setLookupData(lookupData);
            });
            if (fields.getRelationData() != null) {
                RelationDataDTO relation = relationDataGrpcMapper.toDto(fields.getRelationData());
                relation.setDisplayFields(new ArrayList<>());
                if (fields.getRelationData().getDisplayFields() != null) {
                    fields.getRelationData().getDisplayFields().forEach(displayField -> {
                        DisplayFieldDTO displayfieldDTO = new DisplayFieldDTO();
                        displayfieldDTO.setFieldBelong(displayField.getFieldBelong());
                        displayfieldDTO.setFieldId(displayField.getFieldId());
                        displayfieldDTO.setFieldName(displayField.getFieldName());
                        displayfieldDTO.setRelationId(displayField.getRelationId());
                        relation.getDisplayFields().add(displayfieldDTO);
                    });
                }
                empLayout.setRelationData(relation);
            }
            empLayout.setTabData(fields.getTabData());
            ArrayList<CustomFieldItemDTO> fieldItemList = new ArrayList<>();
            switch (fields.getFieldName()) {
            case DEPARTMENTS_FIELD_NAME:
                departments = initializeDepartmentsList(departments);
                for (DepartmentsDTO departmentsDTO : departments) {
                    CustomFieldItemDTO customFieldItem = new CustomFieldItemDTO();
                    customFieldItem.setItemId(departmentsDTO.getDepartmentId());
                    customFieldItem.setItemLabel(departmentsDTO.getDepartmentName());
                    customFieldItem.setItemOrder(departmentsDTO.getDepartmentOrder());
                    customFieldItem.setItemParentId(departmentsDTO.getParentId());
                    fieldItemList.add(customFieldItem);
                }
                break;
            case POSITIONS_FIELD_NAME:
                positions = initializePositionsList(positions);
                for (PositionsDTO positionDTO : positions) {
                    CustomFieldItemDTO customFieldItem = new CustomFieldItemDTO();
                    customFieldItem.setItemId(positionDTO.getPositionId());
                    customFieldItem.setItemLabel(positionDTO.getPositionName());
                    customFieldItem.setItemOrder(positionDTO.getPositionOrder());
                    fieldItemList.add(customFieldItem);
                }
                break;
            case ConstantsEmployees.COLUMN_NAME_LANGUAGE_ID:
                languages = initializeLanguageList(languages);
                for (LanguagesDTO languagesDTO : languages) {
                    CustomFieldItemDTO customFieldItem = new CustomFieldItemDTO();
                    customFieldItem.setItemId(languagesDTO.getLanguageId());
                    customFieldItem.setItemLabel(languagesDTO.getLanguageName());
                    fieldItemList.add(customFieldItem);
                    customFieldItem.setIsAvailable(true);
                }
                break;
            case ConstantsEmployees.COLUMN_NAME_TIMEZONE_ID:
                timezones = initializeTimezoneList(timezones);
                for (TimezonesDTO timezonesDTO : timezones) {
                    CustomFieldItemDTO customFieldItem = new CustomFieldItemDTO();
                    customFieldItem.setItemId(timezonesDTO.getTimezoneId());
                    customFieldItem.setItemLabel(timezonesDTO.getTimezoneName());
                    customFieldItem.setItemOrder(timezonesDTO.getDisplayOrder());
                    customFieldItem.setIsAvailable(true);
                    fieldItemList.add(customFieldItem);
                }
                break;
            case ConstantsEmployees.EMPLOYEE_PACKAGES:
                MultiValueMap<String, String> getAvailableLicenseParams = new LinkedMultiValueMap<>();
                getAvailableLicenseParams.add(TENANT_NAME_PARAM, tenantName);
                GetAvailableLicenseResponse getLicenseRes = restOperationUtils.executeCallGetPublicApi(
                        Constants.PathEnum.TENANTS, ConstantsEmployees.URL_API_GET_AVAILABLE_LICENSE,
                        getAvailableLicenseParams, tenantName, GetAvailableLicenseResponse.class);

                if (getLicenseRes.getData() != null) {
                    List<AvailableLicensePackage> listPackages = getLicenseRes.getData().getPackages();
                    listPackages.forEach(empPackage -> {
                        CustomFieldItemDTO customFieldItem = new CustomFieldItemDTO();
                        customFieldItem.setItemId(empPackage.getPackageId());
                        customFieldItem.setItemLabel(empPackage.getPackageName());
                        fieldItemList.add(customFieldItem);
                    });
                }
                break;
            case ConstantsEmployees.COLUMN_NAME_IS_ADMIN:
                // PhuPM TODO Confirm thiet ke
                break;
            default:
                for (jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsItemResponseDTO fieldItem : fields
                        .getFieldItems()) {
                    CustomFieldItemDTO customFieldItem = customFieldItemMapper.toCustomFieldItemDTO(fieldItem);
                    customFieldItem.setIsAvailable(fieldItem.getIsAvailable());
                    customFieldItem.setItemOrder(fieldItem.getItemOrder());
                    customFieldItem.setIsDefault(fieldItem.getIsDefault());
                    fieldItemList.add(customFieldItem);
                }
                break;
            }
            empLayout.setFieldItems(fieldItemList);
            response.add(empLayout);
        }
        return response;
    }

    /**
     * Get list of department if haven't yet
     *
     * @param departments: department list
     * @return departments if it not null, otherwise get department list from
     *         common service and return it
     */
    private List<DepartmentsDTO> initializeDepartmentsList(List<DepartmentsDTO> departments) {
        if (departments != null) {
            return departments;
        }
        return employeesCommonService.getDepartments();
    }

    /**
     * get Positions list if haven't yet
     *
     * @param positions position list
     * @param langCode language code of login user, such as: ja_jp, en_us,
     *        zh_cn...
     * @return positions if it not null, otherwise get position list from common
     *         service and return it
     */
    private List<PositionsDTO> initializePositionsList(List<PositionsDTO> positions) {
        if (positions != null) {
            return positions;
        }
        return employeesCommonService.getPositions();
    }

    /**
     * get language list if haven't yet
     *
     * @param languages: language list
     * @param commonChannel: grpc channel of common service
     * @return languages if it not null, otherwise get language list from common
     *         service and return it
     */
    private List<LanguagesDTO> initializeLanguageList(List<LanguagesDTO> languages) {
        if (languages != null) {
            return languages;
        }
        GetLanguagesResponse languageResponse = new GetLanguagesResponse();
        try {
            String token = SecurityUtils.getTokenValue().orElse(null);
            languageResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsEmployees.URL_API_GET_LANGUAGE, HttpMethod.POST, null, GetLanguagesResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        languages = new ArrayList<>();
        if (languageResponse.getLanguagesDTOList() != null) {
            for (LanguagesDTO language : languageResponse.getLanguagesDTOList()) {
                LanguagesDTO dto = new LanguagesDTO();
                dto.setLanguageId(language.getLanguageId());
                dto.setLanguageName(language.getLanguageName());
                dto.setLanguageCode(language.getLanguageCode());
                languages.add(dto);
            }
        }
        return languages;
    }

    /**
     * Get Timezone list if haven't yet
     *
     * @param timezones: timezone list
     * @param commonChannel grpc channel of common service
     * @return timezones if it not null, otherwise get timezone list from common
     *         service and return it
     */
    private List<TimezonesDTO> initializeTimezoneList(List<TimezonesDTO> timezones) {
        if (timezones != null) {
            return timezones;
        }
        // Get timezones
        GetTimezonesResponse timezoneResponse = new GetTimezonesResponse();
        try {
            String token = SecurityUtils.getTokenValue().orElse(null);
            timezoneResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsEmployees.URL_API_GET_TIMEZONES, HttpMethod.POST, null, GetTimezonesResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        timezones = new ArrayList<>();
        if (timezoneResponse.getTimezones() != null) {
            for (TimezonesDTO timezone : timezoneResponse.getTimezones()) {
                TimezonesDTO dto = new TimezonesDTO();
                dto.setTimezoneId(timezone.getTimezoneId());
                dto.setTimezoneShortName(timezone.getTimezoneShortName());
                dto.setTimezoneName(timezone.getTimezoneName());
                timezones.add(dto);
            }
        }
        return timezones;
    }

    /**
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getEmployeesSuggestion(java.lang.String,
     *      java.lang.String, java.lang.String, java.lang.Long,
     *      java.lang.String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetEmployeesSuggestionOutDTO getEmployeesSuggestion(String keyWords, String startTime, String endTime,
            Long searchType, String langKey, Long offSet, Long limit,
            List<GetEmployeesSuggestionSubInDTO> listItemChoice, Long employeeIdToken, Long relationFieldId)
            throws IOException {
        // Get employees infomation
        GetEmployeesSuggestionOutDTO listEmployeesSuggest = new GetEmployeesSuggestionOutDTO();
        List<Object> lstBeforePaging = new ArrayList<>();

        String keyWordsEscapeSql = StringUtil.escapeSqlCommand(keyWords);
        // 1. Validate parameters
        validateGetEmployeesSuggestion(startTime, endTime, searchType);
        if (StringUtils.isEmpty(langKey)) {
            langKey = jwtTokenUtil.getLanguageKeyFromToken();
        }
        if (StringUtil.isNull(employeeIdToken)) {
            employeeIdToken = jwtTokenUtil.getEmployeeIdFromToken();
        }
        List<SuggestionsChoiceDTO> historyChoice = new ArrayList<>();
        // 2. Check keyWords

        if (StringUtil.isNull(keyWords)) {
            // 3. Call API getEmployeeSuggestionsChoice
            historyChoice = getEmployeeSuggestionsChoice(employeeIdToken, searchType);
            if (CollectionUtils.isEmpty(historyChoice)) {
                return listEmployeesSuggest;
            }
        }
        Map<Long, Long> historyChoiceIdMap;
        List<Long> idHistoryChoiceList;

        Long total = 0L;
        Long limitRecord = limit + offSet;
        Long offSetRecord = offSet;

        // 5. search employees
        if (searchType == null || searchType == 2 || searchType == 4 || searchType == 5) {

            // create parameter to search employee from elasticsearch
            SelectEmployeeElasticsearchInDTO inDto = new SelectEmployeeElasticsearchInDTO();
            List<SearchItem> searchOrConditions = new ArrayList<>();

            SearchItem searchItem = new SearchItem();
            searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            searchItem.setFieldName(ConstantsEmployees.DEPARTMENT_NAME_FIELD);
            searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
            searchItem.setFieldValue(keyWords);
            searchOrConditions.add(searchItem);

            searchItem = new SearchItem();
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

            searchItem = new SearchItem();
            searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            searchItem.setFieldName(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_SURNAME_KANA);
            searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
            searchItem.setFieldValue(keyWords);
            searchOrConditions.add(searchItem);

            searchItem = new SearchItem();
            searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            searchItem.setFieldName(ConstantsEmployees.COLUMN_NAME_EMPLOYEE_NAME_KANA);
            searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
            searchItem.setFieldValue(keyWords);
            searchOrConditions.add(searchItem);

            searchItem = new SearchItem();
            searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            searchItem.setFieldName(COLUMN_NAME_EMAIL);
            searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
            searchItem.setFieldValue(keyWords);
            searchOrConditions.add(searchItem);

            searchItem = new SearchItem();
            searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            searchItem.setFieldName(COLUMN_NAME_TELEPHONE_NUMBER);
            searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
            searchItem.setFieldValue(keyWords);
            searchOrConditions.add(searchItem);

            searchItem = new SearchItem();
            searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            searchItem.setFieldName(COLUMN_NAME_CELLPHONE_NUMBER);
            searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
            searchItem.setFieldValue(keyWords);
            searchOrConditions.add(searchItem);

            searchItem = new SearchItem();
            searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
            searchItem.setFieldName(ConstantsEmployees.POSITION_NAME_FIELD);
            searchItem.setFieldValue(keyWords);
            searchOrConditions.add(searchItem);

            // idHistoryChoiceList and listItemChoice
            historyChoiceIdMap = new HashMap<>();
            idHistoryChoiceList = new ArrayList<>();
            for (SuggestionsChoiceDTO choice : historyChoice) {
                if (ConstantsEmployees.EMPLOYEE.equals(choice.getIndex())) {
                    idHistoryChoiceList.add(choice.getIdResult());
                    historyChoiceIdMap.put(choice.getIdResult(), choice.getSuggestionsChoiceId());
                }
            }
            List<Long> idItemChoiceList = new ArrayList<>();
            if (listItemChoice != null) {
                listItemChoice.forEach(itemChoice -> {
                    if (ConstantsEmployees.EMPLOYEE_SEARCH_TYPE.equals(itemChoice.getSearchType())) {
                        idItemChoiceList.add(itemChoice.getIdChoice());
                    }
                });
            }

            // Loop idHistoryChoice to get employeeId
            List<Long> employeeIds;
            if (!idHistoryChoiceList.isEmpty()) {
                employeeIds = idHistoryChoiceList.stream().filter(id -> !idItemChoiceList.contains(id))
                        .collect(Collectors.toList());
            } else {
                inDto.setSearchOrConditions(searchOrConditions);
                inDto.setColumnId(ConstantsEmployees.EMPLOYEE_ID);

                SelectDetailElasticSearchResponse response = employeesCommonService.getEmployeesElasticsearch(inDto);

                // get employee_id list from elastic search result
                List<Long> employeeIdsElastic = new ArrayList<>();
                if (response != null && !response.getDataElasticSearch().isEmpty()) {
                    response.getDataElasticSearch().forEach(row -> row.getRow().forEach(item -> {
                        if (item.getKey().equals(ConstantsEmployees.EMPLOYEE_ID)) {
                            employeeIdsElastic.add(Double.valueOf(item.getValue()).longValue());
                        }
                    }));
                }

                employeeIds = employeeIdsElastic.stream().filter(id -> !idItemChoiceList.contains(id))
                        .collect(Collectors.toList());
            }
            String token = null;
            List<CustomFieldsInfoOutDTO> fieldsListRelation = null;
            if (relationFieldId != null && relationFieldId > 0) {
                token = SecurityUtils.getTokenValue().orElse(null);
                List<Long> fieldIdList = new ArrayList<>();
                fieldIdList.add(relationFieldId);
                GetCustomFieldsInfoByFieldIdsRequest request = new GetCustomFieldsInfoByFieldIdsRequest();
                request.setFieldIds(fieldIdList);
                // Call API getCustomFieldInfo by ids
                CommonFieldInfoResponse fieldInfoByIdsResponse = restOperationUtils.executeCallApi(
                        Constants.PathEnum.COMMONS,
                        ConstantsEmployees.ApiUrl.Commons.GET_CUSTOM_FIELDS_INFO_BY_FIELD_ID, HttpMethod.POST, request,
                        CommonFieldInfoResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
                if (fieldInfoByIdsResponse != null) {
                    fieldsListRelation = fieldInfoByIdsResponse.getCustomFieldsInfo();
                }
            }

            List<Long> employeeIdsWithRelation = new ArrayList<>();
            if (fieldsListRelation != null && !fieldsListRelation.isEmpty()) {
                CustomFieldsInfoOutDTO firstField = fieldsListRelation.get(0);
                if (firstField.getRelationData() != null && Constants.RelationFormat.SINGLE.getValue()
                        .equals(firstField.getRelationData().getFormat())) {
                    List<Employees> employeeWithRelation = employeesRepositoryCustom
                            .getEmployeesWithRelation(employeeIds, firstField);
                    employeeWithRelation.forEach(emp -> employeeIdsWithRelation.add(emp.getEmployeeId()));
                    List<Long> fieldIdList = new ArrayList<>();
                    fieldIdList.add(firstField.getRelationData().getFieldId());
                    GetCustomFieldsInfoByFieldIdsRequest request = new GetCustomFieldsInfoByFieldIdsRequest();
                    request.setFieldIds(fieldIdList);
                    CommonFieldInfoResponse fieldInfoByIdsResponse = restOperationUtils.executeCallApi(
                            Constants.PathEnum.COMMONS,
                            ConstantsEmployees.ApiUrl.Commons.GET_CUSTOM_FIELDS_INFO_BY_FIELD_ID, HttpMethod.POST,
                            request, CommonFieldInfoResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
                    if (fieldInfoByIdsResponse != null) {
                        fieldsListRelation = fieldInfoByIdsResponse.getCustomFieldsInfo();
                        if (fieldsListRelation != null && !fieldsListRelation.isEmpty()) {
                            CustomFieldsInfoOutDTO secondField = fieldsListRelation.get(0);
                            if (secondField.getRelationData() != null && Constants.RelationFormat.SINGLE.getValue()
                                    .equals(secondField.getRelationData().getFormat())) {
                                employeeWithRelation = employeesRepositoryCustom.getEmployeesWithRelation(employeeIds,
                                        secondField);
                                employeeWithRelation.forEach(emp -> employeeIdsWithRelation.add(emp.getEmployeeId()));
                            }
                        }
                    }
                }
            }
            employeeIds = employeeIds.stream().filter(employeeId -> !employeeIdsWithRelation.contains(employeeId))
                    .collect(Collectors.toList());
            List<EmployeeInfoDTO> employeeList = new ArrayList<>();
            if (!CollectionUtils.isEmpty(employeeIds)) {
                employeeList.addAll(employeesCommonService.getEmployeeByIds(employeeIds));
            }
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
                employeeList = employeeListSort;
            }
            employeeList = employeeList.stream().distinct().collect(Collectors.toList());
            total = total + employeeList.size();
            Collections.sort(employeeList, Comparator.comparing(EmployeeInfoDTO::getEmployeeSurname)
                    .thenComparing(emp -> emp.getEmployeeName() != null));
            lstBeforePaging.addAll(employeeList);
        }

        // 6. Search by department
        if (searchType == null || searchType == 1 || searchType == 4 || searchType == 6) {
            idHistoryChoiceList = new ArrayList<>();
            historyChoiceIdMap = new HashMap<>();
            for (SuggestionsChoiceDTO hChoice : historyChoice) {
                if (ConstantsEmployees.EMPLOYEE_DEPARTMENT.equals(hChoice.getIndex())) {
                    idHistoryChoiceList.add(hChoice.getIdResult());
                    historyChoiceIdMap.put(hChoice.getIdResult(), hChoice.getSuggestionsChoiceId());
                }
            }
            List<Long> idItemChoiceList = new ArrayList<>();
            if (CollectionUtils.isEmpty(historyChoice) || !CollectionUtils.isEmpty(idHistoryChoiceList)) {
                if (listItemChoice != null) {
                    idItemChoiceList = listItemChoice.stream()
                            .filter(itemChoice -> ConstantsEmployees.DEPARTMENT_GROUP_SEARCH_TYPE
                                    .equals(itemChoice.getSearchType()))
                            .map(GetEmployeesSuggestionSubInDTO::getIdChoice).collect(Collectors.toList());
                }

                List<GetEmployeesSuggestionSubType1> departmentList = getEmployeesByDepartment(keyWordsEscapeSql,
                        langKey, idHistoryChoiceList, idItemChoiceList, historyChoiceIdMap);
                total += Long.valueOf(departmentList.size());
                lstBeforePaging.addAll(departmentList);
            }
        }

        // 7. search by group
        if (searchType == null || searchType == 3 || searchType == 5 || searchType == 6) {
            idHistoryChoiceList = new ArrayList<>();
            historyChoiceIdMap = new HashMap<>();
            for (SuggestionsChoiceDTO hChoice : historyChoice) {
                if (ConstantsEmployees.EMPLOYEE_GROUP.equals(hChoice.getIndex())) {
                    idHistoryChoiceList.add(hChoice.getIdResult());
                    historyChoiceIdMap.put(hChoice.getIdResult(), hChoice.getSuggestionsChoiceId());
                }
            }
            if (CollectionUtils.isEmpty(historyChoice) || !CollectionUtils.isEmpty(idHistoryChoiceList)) {
                List<Long> idItemChoiceList = new ArrayList<>();
                if (listItemChoice != null) {
                    idItemChoiceList = listItemChoice.stream()
                            .filter(itemChoice -> ConstantsEmployees.EMPLOYEE_GROUP_SEARCH_TYPE
                                    .equals(itemChoice.getSearchType()))
                            .map(GetEmployeesSuggestionSubInDTO::getIdChoice).collect(Collectors.toList());
                }
                List<GetEmployeesSuggestionSubType5> groupList = getEmployeesByGroups(keyWordsEscapeSql, langKey,
                        idHistoryChoiceList, idItemChoiceList, historyChoiceIdMap);
                total += Long.valueOf(groupList.size());
                lstBeforePaging.addAll(groupList);
            }
        }
        listEmployeesSuggest.setTotal(total);
        if (total < offSet) {
            return listEmployeesSuggest;
        }
        // list departments
        List<GetEmployeesSuggestionSubType1> departments = new ArrayList<>();
        // list employees
        List<EmployeeInfoDTO> employees = new ArrayList<>();
        // list groups
        List<GetEmployeesSuggestionSubType5> groups = new ArrayList<>();
        List<Object> lstAfterPaging;
        // process paging
        if (lstBeforePaging.size() < limitRecord) {
            lstAfterPaging = lstBeforePaging.subList(Math.toIntExact(offSetRecord),
                    Math.toIntExact(lstBeforePaging.size()));
        } else {
            lstAfterPaging = lstBeforePaging.subList(Math.toIntExact(offSetRecord), Math.toIntExact(limitRecord));
        }
        for (int i = 0; i < lstAfterPaging.size(); i++) {
            if (lstAfterPaging.get(i) == null) {
                continue;
            }
            if (lstAfterPaging.get(i) instanceof EmployeeInfoDTO) {
                employees.add((EmployeeInfoDTO) lstAfterPaging.get(i));
            } else if (lstAfterPaging.get(i) instanceof GetEmployeesSuggestionSubType1) {
                departments.add((GetEmployeesSuggestionSubType1) lstAfterPaging.get(i));
            } else if (lstAfterPaging.get(i) instanceof GetEmployeesSuggestionSubType5) {
                groups.add((GetEmployeesSuggestionSubType5) lstAfterPaging.get(i));
            }
        }
        listEmployeesSuggest.setDepartments(departments);
        listEmployeesSuggest.setEmployees(employees);
        listEmployeesSuggest.setGroups(groups);
        // fix position_name
        getPositionNameForEmployee(listEmployeesSuggest.getEmployees(), langKey);
        // 8. Get employees have timed task execution
        if (!StringUtil.isNull(startTime) || !StringUtil.isNull(endTime)) {

            // 8.1. Call API getBusyEmployees
            String token = SecurityUtils.getTokenValue().orElse(null);
            GetBusyEmployeesRequest reEmployeesRequest = new GetBusyEmployeesRequest();
            reEmployeesRequest.setStartDate(startTime);
            reEmployeesRequest.setFinishDate(endTime);
            GetBusyEmployeesResponse getBusyEmployeesResponse = restOperationUtils.executeCallApi(
                    Constants.PathEnum.SCHEDULES, "get-busy-employees", HttpMethod.POST, reEmployeesRequest,
                    GetBusyEmployeesResponse.class, token, jwtTokenUtil.getTenantIdFromToken());

            // 8.2 Get a duplicate employee ID list
            List<GetBusyEmployeesSubType1DTO> operatorList = new ArrayList<>();
            if (getBusyEmployeesResponse.getOperators() != null) {
                operatorList.addAll(getBusyEmployeesResponse.getOperators());
            }
            // 8.2.1: Filter data
            List<Long> employeeIds = new ArrayList<>();
            List<Long> departmentIds = new ArrayList<>();
            List<Long> groupIds = new ArrayList<>();
            operatorList.forEach(operator -> {
                if (operator.getOperatorDivision() == OperaDivision.EMPLOYEES.getValue()) {
                    employeeIds.add(operator.getOperatorId());
                }
                if (operator.getOperatorDivision() == OperaDivision.DEPARTMENT.getValue()) {
                    departmentIds.add(operator.getOperatorId());
                }
                if (operator.getOperatorDivision() == OperaDivision.GROUP.getValue()) {
                    groupIds.add(operator.getOperatorId());
                }
            });
            List<Long> busyEmployees = new ArrayList<>();
            busyEmployees.addAll(employeeIds);
            // 8.2.2. Get ID of employee with department
            List<Long> empDepIds = employeesDepartmentsService.getEmployeeIdByDepartment(departmentIds);
            busyEmployees.addAll(empDepIds);

            // 8.2.3. Get ID employee by group
            List<Long> empGroupIds = employeesGroupsRepository.getListEmployeeIdByGroupId(groupIds);
            busyEmployees.addAll(empGroupIds);

            // 8.3. Filter employee busy
            listEmployeesSuggest.getDepartments()
                    .forEach(department -> department.getEmployeesDepartments().forEach(employee -> {
                        if (busyEmployees.stream().anyMatch(busyEmpId -> busyEmpId.equals(employee.getEmployeeId()))) {
                            employee.setIsBusy(Boolean.TRUE);
                        }
                    }));

            listEmployeesSuggest.getEmployees().forEach(emp -> {
                if (busyEmployees.stream().anyMatch(busyEmpId -> busyEmpId.equals(emp.getEmployeeId()))) {
                    emp.setIsBusy(Boolean.TRUE);
                }
            });

            listEmployeesSuggest.getGroups().forEach(group -> group.getEmployeesGroups().forEach(employee -> {
                if (busyEmployees.stream().anyMatch(busyEmpId -> busyEmpId.equals(employee.getEmployeeId()))) {
                    employee.setIsBusy(Boolean.TRUE);
                }
            }));
        }

        return listEmployeesSuggest;
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
     * Call API to get Employee Suggestions Choice
     *
     * @param employeeId
     *        id of employee
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
            // Validate commons
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

    /**
     * validate parameter input for api getEmployeesSuggestion
     *
     * @param startTime start time
     * @param endTime end time
     * @param searchType type of search
     * @throws IOException
     */
    private void validateGetEmployeesSuggestion(String startTime, String endTime, Long searchType) {
        GetEmployeesSuggestionInDTO validateDto = new GetEmployeesSuggestionInDTO();
        validateDto.setStartTime(startTime);
        validateDto.setEndTime(endTime);
        validateDto.setSearchType(searchType);

        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = jsonBuilder.convertObject(validateDto);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);

        // call method validate common
        String token = SecurityUtils.getTokenValue().orElse(null);
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        // Validate commons
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(VALIDATE_FAIL, response.getErrors());
        }
    }

    /**
     * get employees information with searchType = 1
     *
     * @param keyWords keywords perform the search
     * @param langKey User specified language
     * @param idHistoryChoiceList id of employee
     * @param idItemChoiceList id of employee
     * @param historyChoiceIdMap
     * @return information of department
     */
    private List<GetEmployeesSuggestionSubType1> getEmployeesByDepartment(String keyWords, String langKey,
            List<Long> idHistoryChoiceList, List<Long> idItemChoiceList, Map<Long, Long> historyChoiceIdMap) {
        List<GetEmployeesSuggestionSubType1> listDepartmentFinal = new ArrayList<>();

        List<GetEmployeesSuggestionSubType2> listDepartments = departmentsRepositoryCustom.getDepartmentsByKeyWord(keyWords,
                idHistoryChoiceList, idItemChoiceList);
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
            List<EmployeesWithEmployeeDataFormatDTO> employeesDepartments = toEmployeesWithEmployeeDataFormat(
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
     * get employees information with searchType = 3
     *
     * @param keyWords keywords perform the search
     * @param langKey User specified language
     * @return information of group
     */
    private List<GetEmployeesSuggestionSubType5> getEmployeesByGroups(String keyWords, String langKey,
            List<Long> idHistoryChoiceList, List<Long> idItemChoiceList, Map<Long, Long> historyChoiceIdMap) {
        List<GetEmployeesSuggestionSubType5> listGroupFinal = new ArrayList<>();

        List<GetEmployeesSuggestionSubType4> listEmployeesGroups = employeesGroupsRepositoryCustom
                .getGroupsByKeyword(keyWords, idHistoryChoiceList, idItemChoiceList);
        Map<Long, List<Long>> listAffiliatedEmployeeId = new HashMap<>();
        long groupId = 0;
        List<Long> employeeIds;
        GetEmployeesSuggestionSubType5 emSuggesSubType5 = null;
        for (GetEmployeesSuggestionSubType4 emSuggesSubType4 : listEmployeesGroups) {
            if (listAffiliatedEmployeeId.get(emSuggesSubType4.getGroupId()) == null) {
                groupId = emSuggesSubType4.getGroupId();
                emSuggesSubType5 = new GetEmployeesSuggestionSubType5();
                emSuggesSubType5.setGroupId(groupId);
                emSuggesSubType5.setGroupName(emSuggesSubType4.getGroupName());
                emSuggesSubType5.setIsAutoGroup(emSuggesSubType4.getIsAutoGroup());
                listGroupFinal.add(emSuggesSubType5);
                employeeIds = new ArrayList<>();
                if (emSuggesSubType4.getEmployeeId() != null) {
                    employeeIds.add(emSuggesSubType4.getEmployeeId());
                }
                listAffiliatedEmployeeId.put(groupId, employeeIds);
            } else if (emSuggesSubType4.getEmployeeId() != null) {
                listAffiliatedEmployeeId.get(emSuggesSubType4.getGroupId()).add(emSuggesSubType4.getEmployeeId());
            }
        }
        for (Entry<Long, List<Long>> entry : listAffiliatedEmployeeId.entrySet()) {
            List<EmployeesWithEmployeeDataFormatDTO> employeesGroups = new ArrayList<>();
            if (!CollectionUtils.isEmpty(entry.getValue())) {
                employeesGroups = toEmployeesWithEmployeeDataFormat(
                        employeesCommonService.getEmployees(entry.getValue(), null, langKey), true);
            }
            final List<EmployeesWithEmployeeDataFormatDTO> employeesGroupsFinal = employeesGroups;
            listGroupFinal.forEach(group -> {
                if (entry.getKey().equals(group.getGroupId())) {
                    group.setEmployeesGroups(employeesGroupsFinal);
                }
            });
        }
        // Sort id history
        if (!CollectionUtils.isEmpty(idHistoryChoiceList)) {
            Map<Long, GetEmployeesSuggestionSubType5> groupListMap = listGroupFinal.stream()
                    .collect(Collectors.toMap(GetEmployeesSuggestionSubType5::getGroupId, group -> group));
            List<GetEmployeesSuggestionSubType5> groupListSort = new ArrayList<>();
            idHistoryChoiceList.forEach(idHistory -> {
                if (groupListMap.get(idHistory) != null) {
                    GetEmployeesSuggestionSubType5 grInfoDto = groupListMap.get(idHistory);
                    grInfoDto.setIdHistoryChoice(historyChoiceIdMap.get(idHistory));
                    groupListSort.add(grInfoDto);
                }
            });
            listGroupFinal = groupListSort;
        }
        return listGroupFinal;
    }

    /**
     * Call service common to get list TimezonesDTO
     *
     * @param channel - channel to connect service
     * @return - list TimezonesDTO
     */
    private List<TimezonesDTO> getTimezones() {
        String token = SecurityUtils.getTokenValue().orElse(null);
        // Call API getTimezones
        GetTimezonesResponse responseTimezone = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_GET_TIMEZONES, HttpMethod.POST, null, GetTimezonesResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        List<TimezonesDTO> timezones = new ArrayList<>();
        if (responseTimezone != null) {
            responseTimezone.getTimezones().forEach(timezone -> {
                TimezonesDTO dto = new TimezonesDTO();
                dto.setTimezoneId(timezone.getTimezoneId());
                dto.setTimezoneShortName(timezone.getTimezoneShortName());
                dto.setTimezoneName(timezone.getTimezoneName());
                timezones.add(dto);
            });
        }
        return timezones;
    }

    /**
     * Call service common to get list LanguagesDTO
     *
     * @return - list LanguagesDTO
     */
    private List<LanguagesDTO> getLanguages() {
        String token = SecurityUtils.getTokenValue().orElse(null);
        // Call api getLanguages
        GetLanguagesResponse responseLanguage = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_GET_LANGUAGE, HttpMethod.POST, null, GetLanguagesResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        List<LanguagesDTO> languages = new ArrayList<>();
        if (responseLanguage != null) {
            responseLanguage.getLanguagesDTOList().forEach(language -> {
                LanguagesDTO dto = new LanguagesDTO();
                dto.setLanguageId(language.getLanguageId());
                dto.setLanguageName(language.getLanguageName());
                dto.setLanguageCode(language.getLanguageCode());
                languages.add(dto);
            });
        }
        return languages;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getGroupAndDepartmentByEmployeeIds(java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetGroupAndDepartmentByEmployeeIdsOutDTO getGroupAndDepartmentByEmployeeIds(List<Long> employeeIds) {
        // 1..Validate parameter
        if (employeeIds == null) {
            throw new CustomRestException("Param [employeeIds] is not null",
                    CommonUtils.putError(ConstantsEmployees.PARAM_EMPLOYEE_IDS, Constants.RIQUIRED_CODE));
        }
        // 2. Get list of group ID and part ID
        List<GetGroupAndDepartmentDTO> listGroupAndDepartment = employeesRepositoryCustom
                .getListGroupIdAndDepartmentId(employeeIds);
        // 3. Create response data for the API
        GetGroupAndDepartmentByEmployeeIdsOutDTO response = new GetGroupAndDepartmentByEmployeeIdsOutDTO();
        List<GetGroupAndDepartmentByEmployeeIdsSubType1DTO> listData = new ArrayList<>();
        if (listGroupAndDepartment == null) {
            response.setEmployees(listData);
            return response;
        }

        List<Long> employeeIdAdded = new ArrayList<>();
        listGroupAndDepartment.forEach(groupAndDepartment -> {
            Long employeeId = groupAndDepartment.getEmployeeId();
            if (employeeIdAdded.contains(employeeId)) {
                return;
            }
            List<Long> groupIds = new ArrayList<>();
            List<Long> departmentIds = new ArrayList<>();
            listGroupAndDepartment.forEach(dto -> {
                if (!dto.getEmployeeId().equals(employeeId)) {
                    return;
                }
                if (!groupIds.contains(dto.getGroupId()) && dto.getGroupId() != null) {
                    groupIds.add(dto.getGroupId());
                }
                if (!departmentIds.contains(dto.getDepartmentId()) && dto.getDepartmentId() != null) {
                    departmentIds.add(dto.getDepartmentId());
                }
            });
            GetGroupAndDepartmentByEmployeeIdsSubType1DTO employee = new GetGroupAndDepartmentByEmployeeIdsSubType1DTO();
            employee.setEmployeeId(employeeId);
            employee.setEmployeeName(groupAndDepartment.getEmployeeName());
            employee.setGroupIds(groupIds);
            employee.setDepartmentIds(departmentIds);
            employee.setUpdatedDate(groupAndDepartment.getUpdatedDate());
            listData.add(employee);
            employeeIdAdded.add(employeeId);
        });
        response.setEmployees(listData);
        return response;
    }

    /**
     * @throws IOException
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#updateEmployeeStatus(java.lang.Long,
     *      java.lang.Integer, java.time.Instant)
     */
    @Override
    public Long updateEmployeeStatus(Long employeeId, Integer employeeStatus, Instant updatedDate) throws IOException {
        // 1.Validate parameter
        validateParameterUpdateEmployeesStatus(employeeId, employeeStatus);

        // Get employeeId from token
        Long userId = jwtTokenUtil.getEmployeeIdFromToken();
        // 2. check User's authority
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException(NOT_HAVE_PERMISSION,
                    CommonUtils.putError(EMPLOYEE, Constants.USER_NOT_PERMISSION));
        }
        // save data
        this.findOne(employeeId).ifPresentOrElse(empDto -> {
            // check exclusive
            Integer oldStatus = empDto.getEmployeeStatus();
            // 4. Update status
            if (employeeStatus == 0) {
                empDto.setEmployeeStatus(ConstantsEmployees.WORK_STATUS);
            } else {
                empDto.setEmployeeStatus(ConstantsEmployees.NOT_WORK_STATUS);
            }
            empDto.setUpdatedUser(userId);
            this.save(empDto);

            // save to employee_histories
            EmployeesHistoriesDTO employeesHistoriesDTO = emloyeesDTOMapper.toDto(empDto);
            employeesHistoriesDTO.setCreatedUser(userId);
            employeesHistoriesDTO.setUpdatedUser(userId);
            // create content change
            HashMap<String, String> contentChange = new HashMap<>();
            HashMap<String, Integer> oldNewValue = new HashMap<>();
            oldNewValue.put(ConstantsEmployees.OLD_VALUE, oldStatus);
            oldNewValue.put(ConstantsEmployees.NEW_VALUE, employeeStatus);
            try {
                contentChange.put(ConstantsEmployees.EMPLOYEE_STATUS, objectMapper.writeValueAsString(oldNewValue));
                employeesHistoriesDTO.setContentChange(objectMapper.writeValueAsString(contentChange));
            } catch (JsonProcessingException e) {
                throw new CustomException(CONVERT_DATA_ERROR, e);
            }
            employeesHistoriesServiceImpl.save(employeesHistoriesDTO);
        }, () -> {
            throw new CustomRestException("Employee not existed.",
                    CommonUtils.putError(EMPLOYEE, ConstantsEmployees.NOT_EXIST_EMPLOYEE));
        });

        // update cognito user
        Optional<EmployeesDTO> employeeOpt = this.findOne(employeeId);
        if (!employeeOpt.isPresent()) {
            throw new CustomRestException("Employee not existed.",
                    CommonUtils.putError(EMPLOYEE, ConstantsEmployees.NOT_EXIST_EMPLOYEE));
        }
        EmployeesDTO employeesDTO = employeeOpt.get();

        // update cognigto user
        updateCognitoUserInfo(employeesDTO);

        // delete packages if status is resign
        if (ConstantsEmployees.NOT_WORK_STATUS.equals(employeesDTO.getEmployeeStatus())) {
            employeesPackagesRepository.deleteByEmployeeId(employeesDTO.getEmployeeId());
        }

        return employeeId;
    }

    /**
     * updateCognitoUserInfo
     *
     * @param employeesDTO - dto contain info
     */
    private void updateCognitoUserInfo(EmployeesDTO employeesDTO) {
        if (employeesDTO.getEmployeeStatus() != 0) {
            // delete cognito user
            authenticationService.deleteUser(employeesDTO.getEmail(), null, null, true);
            return;
        }

        // generate new password
        String password = getPassword();

        // send mail for account
        sendMailForAccount(employeesDTO, password);

        // create account cognito
        CognitoUserInfo cognitoUser = new CognitoUserInfo();
        createdAccountCoginto(cognitoUser, employeesDTO, password);

        // request create user
        cognitoUser.setIsModifyEmployee(true);
        authenticationService.createNewUser(cognitoUser);
    }

    /**
     * createdAccountCoginto
     *
     * @param cognitoUser - object to fill data
     * @param employeesDTO - dto contain data
     * @param password - the new password
     */
    private void createdAccountCoginto(CognitoUserInfo cognitoUser, EmployeesDTO employeesDTO, String password) {
        cognitoUser.setEmployeeId(employeesDTO.getEmployeeId());
        cognitoUser.setUsername(employeesDTO.getEmail());
        cognitoUser.setPassword(password);
        cognitoUser.setEmail(employeesDTO.getEmail());
        cognitoUser.setEmployeeSurname(employeesDTO.getEmployeeSurname());
        cognitoUser.setEmployeeName(employeesDTO.getEmployeeName());
        cognitoUser.setIsAdmin(employeesDTO.getIsAdmin() != null && employeesDTO.getIsAdmin());
        cognitoUser.setIsAccessContract(false);
        cognitoUser.setUpdatedAt(new Date());
        cognitoUser.setTenantId(TenantContextHolder.getTenant());
        cognitoUser.setCompanyName(getCompanyName(jwtTokenUtil.getTenantIdFromToken()));

        /**
         * set format date
         * 1 : 2001-01-31, 2 : 01-31-2001, 3 : 31-01-2001
         */
        if (employeesDTO.getFormatDateId() == null) {
            cognitoUser.setFormatDate(FOMAT_DATE_YYYY_MM_DD);
        } else {
            switch (employeesDTO.getFormatDateId()) {
            case 1:
                cognitoUser.setFormatDate(FOMAT_DATE_YYYY_MM_DD);
                break;
            case 2:
                cognitoUser.setFormatDate(FOMAT_DATE_MM_DD_YYYY);
                break;
            case 3:
                cognitoUser.setFormatDate(FOMAT_DATE_DD_MM_YYYY);
                break;
            default:
                cognitoUser.setFormatDate(FOMAT_DATE_YYYY_MM_DD);
                break;
            }
        }
        // set timezone
        List<TimezonesDTO> timezones = getTimezones();
        timezones.forEach(timezone -> {
            if (employeesDTO.getTimezoneId() != null && timezone.getTimezoneId().equals(employeesDTO.getLanguageId())) {
                cognitoUser.setTimezoneName(timezone.getTimezoneShortName());
            }
        });

        // set language
        List<LanguagesDTO> languages = getLanguages();
        if (employeesDTO.getLanguageId() != null) {
            languages.forEach(language -> {
                if (employeesDTO.getLanguageId() != null
                        && language.getLanguageId().equals(employeesDTO.getLanguageId())) {
                    cognitoUser.setLanguageCode(language.getLanguageCode());
                }
            });
        }

    }

    /**
     * sendMailForAccount by call mail servie
     *
     * @param employeesDTO - dto contain info
     * @param password - the new password
     */
    private void sendMailForAccount(EmployeesDTO employeesDTO, String password) {
        CreateUserInputDTO createUserInput = new CreateUserInputDTO();
        createUserInput.setEmployeeId(employeesDTO.getEmployeeId());
        createUserInput.setEmployeeName(employeesDTO.getEmployeeName());
        createUserInput.setEmployeeSurname(employeesDTO.getEmployeeSurname());
        createUserInput.setEmail(employeesDTO.getEmail());
        createUserInput.setPassword(password);
        createUserInput.setUserNameImplement(jwtTokenUtil.getEmployeeNameFromToken());
        createUserInput.setTenantName(jwtTokenUtil.getTenantIdFromToken());
        createUserInput.setUserNameImplement(jwtTokenUtil.getEmployeeNameFromToken());
        createUserInput.setCompanyName(getCompanyName(jwtTokenUtil.getTenantIdFromToken()));
        // call sendMail
        try {
            mailService.sendMailForCreateUser(createUserInput);
        } catch (Exception e) {
            log.error(String.format(ConstantsEmployees.COULD_NOT_SEND_MAIL_MESSAGE, e.getLocalizedMessage()), e);
        }
    }

    /**
     * Valdate parameter for API update-employee-status, throw if have issue
     * validate
     *
     * @param employeeId - id of employee
     * @param employeeStatus - new status for employee
     */
    private void validateParameterUpdateEmployeesStatus(Long employeeId, Integer employeeStatus) {
        // validate require parameter
        if (employeeId == null) {
            throw new CustomRestException("Param [employeeId] is not null",
                    CommonUtils.putError(ConstantsEmployees.PARAM_EMPLOYEE_ID, Constants.RIQUIRED_CODE));
        }
        if (employeeStatus == null) {
            throw new CustomRestException("Param [employeeStatus] is not null",
                    CommonUtils.putError(EMPLOYEE_STATUS, Constants.RIQUIRED_CODE));
        }
        // 2. Validate commons
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsEmployees.PARAM_EMPLOYEE_ID, employeeId);
        String validateJson = jsonBuilder.build(FieldBelong.EMPLOYEE.getValue(), fixedParams, new HashMap<>());

        validateCommon(validateJson);
    }

    /**
     * @see EmployeesService#getAllEmployeeId()
     */
    @Override
    public List<Long> getAllEmployeeId() {
        return employeesRepository.findAllId();
    }

    /**
     * Get field map from list Field
     *
     * @param fieldsList
     * @return
     */
    private Map<Long, CustomFieldsInfoOutDTO> getFieldMap(List<CustomFieldsInfoOutDTO> fieldsList) {
        Map<Long, CustomFieldsInfoOutDTO> fieldInfoMap = new HashMap<>();
        fieldsList.stream().forEach(fieldInfo -> fieldInfoMap.put(fieldInfo.getFieldId(), fieldInfo));
        return fieldInfoMap;
    }

    /**
     * delete relation
     *
     * @param employeeId
     * @param fieldName
     * @param recordId
     * @param isDelete
     * @param lstOldData
     * @param lstNewData
     * @return
     */
    @SuppressWarnings("unchecked")
    private EmployeesDTO deleteOrAddRelation(Long employeeId, String fieldName, Long recordId, boolean isDelete,
                                             List<EmployeesDTO> lstOldData, List<EmployeesDTO> lstNewData) {
        EmployeesDTO employeesDTOUpdate = null;
        if (StringUtil.isEmpty(TransIDHolder.getTransID())) {
            Optional<EmployeesDTO> employeeDto = this.findOne(employeeId);
            if (employeeDto.isPresent()) {
                employeesDTOUpdate = employeeDto.get();
            }
        } else {
            employeesDTOUpdate = tmsService.findOneEmployeeDTO(employeeId, TransIDHolder.getTransID());
        }
        if (employeesDTOUpdate == null) {
            return null;
        }
        String employeeData = "";
        lstOldData.add(employeesMapper.clone(employeesDTOUpdate));
        employeeData = employeesDTOUpdate.getEmployeeData();
        Map<String, Object> employeeDataMap = new HashMap<>();
        try {
            if (StringUtil.isEmpty(employeeData)) {
                employeeData = "{}";
            }
            TypeReference<Map<String, Object>> mapTypeRef = new TypeReference<>() {};
            employeeDataMap = objectMapper.readValue(employeeData, mapTypeRef);
        } catch (IOException e) {
            return null;
        }

        Object relationObject = employeeDataMap.get(fieldName);
        List<Double> relationData;
        if (relationObject == null || StringUtil.isEmpty(relationObject.toString())) {
            relationData = new ArrayList<>();
        } else {
            relationData = gson.fromJson(relationObject.toString(), List.class);
        }
        List<Long> relationDataNew = new ArrayList<>();
        // Delete relation
        if (isDelete) {
            for (int i = 0; i < relationData.size(); i++) {
                if (relationData.get(i).longValue() != recordId) {
                    relationDataNew.add(relationData.get(i).longValue());
                }
            }
        } else {
            // Add relation
            for (int i = 0; i < relationData.size(); i++) {
                relationDataNew.add(relationData.get(i).longValue());
            }
            relationDataNew.add(recordId);
        }
        employeeDataMap.put(fieldName, relationDataNew);
        employeesDTOUpdate.setEmployeeData(gson.toJson(employeeDataMap));
        lstNewData.add(employeesMapper.clone(employeesDTOUpdate));
        return employeesDTOUpdate;
    }

    /**
     * Validate parameter
     *
     * @param recordId
     * @param relationDataInfos
     */
    private void validateUpdateRelationData(Long recordId, List<RelationDataInfosInDTO> relationDataInfos) {
        // recordId
        if (recordId == null) {
            throw new CustomRestException("parameter[recordId] is null",
                    CommonUtils.putError("recordId", Constants.RIQUIRED_CODE));
        }

        // relationDataInfos
        if (relationDataInfos == null) {
            throw new CustomRestException("parameter[relationDataInfos] is null",
                    CommonUtils.putError("relationDataInfos", Constants.RIQUIRED_CODE));
        }

        relationDataInfos.forEach(relationData -> {
            if (relationData.getFieldId() == null) {
                throw new CustomRestException("parameter[fieldId] is null",
                        CommonUtils.putError("fieldId", Constants.RIQUIRED_CODE));
            }
            if (relationData.getOldRecordIds() == null) {
                throw new CustomRestException("parameter[oldRecordIds] is null",
                        CommonUtils.putError("oldRecordIds", Constants.RIQUIRED_CODE));
            }
            if (relationData.getNewRecordIds() == null) {
                throw new CustomRestException("parameter[newRecordIds] is null",
                        CommonUtils.putError("newRecordIds", Constants.RIQUIRED_CODE));
            }
        });
    }

    /*
     * @see jp.co.softbrain.esales.products.service.ProductsService#
     * updateRelationData(java.lang.Long, java.util.List)
     */
    @Override
    @Transactional
    public List<Long> updateRelationData(Long recordId, List<RelationDataInfosInDTO> relationDataInfos) {
        // 1.Validate parameter
        validateUpdateRelationData(recordId, relationDataInfos);

        // 2. Get the Relation item information
        List<Long> fieldIds = new ArrayList<>();
        relationDataInfos.forEach(relationDataInfo -> fieldIds.add(relationDataInfo.getFieldId()));
        String token = SecurityUtils.getTokenValue().orElse(null);

        GetCustomFieldsInfoByFieldIdsRequest request = new GetCustomFieldsInfoByFieldIdsRequest();
        request.setFieldIds(fieldIds);
        final List<CustomFieldsInfoOutDTO> fieldsList = new ArrayList<>();
        CommonFieldInfoResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.ApiUrl.Commons.GET_CUSTOM_FIELDS_INFO_BY_FIELD_ID, HttpMethod.POST, request, CommonFieldInfoResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (response != null && response.getCustomFieldsInfo() != null) {
            fieldsList.addAll(response.getCustomFieldsInfo());
        }

        // 3. Repeating in array [relationDataInfos]
        List<EmployeesDTO> lstOldDataDelete = new ArrayList<>();
        List<EmployeesDTO> lstNewDataDelete = new ArrayList<>();
        List<EmployeesDTO> lstOldDataAdd = new ArrayList<>();
        List<EmployeesDTO> lstNewDataAdd = new ArrayList<>();
        List<EmployeesDTO> listEmployeeDTOUpdate = new ArrayList<>();
        Map<Long, CustomFieldsInfoOutDTO> fieldInfoMap = getFieldMap(fieldsList);
        relationDataInfos.forEach(relationDataInfo -> {

            CustomFieldsInfoOutDTO field = fieldInfoMap.get(relationDataInfo.getFieldId());
            if (field == null) {
                return;
            }

            // 4. Delete previous relation
            relationDataInfo.getOldRecordIds().forEach(
                    oldRecordId -> listEmployeeDTOUpdate.add(deleteOrAddRelation(oldRecordId, field.getFieldName(),
                            recordId, true, lstOldDataDelete, lstNewDataDelete)));

            // In case of a single relation (relationData.format = 1), step 5
            if (field.getRelationData() != null && 1 == field.getRelationData().getFormat() && !CollectionUtils.isEmpty(relationDataInfo.getNewRecordIds())) {
                // 5. Check the Relation value
                List<Long> employeeIdsRealtion = null;
                if (StringUtil.isEmpty(TransIDHolder.getTransID())) {
                    employeeIdsRealtion = employeesRepositoryCustom
                    .getEmployeeIdsCreatedRelation(Arrays.asList(field), relationDataInfo.getNewRecordIds());
                } else {
                    employeeIdsRealtion = tmsService.getEmployeeIdsCreatedRelation(Arrays.asList(field),
                            relationDataInfo.getNewRecordIds(), TransIDHolder.getTransID());
                }
                if (employeeIdsRealtion != null && !employeeIdsRealtion.isEmpty()) {
                    throw new CustomRestException("Error data relation single", CommonUtils
                            .putError(String.valueOf(field.getFieldId()), ConstantsEmployees.ERR_RELATION_DATA));
                }
            }

            // 6. Add more data relations to the record
            relationDataInfo.getNewRecordIds()
                    .forEach(newRecordId -> listEmployeeDTOUpdate.add(deleteOrAddRelation(newRecordId,
                            field.getFieldName(), recordId, false, lstOldDataAdd, lstNewDataAdd)));
        });

        List<Employees> employeesUpdate = employeesRepository.saveAll(employeesMapper.toEntity(listEmployeeDTOUpdate));

        List<Long> updateRecordIds = new ArrayList<>();
        updateRecordIds.addAll(employeesUpdate.stream().map(Employees::getEmployeeId).collect(Collectors.toList()));

        // Insert history
        insertHistoryRelation(lstOldDataDelete, lstNewDataDelete, lstOldDataAdd, lstNewDataAdd);
        return updateRecordIds;
    }

    /**
     * Insert history for relation
     *
     * @param lstOldDataDelete
     * @param lstNewDataDelete
     * @param lstOldDataAdd
     * @param lstNewDataAdd
     */
    private void insertHistoryRelation(List<EmployeesDTO> lstOldDataDelete, List<EmployeesDTO> lstNewDataDelete,
            List<EmployeesDTO> lstOldDataAdd, List<EmployeesDTO> lstNewDataAdd) {
        List<Map<String, EmployeesDTO>> historyDataList = new ArrayList<>();
        // List product delete and add relations
        lstOldDataDelete.forEach(oldData -> lstNewDataAdd.forEach(newData -> {
            if (oldData.getEmployeeId() != 0 && newData.getEmployeeId() != 0
                    && oldData.getEmployeeId().equals(newData.getEmployeeId())) {
                Map<String, EmployeesDTO> histotyMap = new HashMap<>();
                histotyMap.put(HISTORY_OLD_DATA, oldData);
                histotyMap.put(HISTORY_NEW_DATA, newData);
                historyDataList.add(histotyMap);
            }
        }));

        // List product delete relation
        lstOldDataDelete.forEach(oldData -> lstNewDataDelete.forEach(newData -> {
            if (oldData.getEmployeeId() != 0L && newData.getEmployeeId() != 0L
                    && oldData.getEmployeeId().equals(newData.getEmployeeId())) {
                Map<String, EmployeesDTO> histotyMap = new HashMap<>();
                histotyMap.put(HISTORY_OLD_DATA, oldData);
                histotyMap.put(HISTORY_NEW_DATA, newData);
                historyDataList.add(histotyMap);
            }
        }));

        // List product add relation
        lstOldDataAdd.forEach(oldData -> lstNewDataAdd.forEach(newData -> {
            if (oldData.getEmployeeId() != 0L && newData.getEmployeeId() != 0L
                    && oldData.getEmployeeId().equals(newData.getEmployeeId())) {
                Map<String, EmployeesDTO> histotyMap = new HashMap<>();
                histotyMap.put(HISTORY_OLD_DATA, oldData);
                histotyMap.put(HISTORY_NEW_DATA, newData);
                historyDataList.add(histotyMap);
            }
        }));

        if (!historyDataList.isEmpty()) {
            insertEmployeeHistoryRelation(historyDataList);
        }
    }

    /**
     * Insert history employee
     *
     * @param historyDataList
     */
    private void insertEmployeeHistoryRelation(List<Map<String, EmployeesDTO>> historyDataList) {
        List<EmployeesHistories> employeesHistoriesList = new ArrayList<>();
        historyDataList.stream().forEach(itemData -> {
            EmployeesDTO oldData = itemData.get(HISTORY_OLD_DATA);
            EmployeesDTO newData = itemData.get(HISTORY_NEW_DATA);
            Map<String, Object> contentChange = new HashMap<>();
            setOldNewData(contentChange, ConstantsEmployees.COLUMN_NAME_EMPLOYEE_DATA, oldData.getEmployeeData(),
                    newData.getEmployeeData());
            EmployeesHistoriesDTO employeesHistoriesDTO = emloyeesDTOMapper.toDto(newData);
            try {
                employeesHistoriesDTO.setContentChange(objectMapper.writeValueAsString(contentChange));
            } catch (JsonProcessingException e) {
                log.error(e.getLocalizedMessage());
            }
            employeesHistoriesList.add(employeesHistoriesMapper.toEntity(employeesHistoriesDTO));
        });
        if (!employeesHistoriesList.isEmpty()) {
            employeesHistoriesRepository.saveAll(employeesHistoriesList);
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getEmployeeForSyncSchedules()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesDTO> getEmployeeForSyncSchedules() {
        // 1. Get employees list
        return employeesMapper.toDto(employeesRepository.findAllByEmployeeStatusAndEmail());
    }

    /**
     * send rest call to update relation data of related service
     *
     * @param oldDynamicData dynamic data before update
     * @param newDynamicDataString dynamic data after update
     * @param fields field info of service
     * @param recordId id of record which is getting updated
     */
    public void updateRelationData(Map<String, Object> oldDynamicData, String newDynamicDataString,
            List<CustomFieldsInfoOutDTO> fields, Long recordId) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> newEmployeeData = new HashMap<>();
        if (StringUtils.isNotBlank(newDynamicDataString)) {
            try {
                TypeReference<Map<String, Object>> typeRef = new TypeReference<Map<String, Object>>() {};
                newEmployeeData = mapper.readValue(newDynamicDataString, typeRef);
            } catch (IOException e) {
                return;
            }
        }
        updateRelationData(oldDynamicData, newEmployeeData, fields, recordId);
    }

    /**
     * send rest call to update relation data of related service
     *
     * @param oldDynamicData dynamic data before update
     * @param newDynamicDataString dynamic data after update
     * @param fields field info of service
     * @param recordId id of record which is getting updated
     */
    public <T extends KeyValue> void updateRelationData(Map<String, Object> oldDynamicData,
            List<T> newDynamicDataKeyVal, List<CustomFieldsInfoOutDTO> fields, Long recordId) {
        Map<String, Object> newEmployeeData = new HashMap<>();
        if (newDynamicDataKeyVal != null && !newDynamicDataKeyVal.isEmpty()) {
            newEmployeeData = newDynamicDataKeyVal.stream()
                    .collect(Collectors.toMap(KeyValue::getKey, KeyValue::getValue));
        }
        updateRelationData(oldDynamicData, newEmployeeData, fields, recordId);
    }

    /**
     * send rest call to update relation data of related service
     *
     * @param oldDynamicData dynamic data before update
     * @param newDynamicDataString dynamic data after update
     * @param fields field info of service
     * @param recordId id of record which is getting updated
     */
    public <T extends KeyValue> void updateRelationData(String oldDynamicDataString, List<T> newDynamicDataKeyVal,
            List<CustomFieldsInfoOutDTO> fields, Long recordId) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> oldEmployeeData = new HashMap<>();
        if (StringUtils.isNotBlank(oldDynamicDataString)) {
            TypeReference<Map<String, Object>> typeRef = new TypeReference<Map<String, Object>>() {};
            try {
                oldEmployeeData = mapper.readValue(oldDynamicDataString, typeRef);
            } catch (IOException e) {
                return;
            }
        }
        updateRelationData(oldEmployeeData, newDynamicDataKeyVal, fields, recordId);
    }

    /**
     * send rest call to update relation data of related service
     *
     * @param oldDynamicData dynamic data before update
     * @param newDynamicDataString dynamic data after update
     * @param fields field info of service
     * @param recordId id of record which is getting updated
     */
    public void updateRelationData(Map<String, Object> oldDynamicData, Map<String, Object> newDynamicData,
            List<CustomFieldsInfoOutDTO> fields, Long recordId) {
        if (oldDynamicData == null) {
            oldDynamicData = new HashMap<>();
        }
        if (newDynamicData == null) {
            newDynamicData = new HashMap<>();
        }
        ObjectMapper mapper = new ObjectMapper();
        Map<Integer, UpdateRelationDataRequest> requestsMap = new HashMap<>();
        List<String> processedField = new ArrayList<>();
        Map<String, CustomFieldsInfoOutDTO> fieldsmap = fields.stream()
                .collect(Collectors.toMap(CustomFieldsInfoOutDTO::getFieldName, f -> f));
        TypeReference<ArrayList<Long>> listTypeReference = new TypeReference<ArrayList<Long>>() {};
        for (Map.Entry<String, Object> newData : newDynamicData.entrySet()) {
            CustomFieldsInfoOutDTO fieldInfo = fieldsmap.get(newData.getKey());
            if (fieldInfo == null || !fieldInfo.getFieldName().startsWith(FieldTypeEnum.RELATION.getName())
                    || (fieldInfo.getRelationData().getAsSelf() != null
                            && fieldInfo.getRelationData().getAsSelf() == 1)) {
                continue;
            }
            processedField.add(fieldInfo.getFieldName());
            List<Long> newIdsList = new ArrayList<>();
            List<Long> oldIdsList = new ArrayList<>();
            List<Long> newRecordIds = new ArrayList<>();
            List<Long> oldRecordIds = new ArrayList<>();
            String newValStr = StringUtil.safeCastToString(newData.getValue());
            if (StringUtils.isNotBlank(newValStr)) {
                try {
                    newIdsList = mapper.readValue(newValStr, listTypeReference);
                } catch (IOException e) {
                    throw new CustomException(e.getLocalizedMessage());
                }
            }
            String oldValStr = StringUtil.safeCastToString(oldDynamicData.get(newData.getKey()));
            if (StringUtils.isNotBlank(oldValStr)) {
                try {
                    oldIdsList = mapper.readValue(oldValStr, listTypeReference);
                } catch (IOException e) {
                    throw new CustomException(e.getLocalizedMessage());
                }
            }
            for (int i = 0; i < newIdsList.size(); i++) {
                if (!oldIdsList.contains(newIdsList.get(i))) {
                    newRecordIds.add(newIdsList.get(i));
                }
            }
            for (int i = 0; i < oldIdsList.size(); i++) {
                if (!newIdsList.contains(oldIdsList.get(i))) {
                    oldRecordIds.add(oldIdsList.get(i));
                }
            }
            if (!newRecordIds.isEmpty() || !oldRecordIds.isEmpty()) {
                RelationDataInfosInDTO relationDataInfos = new RelationDataInfosInDTO();
                relationDataInfos.setFieldId(fieldInfo.getRelationData().getFieldId());
                relationDataInfos.setNewRecordIds(newRecordIds);
                relationDataInfos.setOldRecordIds(oldRecordIds);
                UpdateRelationDataRequest requestBuilder = requestsMap
                        .get(fieldInfo.getRelationData().getFieldBelong());
                if (requestBuilder == null) {
                    requestBuilder = new UpdateRelationDataRequest();
                    requestBuilder.setRecordId(recordId);
                    requestBuilder.setTransID(TransIDHolder.getTransID());
                    requestsMap.put(fieldInfo.getRelationData().getFieldBelong(), requestBuilder);
                }
                requestBuilder.getRelationDataInfos().add(relationDataInfos);
            }
        }

        for (Map.Entry<String, Object> oldData : oldDynamicData.entrySet()) {
            CustomFieldsInfoOutDTO fieldInfo = fieldsmap.get(oldData.getKey());
            if (fieldInfo == null || processedField.contains(oldData.getKey())
                    || !fieldInfo.getFieldName().startsWith(FieldTypeEnum.RELATION.getName())
                    || (fieldInfo.getRelationData().getAsSelf() != null
                            && fieldInfo.getRelationData().getAsSelf() == 1)) {
                continue;
            }
            List<Long> oldRecordIds = new ArrayList<>();
            String oldValStr = StringUtil.safeCastToString(oldData.getValue());
            if (StringUtils.isNotBlank(oldValStr)) {
                try {
                    oldRecordIds = mapper.readValue(oldValStr, listTypeReference);
                } catch (IOException e) {
                    throw new CustomException(e.getLocalizedMessage());
                }
            }
            if (oldRecordIds != null && !oldRecordIds.isEmpty()) {
                RelationDataInfosInDTO relationDataInfos = new RelationDataInfosInDTO();
                relationDataInfos.setFieldId(fieldInfo.getRelationData().getFieldId());
                relationDataInfos.setOldRecordIds(oldRecordIds);
                UpdateRelationDataRequest requestBuilder = requestsMap
                        .get(fieldInfo.getRelationData().getFieldBelong());
                if (requestBuilder == null) {
                    requestBuilder = new UpdateRelationDataRequest();
                    requestBuilder.setRecordId(recordId);
                    requestsMap.put(fieldInfo.getRelationData().getFieldBelong(), requestBuilder);
                }
                requestBuilder.getRelationDataInfos().add(relationDataInfos);
            }
        }

        for (Map.Entry<Integer, UpdateRelationDataRequest> request : requestsMap.entrySet()) {
            if (FieldBelongEnum.EMPLOYEE.getCode().equals(request.getKey())) {
                this.updateRelationData(request.getValue().getRecordId(), request.getValue().getRelationDataInfos());
            } else {
                request.getValue().setTransID(TransIDHolder.getTransID());
                UpdateRelationDataResponse relationRes = RelationUtil.callUpdateRelationData(restOperationUtils,
                        request.getValue(), request.getKey(), SecurityUtils.getTokenValue().orElse(null),
                        jwtTokenUtil.getTenantIdFromToken());
                if (relationRes != null && relationRes.getErrorAttributes() != null
                        && !relationRes.getErrorAttributes().isEmpty()) {
                    CustomRestException ex = new CustomRestException();
                    ex.setExtensions(relationRes.getErrorAttributes());
                    throw ex;
                }
            }
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getEmployeeSuggestionsGlobal(java.lang.String,
     *      java.lang.Long, java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetEmployeeSuggestionsGlobalResponse getEmployeeSuggestionsGlobal(String searchValue, Long limit,
            Long offSet) {
        GetEmployeeSuggestionsGlobalResponse response = new GetEmployeeSuggestionsGlobalResponse();
        // 1. Validate Parameter
        if (searchValue == null) {
            throw new CustomRestException("Param [searchValue] is null.",
                    CommonUtils.putError(SEARCH_VALUE_PARAM, Constants.RIQUIRED_CODE));
        }
        // 2. Call API getDataElasticSearch
        // 2.1 Create parameter to search employee from elasticsearch
        SelectEmployeeElasticsearchInDTO inDto = new SelectEmployeeElasticsearchInDTO();
        List<SearchItem> searchOrConditions = new ArrayList<>();
        SearchItem searchItem = new SearchItem();

        searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
        searchItem.setSearchType(String.valueOf(SearchTypeEnum.LIKE));
        searchItem.setSearchOption(String.valueOf(SearchOptionEnum.OR));
        searchItem.setFieldName(ConstantsEmployees.EMPLOYEE_FULL_NAME_FIELD);
        searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
        searchItem.setFieldValue(searchValue);
        searchOrConditions.add(searchItem);

        searchItem = new SearchItem();
        searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
        searchItem.setSearchType(String.valueOf(SearchTypeEnum.LIKE));
        searchItem.setSearchOption(String.valueOf(SearchOptionEnum.OR));
        searchItem.setFieldName(ConstantsEmployees.EMPLOYEE_FULL_NAME_KANA_FIELD);
        searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
        searchItem.setFieldValue(searchValue);
        searchOrConditions.add(searchItem);

        searchItem = new SearchItem();
        searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
        searchItem.setSearchType(String.valueOf(SearchTypeEnum.FIRST_MATCH));
        searchItem.setSearchOption(String.valueOf(SearchOptionEnum.OR));
        searchItem.setFieldName(COLUMN_NAME_TELEPHONE_NUMBER);
        searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
        searchItem.setFieldValue(searchValue);
        searchOrConditions.add(searchItem);

        searchItem = new SearchItem();
        searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
        searchItem.setSearchType(String.valueOf(SearchTypeEnum.FIRST_MATCH));
        searchItem.setSearchOption(String.valueOf(SearchOptionEnum.OR));
        searchItem.setFieldName(COLUMN_NAME_CELLPHONE_NUMBER);
        searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
        searchItem.setFieldValue(searchValue);
        searchOrConditions.add(searchItem);

        searchItem = new SearchItem();
        searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
        searchItem.setSearchType(String.valueOf(SearchTypeEnum.LIKE));
        searchItem.setSearchOption(String.valueOf(SearchOptionEnum.OR));
        searchItem.setFieldName(ConstantsEmployees.DEPARTMENT_NAME_FIELD);
        searchItem.setFieldValue(searchValue);
        searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
        searchOrConditions.add(searchItem);

        searchItem = new SearchItem();
        searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
        searchItem.setSearchType(String.valueOf(SearchTypeEnum.LIKE));
        searchItem.setSearchOption(String.valueOf(SearchOptionEnum.OR));
        searchItem.setFieldName(ConstantsEmployees.POSITION_NAME_FIELD);
        searchItem.setFieldValue(searchValue);
        searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
        searchOrConditions.add(searchItem);

        searchItem = new SearchItem();
        searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
        searchItem.setSearchType(String.valueOf(SearchTypeEnum.LIKE));
        searchItem.setSearchOption(String.valueOf(SearchOptionEnum.OR));
        searchItem.setFieldName(ConstantsEmployees.EMAIL_FIELD);
        searchItem.setFieldValue(searchValue);
        searchItem.setIsDefault(Constants.Elasticsearch.TRUE_VALUE);
        searchOrConditions.add(searchItem);

        inDto.setSearchOrConditions(searchOrConditions);
        inDto.setColumnId(ConstantsEmployees.EMPLOYEE_ID);

        SelectDetailElasticSearchResponse responseElasticSearch = employeesCommonService
                .getEmployeesElasticsearch(inDto);
        // get employee_id list from elastic search result
        List<Long> employeeIdsElastic = new ArrayList<>();
        if (responseElasticSearch != null && !responseElasticSearch.getDataElasticSearch().isEmpty()) {
            response.setTotalRecord(responseElasticSearch.getTotal());
            responseElasticSearch.getDataElasticSearch().forEach(row -> row.getRow().forEach(item -> {
                if (item.getKey().equals(ConstantsEmployees.EMPLOYEE_ID)) {
                    employeeIdsElastic.add(Double.valueOf(item.getValue()).longValue());
                }
            }));
        }

        // 3. Get employee information
        SearchConditionsDTO searchCondition = new SearchConditionsDTO();
        searchCondition.setSearchConditions(new ArrayList<>());
        searchCondition.setFilterType(new ArrayList<>());
        List<KeyValue> orderBy = new ArrayList<>();
        KeyValue keyOrderBy = new KeyValue("employee_name", "ASC");
        orderBy.add(keyOrderBy);
        searchCondition.setOrderBy(orderBy);
        searchCondition.setElasticResultIds(employeeIdsElastic);
        response.setTotalRecord(getTotalEmployees(searchCondition, null));

        searchCondition.setOffset(offSet);
        searchCondition.setLimit(limit);
        List<GetEmpSugGlobalOutDTO> empOutDTOList = new ArrayList<>();
        if (response.getTotalRecord() > 0) {
            List<EmployeeInfoDTO> empInfoList = getEmployees(searchCondition, false, null);
            empOutDTOList = convertEmployeeInfoList(empInfoList);
        }
        response.setEmployees(empOutDTOList);

        return response;
    }

    /**
     * convert data to response dto
     *
     * @param empInfoList
     * @return list employee Info
     */
    private List<GetEmpSugGlobalOutDTO> convertEmployeeInfoList(List<EmployeeInfoDTO> empInfoList) {
        List<GetEmpSugGlobalOutDTO> empOutDTOList = new ArrayList<>();
        empInfoList.forEach(empInfo -> {
            GetEmpSugGlobalOutDTO empOutDTO = new GetEmpSugGlobalOutDTO();
            empOutDTO.setEmployeeId(empInfo.getEmployeeId());
            empOutDTO.setEmployeePhoto(empInfo.getEmployeeIcon());
            empOutDTO.setEmployeeDepartments(empInfo.getEmployeeDepartments());
            empOutDTO.setEmployeeSurname(empInfo.getEmployeeSurname());
            empOutDTO.setEmployeeName(empInfo.getEmployeeName());
            empOutDTO.setEmployeeFullName(
                    StringUtil.getFullName(empInfo.getEmployeeSurname(), empInfo.getEmployeeName()));
            empOutDTOList.add(empOutDTO);
        });
        return empOutDTOList;
    }

    /**
     * Get format date of employee login
     *
     * @return String format date
     */
    public String getFormatDate() {
        String formatDate = servletRequest.getHeader(ConstantsEmployees.EMPLOYEE_FORMAT_DATE);
        if (StringUtil.isEmpty(formatDate)) {
            formatDate = jwtTokenUtil.getFormatDateFromToken();
        }
        if (StringUtil.isEmpty(formatDate)) {
            formatDate = ConstantsEmployees.APP_DATE_FORMAT_ES;
        }
        return formatDate;
    }

    /**
     * get relation data
     *
     * @param fieldName
     * @return
     */
    public List<FieldInfo> getRealationData(String fieldName) {
        return fieldInfoRepository.getRealationData(fieldName);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#
     * updateSettingEmployee(
     * jp.co.softbrain.esales.employees.web.rest.vm.request.
     * UpdateSettingEmployeeRequest)
     */
    @Override
    @Transactional
    public Long updateSettingEmployee(UpdateSettingEmployeeRequest request) {
        Long languageId = request.getLanguageId();
        Long timezoneId = request.getTimezoneId();
        Integer formatDateId = request.getFormatDateId();

        // 0. Get employeeId from token
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();

        // 0.1 get-date format
        String formatDate = getFormatDate();

        // 1. validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> customParams = new HashMap<>();
        customParams.put(EMPLOYEE_LANGUAGE, languageId);
        customParams.put("timezoneId", timezoneId);

        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put("formatDateId", formatDateId);

        String validateJson = jsonBuilder.build(FieldBelong.EMPLOYEE.getValue(), fixedParams, customParams, formatDate);

        String token = SecurityUtils.getTokenValue().orElse(null);
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, response.getErrors());
        }

        // 2. get employee before update
        EmployeesDTO employeesDTO = this.findOne(employeeId)
                .orElseThrow(() -> new CustomRestException("Employee not exist.",
                        CommonUtils.putError(EMPLOYEE, ConstantsEmployees.NOT_EXIST_EMPLOYEE)));
        try {
            EmployeesDTO employeesDTOUpdate = employeesMapper.clone(employeesDTO);
            employeesDTOUpdate.setLanguageId(languageId);
            employeesDTOUpdate.setTimezoneId(timezoneId);
            employeesDTOUpdate.setFormatDateId(formatDateId);
            // 3. update employee
            save(employeesDTOUpdate);

            boolean hasChange = false;
            CognitoUserInfo cognitoUser = new CognitoUserInfo();
            Map<String, Object> contentChange = new HashMap<>();
            if (languageId != null && !languageId.equals(employeesDTO.getLanguageId())) {
                setOldNewDataObject(contentChange, ConstantsEmployees.COLUMN_NAME_LANGUAGE_ID,
                        employeesDTO.getLanguageId(), employeesDTOUpdate.getLanguageId());
                cognitoUser.setLanguageCode(request.getLanguageCode());
                hasChange = true;
            }

            if (timezoneId != null && !timezoneId.equals(employeesDTO.getTimezoneId())) {
                setOldNewDataObject(contentChange, ConstantsEmployees.COLUMN_NAME_TIMEZONE_ID,
                        employeesDTO.getTimezoneId(), employeesDTOUpdate.getTimezoneId());
                cognitoUser.setTimezoneName(request.getTimezoneName());
                hasChange = true;
            }

            if (formatDateId != null && !formatDateId.equals(employeesDTO.getFormatDateId())) {
                setOldNewDataObject(contentChange, ConstantsEmployees.COLUMN_NAME_FORMAT_DATE_ID,
                        employeesDTO.getFormatDateId(), employeesDTOUpdate.getFormatDateId());
                cognitoUser.setFormatDate(request.getFormatDate());
                hasChange = true;
            }

            EmployeesHistoriesDTO employeesHistoriesDTO = emloyeesDTOMapper.toDto(employeesDTOUpdate);
            employeesHistoriesDTO.setContentChange(objectMapper.writeValueAsString(contentChange));

            // 4. insert data history
            employeesHistoriesServiceImpl.save(employeesHistoriesDTO);

            if (hasChange) {
                // update cognito user
                cognitoUser.setUsername(employeesDTOUpdate.getEmail());
                authenticationService.updateUserAttributes(cognitoUser, null);
            }

            return employeeId;
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
            throw new CustomRestException("Update setting employee failed.",
                    CommonUtils.putError("update_setting_employee", Constants.UPDATE_FAILED));
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#sendMailForUsers(java.util.List)
     */
    @Override
    public SendMailForUsersResponseDTO sendMailForUsers(List<Long> employeeIds) {

        SendMailForUsersResponseDTO sendMailForUsersResponseDTO = new SendMailForUsersResponseDTO();
        if (CollectionUtils.isEmpty(employeeIds)) {
            return sendMailForUsersResponseDTO;
        }
        // get infomation of employee
        List<Employees> employees = employeesRepository.findAllWithEmployeeIds(employeeIds);
        List<Long> errorSendMail = employees.stream().map(Employees::getEmployeeId)
                .filter(id -> !employeeIds.contains(id)).collect(Collectors.toList());

        List<SendMailUserResponseDTO> listMailResult = new ArrayList<>();
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        String companyName = getCompanyName(tenantName);
        String employeeNameFromToken = jwtTokenUtil.getEmployeeNameFromToken();

        // check user
        employees.forEach(employee -> {
            String userName = employee.getEmail();
            String newPass = getPassword();
            // set new password for user
            authenticationService.adminChangePassword(userName, newPass);
            // send mail for user
            CreateUserInputDTO createUserInputDTO = new CreateUserInputDTO();
            createUserInputDTO.setEmployeeName(employee.getEmployeeName());
            createUserInputDTO.setCompanyName(companyName);
            createUserInputDTO.setTenantName(tenantName);
            createUserInputDTO.setEmail(employee.getEmail());
            createUserInputDTO.setPassword(newPass);
            createUserInputDTO.setEmployeeSurname(employee.getEmployeeSurname());
            createUserInputDTO.setUserNameImplement(employeeNameFromToken);

            SendMailUserResponseDTO sendMailResult = new SendMailUserResponseDTO();
            sendMailResult.setEmployeeId(employee.getEmployeeId());
            sendMailResult.setUserName(employee.getEmail());
            try {
                mailService.sendMailForCreateUser(createUserInputDTO);
            } catch (Exception e) {
                sendMailResult.setSendMailSuccess(false);
                errorSendMail.add(employee.getEmployeeId());
            }
            listMailResult.add(sendMailResult);
        });
        sendMailForUsersResponseDTO.setListSendMailResponse(listMailResult);
        sendMailForUsersResponseDTO.setErrorSendMail(errorSendMail);
        return sendMailForUsersResponseDTO;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#updateDisplayFirstScreen(Long
     *      ,Boolean)
     */
    @Override
    public UpdateDisplayFirstScreenResponse updateDisplayFirstScreen(Long employeeId, Boolean isDisplayFirstScreen,
            Instant updatedDate) {
        UpdateDisplayFirstScreenResponse response = new UpdateDisplayFirstScreenResponse();
        // 1.Validate parameter
        if (employeeId == null) {
            throw new CustomRestException(CHECK_EXIST_EMPLOYEE_ID,
                    CommonUtils.putError(EMPLOYEE_ID, ConstantsEmployees.RIQUIRED_CODE));
        }
        if (isDisplayFirstScreen == null) {
            throw new CustomRestException(CHECK_IS_DISPLAY_FIRST_SCREEN,
                    CommonUtils.putError(IS_DISPLAY_FIRST_SCREEN, ConstantsEmployees.RIQUIRED_CODE));
        }
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(EMPLOYEE_ID, employeeId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        validateCommon(validateJson);
        // 2. Update first state to employee system
        this.findOne(employeeId)
                .ifPresentOrElse(employeesDTO -> {
                    employeesDTO.setIsDisplayFirstScreen(isDisplayFirstScreen);
                    employeesDTO.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                    employeesDTO.setUpdatedDate(employeesDTO.getUpdatedDate());
                    response.setEmployeeId(this.save(employeesDTO).getEmployeeId());
                }, () -> {
                    throw new CustomRestException(EXCLUSIVE,
                            CommonUtils.putError(UPDATED_DATE_FIELD, Constants.EXCLUSIVE_CODE));
                });
        // 3. create response
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getEmployeeIds(List)
     */
    @Override
    public List<EmployeeNameDTO> getEmployeeIds(List<String> employeeNames) {
        List<EmployeeNameDTO> employees = new ArrayList<>();
        // 1. Get employee's id
        if (!CollectionUtils.isEmpty(employeeNames)) {
            employees = employeesRepositoryCustom.getEmployeesByFullNames(employeeNames);
        }
        // 2. Create response
        return employees;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getEmployeeByTenant(java.util.List,
     *      java.util.List, java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public EmployeeOutDTO getEmployeeByTenant(String email) {
        // get data from DB
        EmployeeOutDTO employee = employeesRepositoryCustom.getEmployeeByTenant(email);
        if (employee == null || employee.getEmployeeId() == null) {
            throw new CustomRestException(
                    CommonUtils.putError(ConstantsEmployees.COLUMN_NAME_EMAIL, Constants.ITEM_NOT_EXIST));
        }
        return employee;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getOrganization(GetOrganizationRequest)
     */
    @Override
    public GetOrganizationResponse getOrganization(GetOrganizationRequest request) {
        GetOrganizationResponse result = new GetOrganizationResponse();
        // 1. get list employees
        List<GetOrganizationEmployeeDTO> employee = employeesRepository
                .findAllByNameEmployee(request.getEmployeeName());
        // 2.get list department
        List<GetOrganizationDepartmentDTO> department = departmentsRepository
                .findAllByNameDepartment(request.getDepartmentName());
        // 3. get group
        List<GetOrganizationGroupDTO> group = employeesGroupsRepository.findGroupWithName(request.getGroupName());
        result.setEmployee(employee);
        result.setDepartment(department);
        result.setGroup(group);
        return result;
    }


    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesService#getEmployeeBasic(employeeId)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS,readOnly = true)
    public GetEmployeeBasicResponse getEmployeeBasic(Long employeeId) {
        GetEmployeeBasicResponse res = new GetEmployeeBasicResponse();
        // 1. Validate required parameter
        if (employeeId == null) {
            throw new CustomRestException(
                    CommonUtils.putError(ConstantsEmployees.PARAM_EMPLOYEE_ID, Constants.RIQUIRED_CODE));
        }
        // 2. Get information of employee
        List<EmployeeBasicDTO> dataBasicEmployee = employeesRepositoryCustom.getEmployeeBasic(employeeId);
        if(dataBasicEmployee.isEmpty()) return res;
        List<EmployeeDepartmentBasicDTO> employeeDepartments = new ArrayList<>();
        for (EmployeeBasicDTO employeeDepartmentBasicDTO : dataBasicEmployee) {
            EmployeeDepartmentBasicDTO dto = new EmployeeDepartmentBasicDTO();
            dto.setDepartmentName(employeeDepartmentBasicDTO.getDepartmentName());
            dto.setDepartmentId(employeeDepartmentBasicDTO.getDepartmentId());
            dto.setDepartmentOrder(employeeDepartmentBasicDTO.getDepartmentOrder());
            dto.setPositionId(employeeDepartmentBasicDTO.getPositionId());
            dto.setPositionName(employeeDepartmentBasicDTO.getPositionName());
            dto.setPositionOrder(employeeDepartmentBasicDTO.getPositionOrder());
            employeeDepartments.add(dto);
        }
        //3.Make response
        res.setCellphoneNumber(dataBasicEmployee.get(0).getCellphoneNumber());
        res.setEmployeeSurname(dataBasicEmployee.get(0).getEmployeeSurname());
        res.setEmployeeName(dataBasicEmployee.get(0).getEmployeeName());
        res.setEmployeeNameKana(dataBasicEmployee.get(0).getEmployeeNameKana());
        res.setEmployeeSurnameKana(dataBasicEmployee.get(0).getEmployeeSurnameKana());
        res.setEmail(dataBasicEmployee.get(0).getEmail());
        res.setTelephoneNumber(dataBasicEmployee.get(0).getTelephoneNumber());
        res.setEmployeeDepartments(employeeDepartments);
        return res;
    }
}
