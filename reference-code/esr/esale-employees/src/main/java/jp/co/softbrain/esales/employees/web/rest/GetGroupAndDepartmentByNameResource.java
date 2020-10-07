package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.DepartmentsService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetGroupAndDepartmentByNameRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetGroupAndDepartmentByNameResponse;

/**
 * Rest controller for api gettGroupAndDepartmentByName
 *
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class GetGroupAndDepartmentByNameResource {

    @Autowired
    private DepartmentsService departmentsService;

    /**
     * Get group and department by employeeIds
     * 
     * @param employeeIds - list employeeId to get
     * @return data response
     */
    @PostMapping(path = "/get-group-and-department-by-name", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetGroupAndDepartmentByNameResponse> getGroupAndDepartmentByEmployeeIds(
            @RequestBody GetGroupAndDepartmentByNameRequest req) {
        return ResponseEntity.ok(departmentsService.getGroupAndDepartmentByName(req.getSearchValue(),
                req.getSearchType(), req.getSearchOption()));
    }
}
