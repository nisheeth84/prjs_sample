package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService;
import jp.co.softbrain.esales.employees.service.dto.CheckDeletePositionsOutDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.CheckDeletePositionsRequest;

/**
 * Rest controller for API checkDeletePositions
 * 
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class CheckDeletePositionsResource {

    @Autowired
    private EmployeesDepartmentsService employeesDepartmentsService;

    /**
     * check delete positions : check delete position by list position id
     *
     * @param positionIds : list position id
     * @return CheckDeletePositionsOutDTO : list position id
     */
    @PostMapping(path = "/check-delete-positions", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CheckDeletePositionsOutDTO> getCheckDeletePositions(@RequestBody CheckDeletePositionsRequest input) {
        return ResponseEntity.ok(employeesDepartmentsService.getCheckDeletePositions(input.getPositionIds()));
    }
}
