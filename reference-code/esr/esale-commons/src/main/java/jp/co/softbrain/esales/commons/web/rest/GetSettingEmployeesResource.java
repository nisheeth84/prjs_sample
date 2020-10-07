package jp.co.softbrain.esales.commons.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.GetSettingEmployeesService;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetSettingEmployeesRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetSettingEmployeesResponse;

/**
 * REST controller for API get setting Employee
 * 
 * @author lehuuhoa
 */
@RestController
@RequestMapping("/api")
public class GetSettingEmployeesResource {

    @Autowired
    private GetSettingEmployeesService getSettingEmployeesService;

    /**
     * Get all data setting employees
     * 
     * @param request {@link GetSettingEmployeesRequest}
     * @return {@link GetSettingEmployeesResponse}
     */
    @PostMapping(path = "/get-setting-employees", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetSettingEmployeesResponse> getSettingEmployees(@RequestBody GetSettingEmployeesRequest request) {
        GetSettingEmployeesResponse getSettingEmployeesResponse = new GetSettingEmployeesResponse(
                getSettingEmployeesService.getSettingEmployees(request.getEmployeeIds(), request.getSettingTime()));
        return ResponseEntity.ok(getSettingEmployeesResponse);
    }
}
