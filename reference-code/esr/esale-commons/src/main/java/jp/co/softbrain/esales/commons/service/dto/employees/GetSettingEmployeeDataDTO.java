package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Data response for API getSettingEmployees
 * 
 * @author lehuuhoa
 */
@Data
@EqualsAndHashCode
public class GetSettingEmployeeDataDTO implements Serializable {

    private static final long serialVersionUID = 7237163656510593583L;
    
    private Long employeeId;
    
    private String employeeName;
    
    private Boolean isNoticeSchedule;
    
    private Boolean isNoticeTask;
    
    private Boolean isNoticeMilestone;
    
    private String mail;
    
    private String languageCode;
}
