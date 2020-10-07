/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * View model for API create/update employee
 * 
 * @author nguyentrunghieu
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetRelationDataRequest implements Serializable {

    private static final long serialVersionUID = 1374242871212586452L;

    /**
     * listIds
     */
    private List<Long> listIds;

    /**
     * fieldBelong
     */
    private Integer fieldBelong;

    /**
     * fieldIds
     */
    private List<Long> fieldIds;
}
