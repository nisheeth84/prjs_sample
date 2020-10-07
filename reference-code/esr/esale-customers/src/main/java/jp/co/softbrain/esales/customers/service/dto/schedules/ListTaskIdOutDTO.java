package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Object contains list taskId
 */
@Data
@EqualsAndHashCode
public class ListTaskIdOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2236649571675726046L;

    /**
     * taskIds
     */
    private List<Long> taskIds = new ArrayList<>();

}
