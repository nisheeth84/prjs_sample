package com.viettel.wms.business;

import com.viettel.wms.dto.GoodsDTO;
import com.viettel.wms.dto.ShipmentGoodsDTO;

import java.util.List;

public interface ShipmentGoodsBusiness {

    long count();

    List<ShipmentGoodsDTO> getGoodsInfoByCode(String code);

    public List<ShipmentGoodsDTO> importQuantitative(String fileInput, Long id) throws Exception;

    String exportExcelTemplate(ShipmentGoodsDTO obj) throws Exception;

    String exportExcelError(GoodsDTO errorObj) throws Exception;

    Long addShipmentGoodsList(List<ShipmentGoodsDTO> obj);

}
