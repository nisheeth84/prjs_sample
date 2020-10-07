package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO input for API createDataChangeElasticSearch
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class CreateDataChangeElasticSearchInDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2930421845342250243L;
    /**
     * fieldName
     */
    private String fieldName;
    /**
     * fieldValue
     */
    private List<Long> fieldValue;

}
