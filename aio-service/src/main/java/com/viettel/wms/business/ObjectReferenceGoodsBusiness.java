package com.viettel.wms.business;

import com.viettel.wms.dto.ObjectReferenceGoodsDTO;

import java.util.List;

public interface ObjectReferenceGoodsBusiness {

    long count();

    List<ObjectReferenceGoodsDTO> getGoodsInfoBeforeWarrantyByCode(String code);

    List<ObjectReferenceGoodsDTO> getGoodsInfoAfterWarrantyByCode(String code);

    List<ObjectReferenceGoodsDTO> getGoodsInfoFromConstructionByCode(String code);

    List<ObjectReferenceGoodsDTO> getGoodsInfoFromDepartmentByCode(String code);

    List<ObjectReferenceGoodsDTO> getGoodsInfoFromLoanByCode(String code);
}
