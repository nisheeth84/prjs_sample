package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.DownloadEmployeesService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.DownloadEmployeesRequest;

/**
 * Rest for API downloadEmployee
 * 
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class DownloadEmployeesResource {

    @Autowired
    private DownloadEmployeesService downloadEmployeesService;

    /**
     * Query class call service downloadEmployees
     * 
     * @param employeeIds - list employeeId to download
     * @param orderBy - list orderBy
     * @return path save file.
     */
    @PostMapping(path = "/download-employees", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> downloadEmployees(@RequestBody DownloadEmployeesRequest input) {
        return ResponseEntity.ok(downloadEmployeesService.downloadEmployees(input.getEmployeeIds(), input.getOrderBy(),
                input.getSelectedTargetType(), input.getSelectedTargetId()));
    }

}
