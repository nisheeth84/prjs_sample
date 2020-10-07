package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * response of UpdateCompany API
 * 
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCompanyResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7076314552136762119L;

    /**
     * businessCardCompanyId
     */
    private List<Long> businessCardCompanyId = new ArrayList<>();
}