package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class DownloadEmployeeNameDTO implements Serializable {

    private static final long serialVersionUID = 3332323737254555983L;

    private Long targetId;
    /**
     * The employeeId
     */
    private Long employeeId;
    /**
     * The employee name
     */
    private String employeeName = "";
}
