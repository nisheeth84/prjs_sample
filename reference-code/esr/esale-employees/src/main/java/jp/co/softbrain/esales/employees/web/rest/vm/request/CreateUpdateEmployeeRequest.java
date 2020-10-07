package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import javax.servlet.http.Part;

import org.springframework.web.multipart.MultipartFile;

import jp.co.softbrain.esales.employees.service.dto.CreateUpdateEmployeeInDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Request for API create/update employee
 * 
 * @author nguyentrunghieu
 */
@Data
@AllArgsConstructor
public class CreateUpdateEmployeeRequest implements Serializable {
    private static final long serialVersionUID = -2137629579661833099L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * data
     */
    private CreateUpdateEmployeeInDTO data;

    /**
     * parts
     */
    private List<Part> parts;

    /**
     * files
     */
    private List<MultipartFile> files;

    /**
     * employeeStatus
     */
    private Integer employeeStatus;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
