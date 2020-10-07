package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO sub type for API getEmployeeHistory
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode
public class GetEmployeeHistoryOutSubType1DTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 767380583875565285L;

    /**
     * createDate
     */
    private String createdDate;

    /**
     * createUser
     */
    private Long createdUser;

    /**
     * createdUserName
     */
    private String createdUserName;

    /**
     * createdUserImage
     */
    private String createdUserImage;

    /**
     * contentChange
     */
    private String contentChange;

}
