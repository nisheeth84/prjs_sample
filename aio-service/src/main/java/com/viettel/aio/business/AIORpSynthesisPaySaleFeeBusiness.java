package com.viettel.aio.business;

import com.viettel.aio.dto.AIORpSynthesisPaySaleFeeDTO;
import com.viettel.service.base.dto.DataListDTO;

public interface AIORpSynthesisPaySaleFeeBusiness {
    DataListDTO doSearch(AIORpSynthesisPaySaleFeeDTO criteria);

    String exportExcel(AIORpSynthesisPaySaleFeeDTO dto) throws Exception;
}
