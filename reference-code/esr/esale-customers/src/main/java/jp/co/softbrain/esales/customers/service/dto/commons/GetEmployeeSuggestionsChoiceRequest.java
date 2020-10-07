/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author nguyentienquan
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetEmployeeSuggestionsChoiceRequest implements Serializable {

    private static final long serialVersionUID = 1528194838081720565L;

    private List<String> index;
    private Long employeeId;
    private Integer limit;
}
