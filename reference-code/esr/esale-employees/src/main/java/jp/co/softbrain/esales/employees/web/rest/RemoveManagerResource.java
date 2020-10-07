package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService;
import jp.co.softbrain.esales.employees.web.rest.vm.request.RemoveManagerRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.RemoveManagerResponse;

/**
 * RemoveManagerMutation class process GraphQL Mutation
 *
 * @see com.coxautodev.graphql.tools.GraphQLMutationResolver
 */
@RestController
@RequestMapping("/api")
public class RemoveManagerResource {

    @Autowired
    private EmployeesDepartmentsService employeesDepartmentsService;

    /**
     * Remove manager settings by employeeIds.
     * 
     * @param employeeIds list employee id remove manager.
     * @return employee id list remove manager.
     */
    @PostMapping(path = "/remove-manager", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RemoveManagerResponse> removeManager(@RequestBody RemoveManagerRequest req) {
        RemoveManagerResponse result = new RemoveManagerResponse();
        result.setList(employeesDepartmentsService.removeManager(req.getEmployeeIds()));
        return ResponseEntity.ok(result);
    }
}
