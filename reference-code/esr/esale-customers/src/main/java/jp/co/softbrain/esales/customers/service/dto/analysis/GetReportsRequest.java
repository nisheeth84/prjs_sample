package jp.co.softbrain.esales.customers.service.dto.analysis;

import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import lombok.Data;

@Data
public class GetReportsRequest {

    private Long reportCategoryId;
    private Long serviceId;
    private Integer limit = ConstantsCustomers.LIST_LIMIT;
    private Integer offset = 0;
}
