package com.viettel.wms.business;

import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.dto.StockGoodsSerialDTO;
import com.viettel.wms.dto.StockTransDTO;

public interface StockGoodsSerialBusiness {

    long count();

    DataListDTO doSearchFindSerial(StockGoodsSerialDTO obj);

    DataListDTO doSearchHistory(StockTransDTO obj);

    void updateBySerial(StockGoodsSerialDTO stockGoodsSerialDTO);


}
