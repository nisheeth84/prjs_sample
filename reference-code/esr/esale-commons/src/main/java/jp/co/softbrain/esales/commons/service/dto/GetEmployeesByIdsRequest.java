/**
 * 
 */
package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data request for get employees by Id
 * 
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetEmployeesByIdsRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -9002765613975590324L;
    
    private List<Long> employeeIds;
}
