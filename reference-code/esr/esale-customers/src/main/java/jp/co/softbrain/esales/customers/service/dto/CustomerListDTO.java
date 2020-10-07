package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO customerList for API getDataSyncElasticSearch
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
public class CustomerListDTO implements Serializable {
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 8568034825046952259L;

    /**
     * customerListId
     */
    private Long customerListId;

    /**
     * customerListName
     */
    private String customerListName;

}
