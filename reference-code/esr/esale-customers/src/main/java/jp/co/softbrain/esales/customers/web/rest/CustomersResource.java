package jp.co.softbrain.esales.customers.web.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.customers.service.CustomersCUDService;
import jp.co.softbrain.esales.customers.service.CustomersService;
import jp.co.softbrain.esales.customers.service.DownLoadCustomersService;
import jp.co.softbrain.esales.customers.service.dto.CountCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CountRelationCustomerOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerAddressesOutDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutCustomResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutPersonalRequestDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerLayoutPersonalResponseDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersInputDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersSearchConditionsDTO;
import jp.co.softbrain.esales.customers.service.dto.DeleteCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetChildCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerHistoryResponse;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerIdByCustomerNameOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerIdOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerListOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerRequestDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomerSuggestionOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersOutDataInfosDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersTabOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetScenarioOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetUrlQuicksightResponse;
import jp.co.softbrain.esales.customers.service.dto.IntegrateCustomerInDTO;
import jp.co.softbrain.esales.customers.service.mapper.KeyValueTypeMapper;
import jp.co.softbrain.esales.customers.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.customers.web.rest.vm.request.CreateUpdateCustomerRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.CustomerIdInputRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.CustomerListIdInputRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.DeleteCustomersRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.DownloadCustomersRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetCustomerHistoryRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetCustomerIdRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetCustomerListRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetCustomersByIdsRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetCustomersRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetCustomersSuggestionRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetCustomersTabRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetScenarioRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.GetUrlQuicksightRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.IntegrateCustomerRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.UpdateCustomersRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.request.UpdateGeocodingCustomerRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.response.CountRelationCustomersResponse;
import jp.co.softbrain.esales.customers.web.rest.vm.response.CustomerIdOutResponse;
import jp.co.softbrain.esales.customers.web.rest.vm.response.CustomerListIdOutResponse;
import jp.co.softbrain.esales.customers.web.rest.vm.response.CustomersIdResponse;
import jp.co.softbrain.esales.customers.web.rest.vm.response.GetCustomerIdByNameRequest;
import jp.co.softbrain.esales.customers.web.rest.vm.response.GetCustomersByIdsResponse;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.S3FileUtil;
import jp.co.softbrain.esales.utils.dto.FileMappingDTO;
import jp.co.softbrain.esales.utils.dto.GetIdsBySearchConditionsOut;

/**
 * CustomersResource
 */
@RestController
@RequestMapping("/api")
public class CustomersResource {

    @Autowired
    private CustomersService customersService;

    @Autowired
    private CustomersCUDService customersCUDService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private KeyValueTypeMapper keyValueTypeMapper;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private DownLoadCustomersService downLoadCustomersService;

