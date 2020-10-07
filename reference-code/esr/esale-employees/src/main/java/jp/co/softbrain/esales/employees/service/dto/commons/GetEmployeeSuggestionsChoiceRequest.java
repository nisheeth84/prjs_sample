/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetEmployeeSuggestionsChoiceRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -397439582910216365L;

    private List<String> index;
    private Long employeeId;
    private Integer limit;
}
