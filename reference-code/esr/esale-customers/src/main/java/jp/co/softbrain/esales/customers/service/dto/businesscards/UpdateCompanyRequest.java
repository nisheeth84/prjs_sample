package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * UpdateCompanyRequest
 * 
 * @author ngant
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCompanyRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -5954450774808165022L;

    /**
     * customers
     */
    private List<UpdateCompanyInDTO> customers;
}
