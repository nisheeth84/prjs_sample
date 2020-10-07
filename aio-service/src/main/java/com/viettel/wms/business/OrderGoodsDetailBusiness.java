package com.viettel.wms.business;

import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.dto.OrderGoodsDetailDTO;

public interface OrderGoodsDetailBusiness {

    long count();

    DataListDTO doSearchGoodsDetailForImportReq(OrderGoodsDetailDTO obj);

    DataListDTO doSearchGoodsDetailForExportReq();

}
