package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTaskTabSubType2DTO
 * 
 * @author nguyenductruong
 *
 */
@Data
@EqualsAndHashCode
public class GetTaskTabSubType2DTO implements Serializable {

    private static final long serialVersionUID = 5661944173075694702L;

    /**
     * The customerId
     */
    private Long customerId;
    /**
     * The customerName
     */
    private String customerName;

}
