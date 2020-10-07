package com.viettel.wms.business;

import com.viettel.wms.dto.ObjectReferenceGoodsDetailDTO;

import java.util.List;

public interface ObjectReferenceGoodsDetailBusiness {

    long count();

    List<ObjectReferenceGoodsDetailDTO> getGoodsDetail(ObjectReferenceGoodsDetailDTO obj);
}
