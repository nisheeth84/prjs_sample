/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO groups for api getGroupAndDepartmentByName
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetGroupByNameDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2837804775709478593L;

    private Long groupId;
    private String groupName;
}
