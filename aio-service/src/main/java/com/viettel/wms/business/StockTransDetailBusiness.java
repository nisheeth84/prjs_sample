package com.viettel.wms.business;

import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.dto.GoodsDTO;
import com.viettel.wms.dto.StockTransDetailDTO;

import java.util.List;

public interface StockTransDetailBusiness {

    long count();

    DataListDTO doSearchGoodsForImportNote(StockTransDetailDTO obj);

    List<StockTransDetailDTO> getGoodsInfoFromAlternativeStockByCode(String code);

    DataListDTO doSearchGoodsForExportNote(StockTransDetailDTO obj);

    boolean createNote(List<StockTransDetailDTO> os);

    public String exportStockTransExcelError(GoodsDTO errorObj) throws Exception;

    List<StockTransDetailDTO> importUpdateStockTrans(String fileInput,
                                                     Long orderId) throws Exception;

    String exportExcelTemplate(StockTransDetailDTO obj) throws Exception;
}
