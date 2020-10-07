package jp.co.softbrain.esales.employees.web.rest;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetDepartmentsOfEmployeeResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.DepartmentsService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.CreateDepartmentRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.request.DeleteDepartmentRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.request.UpdateDepartmentRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.CreateDepartmentResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.DeleteDepartmentResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.UpdateDepartmentResponse;

import java.util.Map;

/**
 * Department Mutation
 * 
 * @author nguyentrunghieu
 */
@RestController
@RequestMapping("/api")
public class DepartmentResource {

    @Autowired
    private DepartmentsService departmentsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * create departments
     * 
     * @param departmentName the departmentName of entity
     * @param managerId the managerId of entity
     * @param parentId the parentId of entity
     * @return the departmentId of the entity inserted
     */
    @PostMapping(path = "/create-department", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateDepartmentResponse> createDepartment(@RequestBody CreateDepartmentRequest input) {
        CreateDepartmentResponse response = new CreateDepartmentResponse();
        response.setDepartmentId(departmentsService.createDepartment(input.getDepartmentName(), input.getManagerId(),
                input.getParentId()));
        return ResponseEntity.ok(response);
    }

    /**
     * update departments
     * 
     * @param departmentId the departmentId of the entity 
     * @param departmentName the departmentName of the entity 
     * @param managerId the managerId of the entity 
     * @param parentId the parentId of the entity 
     * @param updatedDate the updatedDate of the entity 
     * @return departmentId of the entity updated
     */
    @PostMapping(path = "/update-department", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateDepartmentResponse> updateDepartment(@RequestBody UpdateDepartmentRequest input) {
        UpdateDepartmentResponse response = new UpdateDepartmentResponse();
        response.setDepartmentId(departmentsService.updateDepartment(input.getDepartmentId(), input.getDepartmentName(),
                input.getManagerId(), input.getParentId(), input.getUpdatedDate()));
        return ResponseEntity.ok(response);
    }

    /**
     * Delete department by id
     * 
     * @param departmentId - id department to delete
     * @return the "id" department has been delete if success
     */
    @PostMapping(path = "/delete-department", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DeleteDepartmentResponse> deleteDepartment(@RequestBody DeleteDepartmentRequest request) {
        DeleteDepartmentResponse response = new DeleteDepartmentResponse();
        response.setDepartmentId(departmentsService.deleteDepartment(request.getDepartmentId()));
        return ResponseEntity.ok(response);
    }

    /**
     * The API get departments of employee
     * @param employeeId the ID of employee
     * @return list of department DTO
     */
    @GetMapping(path = "/get-departments-of-employee", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetDepartmentsOfEmployeeResponse> getDepartmentsOfEmployee(@RequestParam(required = false) Long employeeId) {
        Long mEmployeeId = employeeId;
        if (mEmployeeId == null) {
            mEmployeeId = jwtTokenUtil.getEmployeeIdFromToken();
        }
        if (mEmployeeId == null) {
            throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED,
                    Map.of(Constants.ERROR_ITEM, "employeeId", Constants.ERROR_CODE, Constants.RIQUIRED_CODE));
        }
        return ResponseEntity.ok(GetDepartmentsOfEmployeeResponse.builder()
                .departments(departmentsService.getDepartmentsOfEmployee(mEmployeeId))
                .build());
    }
}
