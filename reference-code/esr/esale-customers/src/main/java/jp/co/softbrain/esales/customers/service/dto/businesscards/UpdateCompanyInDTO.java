package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * UpdateCompanyInDTO
 * 
 * @author ngant
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCompanyInDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5551433834545100263L;

    /**
     * customerId
     */
    private Long customerId;

    /**
     * customerName
     */
    private String customerName;

}
