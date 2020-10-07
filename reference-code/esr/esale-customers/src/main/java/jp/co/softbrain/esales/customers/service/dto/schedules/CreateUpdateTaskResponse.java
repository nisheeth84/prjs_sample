package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * response for API create/update task
 * 
 * @author buithingocanh
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateUpdateTaskResponse implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;
    /**
     * taskId
     */
    private Long taskId;

}
