package com.viettel.wms.business;

import com.viettel.wms.dto.StockCellDTO;

import java.util.List;


public interface StockCellBusiness {

    long count();

    public List<StockCellDTO> importStockCell(String fileInput);

    String exportStockCellExcel() throws Exception;
}
