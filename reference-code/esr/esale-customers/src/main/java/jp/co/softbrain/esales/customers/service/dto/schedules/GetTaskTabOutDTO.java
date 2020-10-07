package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTaskTabOutDTO
 * 
 * @author nguyenductruong
 *
 */
@Data
@EqualsAndHashCode
public class GetTaskTabOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7630023838329947650L;

    /**
     * The list object GetTaskTabSubType1DTO
     */
    private List<GetTaskTabSubType1DTO> tasks;
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
