package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request for API getOrganization
 * 
 * @author Trungnd
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetOrganizationRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2230981095595566821L;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * departmentName
     */
    private String departmentName;

    /**
     * groupName
     */
    private String groupName;

}
