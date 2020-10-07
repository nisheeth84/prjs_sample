package com.viettel.wms.business;

import com.viettel.wms.dto.StockDTO;

import java.util.List;

public interface StockBusiness {

    long getTotal();

    List<StockDTO> getStocksForAutocomplete(StockDTO obj);

    List<StockDTO> getStocksForAutocompleteDropDown(StockDTO obj);
}
