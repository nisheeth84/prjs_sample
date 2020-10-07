package jp.co.softbrain.esales.commons.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;

import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.domain.ImportHistories;
import jp.co.softbrain.esales.commons.repository.ImportHistoriesRepository;
import jp.co.softbrain.esales.commons.security.SecurityUtils;
import jp.co.softbrain.esales.commons.service.ImportProgressService;
import jp.co.softbrain.esales.commons.service.ImportService;
import jp.co.softbrain.esales.commons.service.ImportSettingService;
import jp.co.softbrain.esales.commons.service.UploadFileService;
import jp.co.softbrain.esales.commons.service.dto.BusinessCardsListDetailsSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.CreateListInDTO;
import jp.co.softbrain.esales.commons.service.dto.CreateListOutDTO;
import jp.co.softbrain.esales.commons.service.dto.CreateProductTradingsListSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.CustomersListSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.EmployeeGroupSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.EmployeesGroupInDTO;
import jp.co.softbrain.esales.commons.service.dto.ImportProgressDTO;
import jp.co.softbrain.esales.commons.service.dto.ImportSettingDTO;
import jp.co.softbrain.esales.commons.service.dto.S3UploadResponse;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.commons.web.rest.vm.ImportInfoResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.request.BatchImportRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.CreateBusinessCardsListRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.CreateProductTradingsListRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.ImportRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.ProcessImportRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.CreateBusinessCardsListResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.CreateGroupResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.CreateProductTradingsListResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.ProcessImportResponse;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;

@Service
public class ImportServiceImpl implements ImportService {
    
    private static final Logger log = LoggerFactory.getLogger(ImportServiceImpl.class);
    
    public static final String CALL_API_MSG_FAILED = "Call API %s failed. Status: %s";
    public static final String CALL_API_ERR_RESPONSE_FAILED = "Call API %s failed. Invalid response data";
    
    private static final String API_EMPLOYEE_CREATE_LIST = "create-groups";
    private static final String API_BUSINESSCARD_CREATE_LIST = "create-business-cards-list";
    private static final String API_PRODUCT_TRADINGS_CREATE_LIST = "create-business-cards-list";
    private static final String API_CUSTOMER_CREATE_LIST = "create-list";
    private static final String API_TENANT_IMPORT = "import";
    
    @Autowired
    private ImportHistoriesRepository importHistoriesRepository;
    @Autowired
    UploadFileService uploadFileService;
    @Autowired
    ImportSettingService importSettingService;
    @Autowired
    ImportProgressService importProgressService;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private RestOperationUtils restOperationUtils;
    @Autowired
    private Gson gson = new Gson();

    @Override
    public ImportInfoResponse processImport(
        ImportRequest importRequest) {
        Long importHistoryID = createImportHistory();

        return new ImportInfoResponse(importHistoryID);
    }

    @Override
    public ImportInfoResponse stopSimulation() {
        return null;
    }

    private Long createImportHistory() {
        ImportHistories importHistories = new ImportHistories();

        importHistories = importHistoriesRepository.save(importHistories);


        return importHistories.getImportHistoryId();

    }
    
    /**
     * @see jp.co.softbrain.esales.commons.service.ImportService#processImport(ProcessImportRequest
     *      req)
     */
    @Override
    public ProcessImportResponse processImport(ProcessImportRequest req) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        String languageCode = jwtTokenUtil.getLanguageCodeFromToken();
        String token = SecurityUtils.getTokenValue().orElse(null);
        
