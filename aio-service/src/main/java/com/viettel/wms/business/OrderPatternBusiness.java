package com.viettel.wms.business;

import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.dto.OrderPatternDTO;

public interface OrderPatternBusiness {

    long count();

    DataListDTO doSearch(OrderPatternDTO obj);

    DataListDTO viewDetail(OrderPatternDTO obj);
}
