package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.InitializeLocalMenuOutDTO;

/**
 * InitializeLocalMenuQuery class process GraphQL query
 * 
 * @author trantheduy
 */
@RestController
@RequestMapping("/api")
public class InitializeLocalMenuResource {

	@Autowired
	private EmployeesService employeeService;

	/**
	 * Get department, my group, shared group in local menu screen.
	 * 
	 * @return information department, my group, shared group.
	 */
	@PostMapping(path = "/get-initialize-local-menu", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<InitializeLocalMenuOutDTO> getInitializeLocalMenu() {
		return ResponseEntity.ok(this.employeeService.initializeLocalMenu());
	}
}
