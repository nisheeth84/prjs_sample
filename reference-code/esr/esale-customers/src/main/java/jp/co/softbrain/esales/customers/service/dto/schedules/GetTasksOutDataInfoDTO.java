package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTasksOutDataInfoDTO
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class GetTasksOutDataInfoDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -976754136575365775L;

    /**
     * tasks
     */
    private List<GetTasksOutTaskDTO> tasks = new ArrayList<>();

    /**
     * countTask
     */
    private Integer countTask;

    /**
     * countTotalTask
     */
    private Integer countTotalTask;
    
    /**
     * badges
     */
    private Long badges;
}
