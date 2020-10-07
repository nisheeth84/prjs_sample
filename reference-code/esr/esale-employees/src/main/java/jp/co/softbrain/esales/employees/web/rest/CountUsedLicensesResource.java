package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesPackagesService;
import jp.co.softbrain.esales.employees.service.dto.CountUsedLicensesOutDTO;

/**
 * Rest class for API countUsedLicenses
 * 
 * @author phamminhphu
 */
@RestController
@RequestMapping("/api")
public class CountUsedLicensesResource {

    @Autowired
    private EmployeesPackagesService employeesPackagesService;

    /**
     * count Used Licenses
     *
     * @return total used package of each package ID
     */
    @PostMapping(path = "/count-used-licenses", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CountUsedLicensesOutDTO> countUsedLicenses() {
        return ResponseEntity.ok(employeesPackagesService.countUsedLicenses());
    }
}
