/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * @author phamminhphu
 *
 */
@Data
public class MoveToDepartmentResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4314467935791726747L;
    
    private List<Long> idsMovedSuccess;
    
    private List<Long> idsMovedError;
}
