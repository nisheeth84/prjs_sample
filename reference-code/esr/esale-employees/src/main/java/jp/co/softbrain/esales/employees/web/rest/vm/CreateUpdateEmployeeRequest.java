package jp.co.softbrain.esales.employees.web.rest.vm;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import javax.servlet.http.Part;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request for API create/update employee
 *
 * @author nguyentrunghieu
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateUpdateEmployeeRequest implements Serializable {
    private static final long serialVersionUID = -2137629579661833099L;

    /**
     * @param operations
     * @param employeeId
     * @param data
     * @param parts
     * @param files
     * @param employeeStatus
     * @param updatedDate
     * @param filesMap
     */
    public CreateUpdateEmployeeRequest(String operations, Long employeeId, String data, List<Part> parts,
            List<MultipartFile> files, Integer employeeStatus, Instant updatedDate, List<String> filesMap) {
        this.operations = operations;
        this.employeeId = employeeId;
        this.data = data;
        this.parts = parts;
        this.files = files;
        this.employeeStatus = employeeStatus;
        this.updatedDate = updatedDate;
        this.filesMap = filesMap;
    }

    private String operations;
    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * data
     */
    private String data;

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

    private List<String> filesMap;

    /**
     * formatDateId
     */
    private Integer formatDateId;

    /**
     * packageIds
     */
    private List<Long> packageIds;

    /**
     * isAccessContractSite
     */
    private Boolean isAccessContractSite;

    /**
     * comment
     */
    private String comment;

    /**
     * isAdmin
     */
    private Boolean isAdmin;

    /**
     * isSendMail
     */
    private Boolean isSendMail;

    /**
     * transID
     */
    private String transID;
}
