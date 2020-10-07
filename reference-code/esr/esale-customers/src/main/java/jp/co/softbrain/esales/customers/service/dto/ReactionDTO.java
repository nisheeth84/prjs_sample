package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * ReactionDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class ReactionDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6597529068196882131L;

    /**
     * reationType
     */
    private Integer reationType;
    /**
     * employeeId
     */
    private Long employeeId;
    /**
     * employeeName
     */
    private String employeeName;
    /**
     * employeePhoto
     */
    private String employeePhoto;

}
