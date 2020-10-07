package jp.co.softbrain.esales.employees.web.rest;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.TmsService;
import jp.co.softbrain.esales.employees.service.dto.CreateUpdateEmployeeInDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.CreateUpdateEmployeeRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.CreateUpdateEmployeeResponse;
import jp.co.softbrain.esales.tms.TransIDHolder;
import jp.co.softbrain.esales.utils.S3FileUtil;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.FileMappingDTO;

/**
 * Create/Update an employee
 *
 * @author haiCN
 */
@RestController
@RequestMapping("/api")
public class CreateUpdateEmployeeResource {

    @Autowired
    private EmployeesService employeesService;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private TmsService tmsService;

    /**
     * Create an employee
     *
     * @param data employee's data need to create
     * @return Long id of the created employee
     */
    @PostMapping(path = "/create-employee", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateUpdateEmployeeResponse> createEmployee(
            @ModelAttribute CreateUpdateEmployeeRequest input) throws IOException {
        CreateUpdateEmployeeInDTO data = mapper.readValue(input.getData(), CreateUpdateEmployeeInDTO.class);
        List<FileMappingDTO> filesMap = S3FileUtil.creatFileMappingList(input.getFiles(), input.getFilesMap());
        String transID = "";
        Long employeeId = null;
        boolean startNewTransation = false;
        try {
            if (StringUtil.isEmpty(input.getTransID())) {
                transID = tmsService.startTransaction();
                startNewTransation = true;
            } else {
                transID = input.getTransID();
            }
            TransIDHolder.setTransID(transID);
            employeeId = employeesService.createEmployee(data, filesMap, true);
            if (startNewTransation && !StringUtil.isEmpty(transID)) { // Only end transaction if this is root service
                tmsService.endTransaction(transID);
            }
        } catch (Exception ex) {
            if (startNewTransation && !StringUtil.isEmpty(transID)) {
                tmsService.rollbackTransaction(transID);
            }

            throw ex;
        } finally {
            TransIDHolder.removeTransID();
        }

        return ResponseEntity.ok(new CreateUpdateEmployeeResponse(employeeId));
    }

    /**
     * Update an Employee
     *
     * @param data employee's data need to update
     * @param employeeId employee's id need to update
     * @return Long employeeId
     * @throws IOException
     */
    @PostMapping(path = "/update-employee", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateUpdateEmployeeResponse> updateEmployee(
            @ModelAttribute CreateUpdateEmployeeRequest input) throws IOException {
        CreateUpdateEmployeeInDTO data = mapper.readValue(input.getData(), CreateUpdateEmployeeInDTO.class);
        List<FileMappingDTO> filesMap = S3FileUtil.creatFileMappingList(input.getFiles(), input.getFilesMap());
        String transID = "";
        Long employeeId = null;
        boolean startNewTransation = false;
        try {
            if (StringUtil.isEmpty(input.getTransID())) {
                transID = tmsService.startTransaction();
                startNewTransation = true;
            } else {
                transID = input.getTransID();
            }
            TransIDHolder.setTransID(transID);

            employeeId = employeesService.updateEmployee(input.getEmployeeId(), data, filesMap);
            if (startNewTransation && !StringUtil.isEmpty(transID)) { // Only end transaction if this is root service
                tmsService.endTransaction(transID);
            }
        } catch (Exception ex) {
            if (startNewTransation && !StringUtil.isEmpty(transID)) {
                tmsService.rollbackTransaction(transID);
            }
            throw ex;
        } finally {
            // Important: Always use FINALLY, so that we are sure that transID is removed
            // from ThreadLocal correctly!
            TransIDHolder.removeTransID();
        }

        return ResponseEntity.ok(new CreateUpdateEmployeeResponse(employeeId));
    }

    /**
     * update employee status
     *
     * @param employeeId employee's id need to update status
     * @param employeeStatus data need to update
     * @param updatedDate The data is needed for check exclusive
     * @return employeeId after update
     * @throws IOException
     */
    @PostMapping(path = "/update-employee-status", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreateUpdateEmployeeResponse> updateEmployeeStatus(
            @RequestBody CreateUpdateEmployeeRequest input) throws IOException {
        Long employeeIdResponse = employeesService.updateEmployeeStatus(input.getEmployeeId(),
                input.getEmployeeStatus(), input.getUpdatedDate());
        return ResponseEntity.ok(new CreateUpdateEmployeeResponse(employeeIdResponse));
    }
}
