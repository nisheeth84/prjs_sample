package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO input for API createDataChangeElasticSearch
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class CreateDataChangeElasticSearchInDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5966082862282719642L;
    
    /**
     * fieldName
     */
    private String fieldName;

    /**
     * fieldValue
     */
    private List<Long> fieldValue;

}
