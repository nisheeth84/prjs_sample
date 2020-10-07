package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of API getEmployeeMails
 * 
 * @author vuvankien
 */
@Data
@EqualsAndHashCode
public class GetEmployeeMailsOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2231085877883667248L;

    /**
     * List mails of employee
     */
    private List<String> mails;
}
