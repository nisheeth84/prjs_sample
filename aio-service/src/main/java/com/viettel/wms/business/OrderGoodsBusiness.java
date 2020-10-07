package com.viettel.wms.business;

import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.dto.OrderGoodsDTO;
import com.viettel.wms.dto.OrderGoodsDetailDTO;

import java.util.List;

public interface OrderGoodsBusiness {

    long count();

    DataListDTO doSearchGoodsForImportReq(OrderGoodsDTO obj);

    public List<OrderGoodsDetailDTO> importCells(String fileInput, Long id) throws Exception;

    public List<OrderGoodsDTO> importGoods(String fileInput) throws Exception;

//	public List<OrderGoodsDTO> importOrderGood(String fileInput);

    DataListDTO doSearchGoodsForExportOrder(OrderGoodsDTO obj);

    String exportExcelError(OrderGoodsDetailDTO errorObj) throws Exception;

    boolean saveGoodsList(List<OrderGoodsDTO> orderGoods);

    String exportExcelTemplate(OrderGoodsDTO obj) throws Exception;

    List<OrderGoodsDTO> getGoodDetail(Long orderId);

}
