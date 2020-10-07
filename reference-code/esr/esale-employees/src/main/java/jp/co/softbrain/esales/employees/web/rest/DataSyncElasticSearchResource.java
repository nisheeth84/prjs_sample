package jp.co.softbrain.esales.employees.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.service.dto.EmployeeInfoDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.GetEmployeesByIdsResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.request.DataSyncElasticSearchRequest;

/**
 * EmpDetailResource class process GraphQL query
 *
 */
@RestController
@RequestMapping("/api")
public class DataSyncElasticSearchResource {

    @Autowired
    private EmployeesCommonService employeesCommonService;

    /**
     * get Employee detail
     * @param employeeCode
     * @return EmpDetailDTO object
     */
    @PostMapping(path = "/get-data-sync-elasticsearch", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<EmployeeInfoDTO>> getDataSyncElasticSearch(@RequestBody DataSyncElasticSearchRequest input) {
        return ResponseEntity.ok(employeesCommonService.getEmployeeByIds(input.getEmployeeIds()));
    }

    /**
     * get Employee detail by id
     * @param employeeCode
     * @return EmpDetailDTO object
     */
    @PostMapping(path = "/get-employees-by-ids", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetEmployeesByIdsResponse> getEmployeesByIds(
            @RequestBody DataSyncElasticSearchRequest input) {
        GetEmployeesByIdsResponse response = new GetEmployeesByIdsResponse();
        response.setEmployees(employeesCommonService.getEmployeeByIds(input.getEmployeeIds()));
        return ResponseEntity.ok(response);
    }
}
