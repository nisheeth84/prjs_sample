package jp.co.softbrain.esales.customers.service.dto.timelines;
/**
 * A DTO for the {@link jp.co.softbrain.esales.} entity.
 * 
 * @author tinhbv
 */
import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@EqualsAndHashCode
public class ObjectIdsDeletesDTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = -1085627617666439902L;
    /**
     * The serialVersionUID
     */
    
    private List<Long> objectIdDeleteFail;
    private List<Long> objectIdDeleteSuccess;
    
    
}
