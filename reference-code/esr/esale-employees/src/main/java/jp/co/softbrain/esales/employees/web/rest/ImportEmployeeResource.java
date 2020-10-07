package jp.co.softbrain.esales.employees.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.ImportEmployeesInDTO;
import jp.co.softbrain.esales.employees.service.dto.ImportEmployeesOutDTO;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.web.rest.vm.request.ImportEmployeesRequest;

/**
 * EmployeeMutation class process GraphQL Mutation
 * 
 * @author TranTheDuy
 */
@RestController
@RequestMapping("/api")
public class ImportEmployeeResource {

    @Autowired
    private EmployeesService employeesService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * Import data CSV.
     * 
     * @param importMode Value specifies how to handle data import.
     *        0: insert data only;<br/>
     *        1: update data only;<br/>
     *        2: insert and update data
     * @param isRegistDuplicatedMode Flag set to handle duplicate data.<br/>
     *        true: registered;<br/>
     *        false: not registered
     * @param matchingKeys Flag case duplication.
     * @param mappingDefinitions List defines mapping column CSV and DB.
     * @param reportMails Report mails list.
     * @param isSimulationMode Flag set to handle simulation.
     * @param fileCsvContent Data CSV.
     * @return Data reference result.
     */
    @PostMapping(path = "/import-employees", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImportEmployeesOutDTO> importEmployees(@RequestBody ImportEmployeesRequest req) {
        ImportEmployeesInDTO importEmployeesInDTO = new ImportEmployeesInDTO();
        importEmployeesInDTO.setImportMode(req.getImportMode());
        importEmployeesInDTO.setRegistDuplicatedMode(req.isRegistDuplicatedMode());
        importEmployeesInDTO.setMatchingKeys(req.getMatchingKeys());
        importEmployeesInDTO.setMappingDefinitions(req.getMappingDefinitions());
        importEmployeesInDTO.setReportMails(req.getReportMails());
        importEmployeesInDTO.setSimulationMode(req.isSimulationMode());
        importEmployeesInDTO.setFileCsvContent(req.getFileCsvContent());
        importEmployeesInDTO.setEmployeeId(jwtTokenUtil.getEmployeeIdFromToken());
        return ResponseEntity.ok(employeesService.importEmployees(importEmployeesInDTO));
    }
}
