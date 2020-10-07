package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO input of API getEmployeesSuggestion
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class GetEmployeesSuggestionInDTO implements Serializable {

    private static final long serialVersionUID = -5887187375285139411L;
    /**
     * startTime
     */
    private String startTime;
    /**
     * endTime
     */
    private String endTime;
    /**
     * searchType
     */
    private Long searchType;

}
