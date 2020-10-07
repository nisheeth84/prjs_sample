package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * GetFullEmployeesByParticipantResponse
 * 
 * @author nguyenhaiduong
 */
@Data
public class GetFullEmployeesByParticipantResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6564355368504223321L;

    /**
     * employeesIdsParticipant
     */
    private List<Long> employeesIdsParticipant;

}
