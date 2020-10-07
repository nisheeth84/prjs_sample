package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.DepartmentsService;
import jp.co.softbrain.esales.employees.service.dto.InitializeDepartmentModalOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.InitializeDepartmentModalRequest;

/**
 * Query for initializeDepartmentModal
 * 
 * @author nguyentrunghieu
 */
@RestController
@RequestMapping("/api")
public class InitializeDepartmentModalResource {

    @Autowired
    private DepartmentsService departmentsService;

    /**
     * InitializeDepartmentModal
     * 
     * @param departmentId departmentId
     * @return the entity of InitializeDepartmentModalOutDTO
     */
    @PostMapping(path = "/get-initialize-department-modal", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InitializeDepartmentModalOutDTO> getInitializeDepartmentModal(
            @RequestBody InitializeDepartmentModalRequest req) {
        Long departmentId = req.getDepartmentId();
        return ResponseEntity.ok(this.departmentsService.initializeDepartmentModal(departmentId));
    }
}
