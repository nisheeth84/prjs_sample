package jp.co.softbrain.esales.employees.web.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.UpdateEmployeesInDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.request.UpdateEmployeesRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.request.UpdateSettingEmployeeRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.UpdateEmployeesResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.UpdateSettingEmployeeResponse;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.S3FileUtil;
import jp.co.softbrain.esales.utils.dto.FileMappingDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

/**
 * Update employees
 *
 * @author lediepoanh
 */
@RestController
@RequestMapping("/api")
public class UpdateEmployeesResource {
    private final Logger log = LoggerFactory.getLogger(UpdateEmployeesResource.class);

    @Autowired
    private EmployeesService employeesService;

    @Autowired
    private ObjectMapper mapper;

    /**
     * Update employees
     *
     * @param req - list employees will update
     * @return list id employee updated
     */
    @PostMapping(path = "/update-employees", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateEmployeesResponse> updateEmployees(@ModelAttribute UpdateEmployeesRequest req) {
        log.debug("parts: {}", req.getParts());
        try {
            UpdateEmployeesResponse result = new UpdateEmployeesResponse();
            TypeReference<List<UpdateEmployeesInDTO>> typeRef = new TypeReference<>() {};
            List<UpdateEmployeesInDTO> data = mapper.readValue(req.getData(), typeRef);
            List<FileMappingDTO> filesMap = S3FileUtil.creatFileMappingList(req.getFiles(), req.getFilesMap());
            result.setList(employeesService.updateEmployees(data, filesMap));
            return ResponseEntity.ok(result);
        } catch (IOException ex) {
            throw new CustomException(ex);
        }
    }

    /**
     * Update setting employee
     *
     * @param request request
     * @return {@link UpdateSettingEmployeeResponse}
     */
    @PostMapping(path = "/update-setting-employee", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateSettingEmployeeResponse> updateSettingEmployee(@RequestBody UpdateSettingEmployeeRequest request) {
        Long employeeId = employeesService.updateSettingEmployee(request);
        return ResponseEntity.ok(new UpdateSettingEmployeeResponse(employeeId));
    }
}
