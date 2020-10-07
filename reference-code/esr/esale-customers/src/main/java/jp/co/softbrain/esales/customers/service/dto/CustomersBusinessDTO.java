package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.customers.domain.CustomersBusiness;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for the entity {@link CustomersBusiness}
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomersBusinessDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -400590029938597571L;

    /**
     * customerBusinessId
     */
    private Long customerBusinessId;

    /**
     * customerBusinessName
     */
    private String customerBusinessName;

    /**
     * customerBusinessParent
     */
    private Long customerBusinessParent;

}
