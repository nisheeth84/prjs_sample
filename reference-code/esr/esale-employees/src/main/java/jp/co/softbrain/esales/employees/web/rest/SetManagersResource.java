/**
 * 
 */
package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.SetManagersRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.SetManagersResponse;

/**
 * Set Managers
 * 
 * @author nguyentrunghieu
 */
@RestController
@RequestMapping("/api")
public class SetManagersResource {

    @Autowired
    private EmployeesDepartmentsService employeesDepartmentsService;

    /**
     * save manager settings for the list of Employees
     *
     * @param settingParams - Manager setting information array
     * @return list employeesDepartmentId updated
     */
    @PostMapping(path = "/set-managers", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SetManagersResponse> setManagers(@RequestBody SetManagersRequest req) {
        SetManagersResponse result = new SetManagersResponse();
        result.setList(employeesDepartmentsService.setManagers(req.getSettingParams()));
        return ResponseEntity.ok(result);
    }
}
