package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.GetCustomersTabSubType1DTO;
import lombok.Data;

/**
 * GetCustomersTabRequest
 */
@Data
public class GetCustomersTabRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2281932885317834116L;

    private Integer tabBelong;
    private Integer currentPage;
    private Integer limit;
    private List<GetCustomersTabSubType1DTO> searchConditions;
}