        // Step 1. Check permission
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException("User does not permission.",
                    CommonUtils.putError("User does not permission.", Constants.USER_NOT_PERMISSION));
        }
        
        // Step 2. Validate parameter
        validateParametersProcessImport(req);
        
        // Step 3. Save CSV file
        MultipartFile file = req.getFile();
        List<MultipartFile> listFile = new ArrayList<>();
        listFile.add(file);
        S3UploadResponse uploadResponse = null;
        try {
            uploadResponse = uploadFileService.uploadFileToS3(file,
                    FieldBelongEnum.getByValue(req.getServiceId()).getCode());
        } catch (Exception e) {
            throw new CustomException(e.getMessage());
        }
        
        // Check isSimulationMode
        Long listId = null;
        if(!req.getIsSimulationMode().booleanValue()) {
            // Step 4. Create List
            if(req.getServiceId().equals(Constants.FieldBelong.EMPLOYEE.getValue()))
                listId = createListEmployees(req);
            if(req.getServiceId().equals(Constants.FieldBelong.CUSTOMER.getValue()))
                listId = createListCustomer(req);
            if(req.getServiceId().equals(Constants.FieldBelong.BUSINESS_CARD.getValue()))
                listId = createListBusinessCard(req);
            if(req.getServiceId().equals(Constants.FieldBelong.TRADING_PRODUCT.getValue()))
                listId = createListProductTradings(req);
        }
        log.debug("============== \n listId: {}", listId);
        
        // Step 5. Save import setting
        // Step 5.1 Insert to import_setting
        ImportSettingDTO importSettingDTO = new ImportSettingDTO();
        importSettingDTO.setServiceId(req.getServiceId());
        importSettingDTO.setImportFileName(uploadResponse.getFileName());
        importSettingDTO.setImportFilePath(uploadResponse.getPresignedURL());
        importSettingDTO.setIsSimulationMode(req.getIsSimulationMode());
        importSettingDTO.setImportAction(req.getImportAction());
        importSettingDTO.setIsDuplicateAllowed(req.getIsDuplicateAllowed());
        importSettingDTO.setMappingItem(req.getMappingItem());
        importSettingDTO.setMatchingKey(req.getMatchingKey());
        importSettingDTO.setMatchingRelation(req.getMatchingRelation());
        importSettingDTO.setNoticeList(gson.toJson(req.getNoticeList()));
        importSettingDTO.setIsAutoPostTimeline(req.getIsAutoPostTimeline());
        importSettingDTO.setListId(listId);
        importSettingDTO.setLanguageCode(languageCode);
        importSettingDTO.setCreatedUser(employeeId);
        importSettingDTO.setUpdatedUser(employeeId);
        importSettingDTO = importSettingService.save(importSettingDTO);
        log.debug("importSettingDTO id: {}", importSettingDTO.getImportId());
        // Step 5.2 Insert to import_progress
        ImportProgressDTO importProgressDTO = new ImportProgressDTO();
        importProgressDTO.setImportId(importSettingDTO.getImportId());
        importProgressDTO.setImportStatus(0);
        importProgressDTO.setImportRowFinish(0);
        importProgressDTO.setCreatedUser(employeeId);
        importProgressDTO.setUpdatedUser(employeeId);
        importProgressService.save(importProgressDTO);
        log.debug("importProgressDTO getImportProgressId: {}", importProgressDTO.getImportProgressId());
        
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        // Step 6 Call Tenant Batch Import
        BatchImportRequest param = new BatchImportRequest();
        param.setTenantName(tenantName);
        param.setImportId(importSettingDTO.getImportId());
        try {
            restOperationUtils.executeCallApi(Constants.PathEnum.TENANTS, API_TENANT_IMPORT, HttpMethod.POST, param,
                    Object.class, token, jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            String msg = String.format(CALL_API_MSG_FAILED, API_TENANT_IMPORT, e.getLocalizedMessage());
            throw new CustomException(msg);
        }
        
        // Step 7 Return response
        ProcessImportResponse res = new ProcessImportResponse();
        res.setImportId(importSettingDTO.getImportId());
        return res;
    }
    
    /**
     * Validate parameters process import
     * @param ProcessImportRequest req
     */
    private void validateParametersProcessImport(ProcessImportRequest req) {
        if (req.getServiceId() == null) {
            throw new CustomRestException("param [serviceId] is null",
                    CommonUtils.putError("param [serviceId] is null", Constants.RIQUIRED_CODE));
        }
        if (req.getFile() == null) {
            throw new CustomRestException("param [importFile] is null",
                    CommonUtils.putError("param [importFile] is null", Constants.RIQUIRED_CODE));
        }
        if (req.getImportAction() == null) {
            throw new CustomRestException("param [importAction] is null",
                    CommonUtils.putError("param [importAction] is null", Constants.RIQUIRED_CODE));
        }
        if (req.getIsDuplicateAllowed() == null) {
            throw new CustomRestException("param [IsDuplicateAllowed] is null",
                    CommonUtils.putError("param [IsDuplicateAllowed] is null", Constants.RIQUIRED_CODE));
        }
        if (req.getIsSimulationMode() == null) {
            throw new CustomRestException("param [IsSimulationMode] is null",
                    CommonUtils.putError("param [IsSimulationMode] is null", Constants.RIQUIRED_CODE));
        }
        if (req.getMappingItem() == null) {
            throw new CustomRestException("param [MappingItem] is null",
                    CommonUtils.putError("param [MappingItem] is null", Constants.RIQUIRED_CODE));
        }
        if (req.getMatchingKey() == null) {
            throw new CustomRestException("param [MatchingKey] is null",
                    CommonUtils.putError("param [MatchingKey] is null", Constants.RIQUIRED_CODE));
        }
    }

    private Long createListEmployees(ProcessImportRequest req) {
        log.debug("CreateListEmployees()");
        String token = SecurityUtils.getTokenValue().orElse(null);
        EmployeesGroupInDTO param = new EmployeesGroupInDTO();
        param.setGroupName(req.getListInfo().getListName());
        param.setGroupType(req.getListInfo().getListType());
        param.setIsAutoGroup(false);
        // If listType = 2 (sharedList): create groupParticipants
        if(req.getListInfo().getListType().equals(ConstantsCommon.SHARED_LIST)) {
            List<EmployeeGroupSubType1DTO> listGroupPart = new ArrayList<>();
            // Add data in owner array to listGroupPart
            List<Long> employeeIds = req.getListInfo().getOwnerList().getEmployeeIds();
            List<Long> departmentIds = req.getListInfo().getOwnerList().getDepartmentIds();
            List<Long> groupIds = req.getListInfo().getOwnerList().getGroupIds();
            for(int i=0; i<employeeIds.size(); i++) {
                EmployeeGroupSubType1DTO employeeGroupSubType1DTO = new EmployeeGroupSubType1DTO();
                employeeGroupSubType1DTO.setEmployeeId(employeeIds.get(i));
                employeeGroupSubType1DTO.setDepartmentId(departmentIds.get(i));
                employeeGroupSubType1DTO.setParticipantGroupId(groupIds.get(i));
                employeeGroupSubType1DTO.setParticipantType(ConstantsCommon.MEMBER_TYPE_OWNER);
            }
         // Add data in viewer array to listGroupPart
            employeeIds = req.getListInfo().getViewerList().getEmployeeIds();
            departmentIds = req.getListInfo().getViewerList().getDepartmentIds();
            groupIds = req.getListInfo().getViewerList().getGroupIds();
            for(int i=0; i<employeeIds.size(); i++) {
                EmployeeGroupSubType1DTO employeeGroupSubType1DTO = new EmployeeGroupSubType1DTO();
                employeeGroupSubType1DTO.setEmployeeId(employeeIds.get(i));
                employeeGroupSubType1DTO.setDepartmentId(departmentIds.get(i));
                employeeGroupSubType1DTO.setParticipantGroupId(groupIds.get(i));
                employeeGroupSubType1DTO.setParticipantType(ConstantsCommon.MEMBER_TYPE_VIEWER);
            }
            param.setGroupParticipants(listGroupPart);
        }
        CreateGroupResponse apiResponse;
        try {
            apiResponse = restOperationUtils.executeCallApi(Constants.PathEnum.EMPLOYEES, API_EMPLOYEE_CREATE_LIST,
                    HttpMethod.POST, param, CreateGroupResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            String msg = String.format(CALL_API_MSG_FAILED, API_EMPLOYEE_CREATE_LIST, e.getLocalizedMessage());
            throw new CustomException(msg);
        }
        if(apiResponse == null || apiResponse.getGroupId() == null) {
            String msg = String.format(CALL_API_ERR_RESPONSE_FAILED, API_EMPLOYEE_CREATE_LIST);
            throw new CustomException(msg);
        }
        return apiResponse.getGroupId();
    }
    
    private Long createListCustomer(ProcessImportRequest req) {
        log.debug("CreateListCustomer()");
        String token = SecurityUtils.getTokenValue().orElse(null);
        CreateListInDTO param = new CreateListInDTO();
        param.setCustomerListName(req.getListInfo().getListName());
        param.setCustomerListType(req.getListInfo().getListType());
        param.setIsAutoList(false);
        // If listType = 2 (sharedList): create groupParticipants
        if(req.getListInfo().getListType().equals(ConstantsCommon.SHARED_LIST)) {
            List<CustomersListSubType1DTO> listGroupPart = new ArrayList<>();
            // Add data in owner array to listGroupPart
            List<Long> employeeIds = req.getListInfo().getOwnerList().getEmployeeIds();
            List<Long> departmentIds = req.getListInfo().getOwnerList().getDepartmentIds();
            List<Long> groupIds = req.getListInfo().getOwnerList().getGroupIds();
            for(int i=0; i<employeeIds.size(); i++) {
                CustomersListSubType1DTO customersListSubType1DTO = new CustomersListSubType1DTO();
                customersListSubType1DTO.setEmployeeId(employeeIds.get(i));
                customersListSubType1DTO.setDepartmentId(departmentIds.get(i));
                customersListSubType1DTO.setGroupId(groupIds.get(i));
                customersListSubType1DTO.setParticipantType(ConstantsCommon.MEMBER_TYPE_OWNER);
            }
         // Add data in viewer array to listGroupPart
            employeeIds = req.getListInfo().getViewerList().getEmployeeIds();
            departmentIds = req.getListInfo().getViewerList().getDepartmentIds();
            groupIds = req.getListInfo().getViewerList().getGroupIds();
            for(int i=0; i<employeeIds.size(); i++) {
                CustomersListSubType1DTO customersListSubType1DTO = new CustomersListSubType1DTO();
                customersListSubType1DTO.setEmployeeId(employeeIds.get(i));
                customersListSubType1DTO.setDepartmentId(departmentIds.get(i));
                customersListSubType1DTO.setGroupId(groupIds.get(i));
                customersListSubType1DTO.setParticipantType(ConstantsCommon.MEMBER_TYPE_VIEWER);
            }
            param.setListParticipants(listGroupPart);
        }
        CreateListOutDTO apiResponse;
        try {
            apiResponse = restOperationUtils.executeCallApi(Constants.PathEnum.EMPLOYEES, API_CUSTOMER_CREATE_LIST,
                    HttpMethod.POST, param, CreateListOutDTO.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            String msg = String.format(CALL_API_MSG_FAILED, API_CUSTOMER_CREATE_LIST, e.getLocalizedMessage());
            throw new CustomException(msg);
        }
        
        if(apiResponse == null || apiResponse.getCustomerListId() == null) {
            String msg = String.format(CALL_API_ERR_RESPONSE_FAILED, API_CUSTOMER_CREATE_LIST);
            throw new CustomException(msg);
        }
        return apiResponse.getCustomerListId();
    }
    
    private Long createListBusinessCard(ProcessImportRequest req) {
        log.debug("CreateListBusinessCard()");
        String token = SecurityUtils.getTokenValue().orElse(null);
        CreateBusinessCardsListRequest param = new CreateBusinessCardsListRequest();
        BusinessCardsListDetailsSubType1DTO businessCardsListDetailsSubType1DTO = new BusinessCardsListDetailsSubType1DTO(); 
        businessCardsListDetailsSubType1DTO.setBusinessCardListName(req.getListInfo().getListName());
        businessCardsListDetailsSubType1DTO.setListType(req.getListInfo().getListType());
        // Convert List<Long> req.getListInfo().getOwnerList().getEmployeeIds() to List<String>
        List<String> ownerListString = new ArrayList<>();
        req.getListInfo().getOwnerList().getEmployeeIds().stream().forEach(id -> ownerListString.add(id.toString()));
        // Convert List<Long> req.getListInfo().getViewerList().getEmployeeIds() to List<String>
        List<String> viewerListString = new ArrayList<>();
        req.getListInfo().getViewerList().getEmployeeIds().stream().forEach(id -> viewerListString.add(id.toString()));
        businessCardsListDetailsSubType1DTO.setOwnerList(ownerListString);
        businessCardsListDetailsSubType1DTO.setViewerList(viewerListString);
        param.setBusinessCardList(businessCardsListDetailsSubType1DTO);
        
        CreateBusinessCardsListResponse apiResponse;
        try {
            apiResponse = restOperationUtils.executeCallApi(Constants.PathEnum.BUSINESSCARDS, API_BUSINESSCARD_CREATE_LIST,
                    HttpMethod.POST, param, CreateBusinessCardsListResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            String msg = String.format(CALL_API_MSG_FAILED, API_BUSINESSCARD_CREATE_LIST, e.getLocalizedMessage());
            throw new CustomException(msg);
        }
        if(apiResponse == null || apiResponse.getBusinessCardListDetailId() == null) {
            String msg = String.format(CALL_API_ERR_RESPONSE_FAILED, API_BUSINESSCARD_CREATE_LIST);
            throw new CustomException(msg);
        }
        return apiResponse.getBusinessCardListDetailId();
    }
    
    private Long createListProductTradings(ProcessImportRequest req) {
        log.debug("CreateListProductTradings()");
        String token = SecurityUtils.getTokenValue().orElse(null);
        CreateProductTradingsListRequest param = new CreateProductTradingsListRequest();
        CreateProductTradingsListSubType1DTO createProductTradingsListSubType1DTO = new CreateProductTradingsListSubType1DTO(); 
        createProductTradingsListSubType1DTO.setProductTradingListName(req.getListInfo().getListName());
        createProductTradingsListSubType1DTO.setListType(req.getListInfo().getListType());
        createProductTradingsListSubType1DTO.setOwnerList(req.getListInfo().getOwnerList().getEmployeeIds());
        createProductTradingsListSubType1DTO.setViewerList(req.getListInfo().getViewerList().getEmployeeIds());
        param.setProductTradingList(createProductTradingsListSubType1DTO);
        
        CreateProductTradingsListResponse apiResponse;
        try {
            apiResponse = restOperationUtils.executeCallApi(Constants.PathEnum.BUSINESSCARDS, API_PRODUCT_TRADINGS_CREATE_LIST,
                    HttpMethod.POST, param, CreateProductTradingsListResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (Exception e) {
            String msg = String.format(CALL_API_MSG_FAILED, API_PRODUCT_TRADINGS_CREATE_LIST, e.getLocalizedMessage());
            throw new CustomException(msg);
        }
        if(apiResponse == null || apiResponse.getProductTradingListDetailId() == null) {
            String msg = String.format(CALL_API_ERR_RESPONSE_FAILED, API_PRODUCT_TRADINGS_CREATE_LIST);
            throw new CustomException(msg);
        }
        return apiResponse.getProductTradingListDetailId();
    }
}
