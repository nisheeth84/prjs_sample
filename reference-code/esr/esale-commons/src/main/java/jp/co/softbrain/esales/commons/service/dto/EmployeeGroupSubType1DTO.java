package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The keyValue class to map data for CreateGroupIn
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class EmployeeGroupSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8246274902970986352L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * participantGroupId
     */
    private Long participantGroupId;

    /**
     * participantType
     */
    private Integer participantType;

}
