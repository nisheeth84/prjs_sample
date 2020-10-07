package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.DepartmentsService;
import jp.co.softbrain.esales.employees.service.dto.GetDepartmentsOutDTO;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetDepartmentRequest;

/**
 * Rest class for API getDepartments
 */
@RestController
@RequestMapping("/api")
public class GetDepartmentsResource {

    @Autowired
    private DepartmentsService departmentsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * Get departments by list id
     *
     * @param departmentIds - list id
     * @param getEmployeesFlg - flag define get employees
     * @return object contains informations department and employees.
     */
    @PostMapping(path = "/get-departments", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetDepartmentsOutDTO> getDepartments(@RequestBody GetDepartmentRequest input) {
        return ResponseEntity.ok(departmentsService.getDepartments(input.getDepartmentIds(), input.getEmployeeId(),
                input.getGetEmployeesFlg(), jwtTokenUtil.getLanguageKeyFromToken()));
    }
}
