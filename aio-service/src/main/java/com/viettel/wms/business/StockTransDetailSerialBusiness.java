package com.viettel.wms.business;

import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.dto.StockTransDetailSerialDTO;

import java.util.List;

public interface StockTransDetailSerialBusiness {

    long count();

    DataListDTO doSearchGoodsDetailForImportNote(StockTransDetailSerialDTO obj);

    List<StockTransDetailSerialDTO> getGoodsInfoByCode(String code);

    DataListDTO doSearchGoodsDetailForExportNote();

    List<StockTransDetailSerialDTO> getGoodsDetail(StockTransDetailSerialDTO obj);

    DataListDTO doSearchGoodsDetailForExportNote(StockTransDetailSerialDTO obj);

    DataListDTO doSearchGoodsDetailSerial(StockTransDetailSerialDTO obj);


}
