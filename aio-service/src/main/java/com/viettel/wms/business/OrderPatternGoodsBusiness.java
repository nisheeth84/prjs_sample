package com.viettel.wms.business;

import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.dto.OrderPatternGoodsDTO;

public interface OrderPatternGoodsBusiness {
    DataListDTO getPatternGoodsByOrderPatternId(OrderPatternGoodsDTO obj);

    DataListDTO doSearch(OrderPatternGoodsDTO obj);

    long count();
}