    /**
     * getCustomerList
     */
    @PostMapping(path = "/get-customer-list", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetCustomerListOutDTO> getCustomerList(@RequestBody GetCustomerListRequest request) {
        return ResponseEntity.ok(
                customersService.getCustomerList(request.getMode(), request.getIsFavourite()));
    }

    /**
     * getCustomers
     */
    @PostMapping(path = "/get-customers", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetCustomersOutDTO> getCustomers(@RequestBody GetCustomersRequest request) {
        CustomersSearchConditionsDTO input = new CustomersSearchConditionsDTO();
        if (request.getSearchConditions() != null) {
            input.getSearchConditions().addAll(request.getSearchConditions());
        }
        if (request.getFilterConditions() != null) {
            input.getFilterConditions().addAll(request.getFilterConditions());
        }
        if (request.getOrderBy() != null) {
            input.getOrderBy().addAll(request.getOrderBy());
        }
        input.setLocalSearchKeyword(request.getLocalSearchKeyword());
        input.setLimit(request.getLimit());
        input.setOffset(request.getOffset());
        if (request.getSelectedTargetType() == null) {
            input.setSelectedTargetType(0);
        } else {
            input.setSelectedTargetType(request.getSelectedTargetType());
        }
        if (request.getSelectedTargetId() == null) {
            input.setSelectedTargetId(0L);
        } else {
            input.setSelectedTargetId(request.getSelectedTargetId());
        }
        input.setIsUpdateListView(request.getIsUpdateListView());
        input.getListOrders().addAll(keyValueTypeMapper.toDto(request.getOrderBy()));
        return ResponseEntity.ok(customersService.getCustomers(input));
    }

    /**
     * deleteCustomers
     */
    @PostMapping(path = "/delete-customers", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DeleteCustomersOutDTO> deleteCustomers(@RequestBody DeleteCustomersRequest request) {
        return ResponseEntity.ok(customersService.deleteCustomers(request.getCustomerIds()));
    }

    /**
     * downloadCustomers
     */
    @PostMapping(path = "/download-customers", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> downloadCustomers(@RequestBody DownloadCustomersRequest request) {
        return ResponseEntity.ok(downLoadCustomersService.downloadCustomers(request));
    }

    /**
     * Update list informations of list customers
     * 
     * @param customers - list information used to update
     * @return - list id has been update
     */
    @PostMapping(path = "/update-customers", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerListIdOutResponse> updateCustomers(@ModelAttribute UpdateCustomersRequest req) {
        CustomerListIdOutResponse response = new CustomerListIdOutResponse();
        TypeReference<List<CustomersInputDTO>> typeRef = new TypeReference<>() {};
        List<CustomersInputDTO> data;
        try {
            data = mapper.readValue(req.getData(), typeRef);
            List<FileMappingDTO> filesMap = S3FileUtil.creatFileMappingList(req.getFiles(), req.getFilesMap());
            List<Long> customerIds = customersCUDService.updateCustomers(data, filesMap);
            response.setCustomerIds(customerIds);
        } catch (IOException e) {
            throw new CustomException(e);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Get data related to the customer to delete
     * 
     * @param customerIds list of the customerId
     * @return list of the entity
     */
    @PostMapping(path = "/count-relation-customers", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CountRelationCustomersResponse> getCountRelationCustomer(
            @RequestBody CustomerListIdInputRequest request) {
        CountRelationCustomersResponse response = new CountRelationCustomersResponse();
        List<CountRelationCustomerOutDTO> listCount = customersService
                .getCountRelationCustomer(request.getCustomerIds());
        response.setListCount(listCount);
        return ResponseEntity.ok(response);
    }

    /**
     * getCustomer
     * 
     * @param request
     * @return
     */
    @PostMapping(path = "/get-customer", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetCustomerOutDTO> getCustomer(@RequestBody GetCustomerRequestDTO request) {
        return ResponseEntity.ok(customersService.getCustomer(request));
    }

    /**
     * Get information for customer screen
     * 
     * @return list informations for default item and extension items
     */
    @PostMapping(path = "/get-customer-layout", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerLayoutCustomResponseDTO> getCustomerLayout() {
        return ResponseEntity.ok(customersService.getCustomerLayout());
    }

    /**
     * Create new customer
     * 
     * @param request
     *            - informations of main table
     * @return - id has been created
     * @throws IOException
     */
    @PostMapping(path = "/create-customer", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Long> createCustomer(@ModelAttribute CreateUpdateCustomerRequest request) throws IOException {
        CustomersInputDTO data = mapper.readValue(request.getData(), CustomersInputDTO.class);
        List<FileMappingDTO> filesMap = S3FileUtil.creatFileMappingList(request.getFiles(), request.getFilesMap());
        Long customerId = customersCUDService.createCustomer(data, filesMap);
        CustomersIdResponse response = new CustomersIdResponse();
        response.setCustomerId(customerId);
        return ResponseEntity.ok(customerId);
    }

    /**
     * Update informations customer
     * 
     * @param inputData - informations of main table
     * @param dataScenario - data table scenarios
     * @param dataProductTradings - data product trading
     * @return - id has been updated
     */
    @PostMapping(path = "/update-customer", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomersIdResponse> updateCustomer(@ModelAttribute CreateUpdateCustomerRequest request)
            throws IOException {
        CustomersInputDTO data = mapper.readValue(request.getData(), CustomersInputDTO.class);
        List<FileMappingDTO> filesMap = S3FileUtil.creatFileMappingList(request.getFiles(), request.getFilesMap());
        Long customerId = customersCUDService.updateCustomer(data, filesMap);
        CustomersIdResponse response = new CustomersIdResponse();
        response.setCustomerId(customerId);
        return ResponseEntity.ok(response);
    }


    /**
     * Get data for each scenario of milestone screen
     * 
     * @param customerId
     *            - customer id to get data
     * @return object contains data
     */
    @PostMapping(path = "/get-scenario", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetScenarioOutDTO> getScenario(@RequestBody GetScenarioRequest request) {
        return ResponseEntity.ok(customersService.getScenario(request.getCustomerId()));
    }

    /**
     * Update latitude and longitude by customerId
     * 
     * @param customerId - id of the entity
     * @param latitude - new value of latitude
     * @param longitude - new value of longitude
     * @param updatedDate - updatedDate to check exclusive
     * @return - id has been updated
     */
    @PostMapping(path = "/update-geocoding-customer", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Long> updateGeocodingCustomer(@RequestParam UpdateGeocodingCustomerRequest request) {
        return ResponseEntity.ok(customersService.updateGeocodingCustomer(request.getCustomerId(),
                request.getLatitude(), request.getLongitude(), request.getUpdatedDate()));
    }

    /**
     * API Implement customer data integration and Save history
     * 
     * @param integrateCustomer
     *            - object request
     * @return string - Customer ID is integrated
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     */
    @PostMapping(path = "/integrate-customer", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerIdOutResponse> integrateCustomer(
            @ModelAttribute IntegrateCustomerRequest request) throws IOException {
        IntegrateCustomerInDTO data = mapper.readValue(request.getData(), IntegrateCustomerInDTO.class);
        List<FileMappingDTO> filesMap = S3FileUtil.creatFileMappingList(request.getFiles(), request.getFilesMap());
        return ResponseEntity.ok(customersCUDService.integrateCustomer(data, filesMap));
    }

    /**
     * Get count the number of customers by employees with employeeId
     * 
     * @param employeeId the employeeId of the entity
     * @return the entity
     */
    @PostMapping(path = "/count-customers", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CountCustomersOutDTO> getCountCustomers(@RequestParam Long employeeId) {
        return ResponseEntity.ok(customersService.countCustomers(employeeId));
    }

    /**
     * Get list address by list customerIds
     * 
     * @param customerIds - list id customers
     * @return object contains data
     */
    @PostMapping(path = "/get-customer-addresses", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerAddressesOutDTO> getCustomerAddresses(
            @RequestParam CustomerListIdInputRequest request) {
        return ResponseEntity.ok(customersService.getCustomerAddresses(request.getCustomerIds()));
    }

    /**
     * get Child customer data
     * 
     * @param customerId the customerId of the entity
     * @return the entity
     */
    @PostMapping(path = "/get-child-customers", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetChildCustomersOutDTO> getChildCustomers(@RequestBody CustomerIdInputRequest request) {
        return ResponseEntity.ok(customersService.getChildCustomers(request.getCustomerId()));
    }

    /**
     * Get customer Id by customer name
     * 
     * @pram customerName - customerName
     * @return GetCustomerIdByCustomerNameOutDTO
     */
    @PostMapping(path = "/get-customer-id-by-name", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetCustomerIdByCustomerNameOutDTO> getCustomerIdByCustomerName(
            @RequestBody GetCustomerIdByNameRequest req) {
        return ResponseEntity.ok(customersService.getCustomerIdByName(req.getCustomerName()));
    }

    /**
     * Get customer information according to search criteria to display pulldown
     * 
     * @param keywords keywords
     * @return the entity of GetCustomerSuggestionOutDTO
     */
    @PostMapping(path = "/get-customer-suggestion", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetCustomerSuggestionOutDTO> getCustomerSuggestion(
            @RequestBody GetCustomersSuggestionRequest request) {
        return ResponseEntity.ok(customersService.getCustomerSuggestion(request.getKeyWords(), request.getOffset(),
                request.getListIdChoice(), request.getRelationFieldId()));
    }

    /**
     * Get Customer information displayed on the employee details screen
     * 
     * @param tabBelong id function
     * @param currentPage current page
     * @param limit limit
     * @param searchConditions the list entity of GetCustomersTabSubType1DTO
     * @return the entity
     */
    @PostMapping(path = "/get-customers-tab", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetCustomersTabOutDTO> getCustomersTab(@RequestBody GetCustomersTabRequest request) {
        return ResponseEntity.ok(customersService.getCustomersTab(request.getTabBelong(), request.getCurrentPage(),
                request.getLimit(), request.getSearchConditions(), jwtTokenUtil.getLanguageCodeFromToken()));
    }

    /**
     * get list customer by list customerIds
     * 
     * @param request - request
     * @return list customer
     */
    @PostMapping(path = "/get-customers-by-ids", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetCustomersByIdsResponse> getCustomersByIds(@RequestBody GetCustomersByIdsRequest request) {
        GetCustomersByIdsResponse response = new GetCustomersByIdsResponse();
        response.setCustomers(customersService.getCustomersByIds(request.getCustomerIds()));
        return ResponseEntity.ok(response);
    }

    /**
     * get list customer by list customerIds
     * 
     * @param request - request
     * @return list customer
     */
    @PostMapping(path = "/get-customer-layout-personal", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerLayoutPersonalResponseDTO> getCustomerLayoutPersonal(
            @RequestBody CustomerLayoutPersonalRequestDTO request) {
        return ResponseEntity.ok(customersService.getCustomerLayoutPersonal(request));
    }

    /**
     * Get customer Id
     * 
     * @param customerName - customerName
     * @return response
     */
    @PostMapping(path = "/get-customer-id", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetCustomerIdOutDTO> getCustomerId(@RequestBody GetCustomerIdRequest request) {
        return ResponseEntity.ok(customersService.getCustomerId(request.getCustomerName()));
    }

    /**
     * Get URL Quick sight
     * 
     * @param GetUrlQuicksightRequest
     * @return GetUrlQuicksightResponse
     */
    @PostMapping(path = "/get-url-quicksight", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetUrlQuicksightResponse> getUrlQuicksight(@RequestBody GetUrlQuicksightRequest request) {
        return ResponseEntity.ok(customersService.getUrlQuicksight(request.getCustomerId()));
    }

    /**
     * Get Customer History
     * 
     * @param customerName - customerName
     * @return response
     */
    @PostMapping(path = "/get-customer-history", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetCustomerHistoryResponse> getCustomerHistory(
            @RequestBody GetCustomerHistoryRequest request) {
        return ResponseEntity.ok(customersService.getCustomerHistory(request.getCustomerId(), request.getCurrentPage(),
                request.getLimit()));
    }

    /**
     * Get Ids Of get customers
     *
     * @return response
     */
    @PostMapping(path = "/get-ids-of-get-customers", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetIdsBySearchConditionsOut> getIdsOfGetActivities(@RequestBody GetCustomersRequest request) {
        GetIdsBySearchConditionsOut response = new GetIdsBySearchConditionsOut();

        ResponseEntity<GetCustomersOutDTO> customersResponse = getCustomers(request);

        if (!customersResponse.hasBody() || customersResponse.getBody() == null
                || CollectionUtils.isEmpty(customersResponse.getBody().getCustomers())) {
            response.setListIds(new ArrayList<>());
            return ResponseEntity.ok(response);
        }
        GetCustomersOutDTO searchResponse = customersResponse.getBody();

        List<Long> listIdsResult = searchResponse.getCustomers().stream()
                .map(GetCustomersOutDataInfosDTO::getCustomerId).collect(Collectors.toList());
        response.setListIds(listIdsResult);
        return ResponseEntity.ok(response);
    }
}
