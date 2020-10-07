package com.viettel.wms.business;

import com.viettel.wms.dto.OrderChangeGoodsDetailDTO;

import java.util.List;

public interface OrderChangeGoodsDetailBusiness {

    long count();

    List<OrderChangeGoodsDetailDTO> importGoods(String fileInput) throws Exception;
}
