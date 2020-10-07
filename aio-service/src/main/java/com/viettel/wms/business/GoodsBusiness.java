package com.viettel.wms.business;

import com.viettel.wms.dto.GoodsDTO;

import java.util.List;

public interface GoodsBusiness {

    long count();

    List<GoodsDTO> getGoodsForOrder(GoodsDTO obj);

    GoodsDTO getGoodByCode(String goodcode);

    // GoodsDTO getGoodById(Long id);
    GoodsDTO getGoodById(GoodsDTO obj);

}
