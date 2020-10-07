package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesPackagesService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.RevokeEmployeeAccessRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.RevokeEmployeeAccessResponse;


/**
 * RevokeEmployeeAccessMutation class process GraphQL Mutation
 *
 * @author nguyenhaiduong
 */
@RestController
@RequestMapping("/api")
public class RevokeEmployeeAccessResource {

    @Autowired
    private EmployeesPackagesService employeesPackagesService;

    /**
     * Revoke employee account access to subscriptions that are no longer in
     * use.
     * 
     * @param packageIds list package id not remove.
     * @return result remove.
     */
    @PostMapping(path = "/revoke-employee-access", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RevokeEmployeeAccessResponse> revokeEmployeeAccess(@RequestBody RevokeEmployeeAccessRequest req) {
            return ResponseEntity.ok(employeesPackagesService.revokeEmployeeAccess(req.getPackageIds()));
    }
}
