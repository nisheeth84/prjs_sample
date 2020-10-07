package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Out DTO sub type class for API get group and employee
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GroupEmployeeListDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3572951025798893724L;

    /**
     * groupId
     */
    private Long groupId;

    /**
     * groupName
     */
    private String groupName;

    /**
     * list employee full name
     */
    private String listEmployeeFullName;
}
