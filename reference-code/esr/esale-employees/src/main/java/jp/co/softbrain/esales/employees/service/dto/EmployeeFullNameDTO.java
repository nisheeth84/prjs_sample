package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jp.co.softbrain.esales.utils.StringUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
@JsonIgnoreProperties(ignoreUnknown = true)
public class EmployeeFullNameDTO implements Serializable {

    private static final long serialVersionUID = 1867029496840491878L;

    public EmployeeFullNameDTO(Long employeeId, String employeeSurname, String employeeName, String employeeSurnameKana,
            String employeeNameKana, String photoFileUrl) {
        this.employeeId = employeeId;
        this.employeeSurname = employeeSurname;
        this.employeeName = employeeName;
        this.employeeSurnameKana = employeeSurnameKana;
        this.employeeNameKana = employeeNameKana;
        this.photoFileUrl = photoFileUrl;
        this.employeeFullName = StringUtil.getFullName(employeeSurname, employeeName);
    }

    /**
     * The employeeId
     */
    private Long employeeId;
    /**
     * The employee name
     */
    private String employeeFullName;

    /**
     * The Employees employeeSurname
     */
    private String employeeSurname;

    /**
     * The Employees employeeName
     */
    private String employeeName;

    /**
     * The Employees employeeSurnameKana
     */
    private String employeeSurnameKana;

    /**
     * The Employees employeeNameKana
     */
    private String employeeNameKana;

    /**
     * photoFileUrl
     */
    private String photoFileUrl;
}
