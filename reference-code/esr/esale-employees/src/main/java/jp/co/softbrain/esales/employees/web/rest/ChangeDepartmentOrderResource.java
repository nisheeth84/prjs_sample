package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.DepartmentsService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.ChangeDepartmentOrderRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.ChangeDepartmentOrderResponse;

/**
 * ChangeDepartmentOrder controller for Rest
 * 
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class ChangeDepartmentOrderResource {

    @Autowired
    private DepartmentsService departmentsService;

    /**
     * Call service changeDepartmentOrder API
     * 
     * @param departmentParams - info about department which be changed
     * @return list Id department has changed
     */
    @PostMapping(path = "/change-department-order", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChangeDepartmentOrderResponse> changeDepartmentOrder(@RequestBody ChangeDepartmentOrderRequest input) {
        ChangeDepartmentOrderResponse response = new ChangeDepartmentOrderResponse();
        response.setDepartmentIds(departmentsService.changeDepartmentOrder(input.getDepartmentParams()));
        return ResponseEntity.ok(response);
    }
}
