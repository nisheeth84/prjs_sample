package jp.co.softbrain.esales.employees.web.rest;

import jp.co.softbrain.esales.elasticsearch.dto.employees.EmployeeElasticsearchDTO;
import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.SendMailForUsersRequest;
import jp.co.softbrain.esales.employees.service.dto.SendMailForUsersResponseDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.GetDataSyncElasticSearchVM;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetOrganizationRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetAllEmployeeIdResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetDataSyncElasticSearchResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetEmployeeBasicResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetOrganizationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Rest API for Product
 */
@RestController
@RequestMapping("/api")
public class EmployeeResource {

    @Autowired
    private EmployeesCommonService employeesCommonService;
    @Autowired
    private EmployeesService employeesService;

    /**
     * Get employee list information by list ID passed to insert data on
     * elasticsearch
     *
     * @param input - list id product
     * @return response include GetDataSyncElasticSearchResponse
     */
    @PostMapping(path = "/get-data-elasticsearch", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetDataSyncElasticSearchResponse> getDataSyncElasticSearch(
            @RequestBody GetDataSyncElasticSearchVM input) {
        List<EmployeeElasticsearchDTO> employeeData = new ArrayList<>();
        if (input.getEmployeeIds() != null) {
            employeeData = employeesCommonService.getDataSyncElasticSearch(input.getEmployeeIds());
        }
        return ResponseEntity.ok(new GetDataSyncElasticSearchResponse(employeeData));
    }

    /**
     * get all employee_id in table employees
     * @return list id
     */
    @PostMapping(path = "/get-all-employee-id", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetAllEmployeeIdResponse> getAllEmployeeId() {
        GetAllEmployeeIdResponse response = new GetAllEmployeeIdResponse();
        response.setEmployeeIds(employeesService.getAllEmployeeId());
        return ResponseEntity.ok(response);
    }

    /**
     * Send mail for user from list display
     *
     * @param request request id list
     * @return - list sendmail result
     */
    @PostMapping(path = "/send-mail-for-users", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SendMailForUsersResponseDTO> sendMailForUsers(@RequestBody SendMailForUsersRequest request) {
        return ResponseEntity.ok(employeesService.sendMailForUsers(request.getEmployeeIds()));
    }


    /**
     * get organization
     * @param request GetOrganizationRequest
     * @return GetOrganizationResponse
     */
    @GetMapping(path = "/get-organization", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetOrganizationResponse> getOrganization(@RequestBody GetOrganizationRequest request) {
        GetOrganizationResponse response = employeesService.getOrganization(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "/get-employee-by-id", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EmployeesDTO> getOrganization(@RequestBody Long employeeId) {
        return ResponseEntity.ok(employeesService.findOne(employeeId).orElse(null));
    }

    /**
     * Get employee basic
     * 
     * @param employeeId id employee get from request
     * @return  ResponseEntity<GetEmployeeBasicResponse> basic information of employee
     */
    @PostMapping(path = "/get-employee-basic", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeeBasicResponse> getEmployeeBasic(@RequestBody Long employeeId) {
        return ResponseEntity.ok(employeesService.getEmployeeBasic(employeeId));
    }
}
