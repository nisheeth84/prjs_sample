package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Input ID Task class
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class TaskIdInput implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5955484000675577396L;

    /**
     * taskId
     */
    private Long taskId;
}
