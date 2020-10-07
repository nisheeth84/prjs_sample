package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetCusomtersSubType1OutDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class GetCustomersOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7410549561397583496L;

    /**
     * totalRecords
     */
    private int totalRecords;

    /**
     * customers
     */
    private List<GetCustomersOutDataInfosDTO> customers;

    /**
     * @param lastUpdatedDate
     */
    private Instant lastUpdatedDate;

}
