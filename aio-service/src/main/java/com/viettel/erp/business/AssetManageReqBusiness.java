package com.viettel.erp.business;

import com.viettel.erp.dto.AssetManageReqDTO;

import java.util.List;

public interface AssetManageReqBusiness {

    long count();

    List<AssetManageReqDTO> getValueSuppliesById(Long contractId);

    List<AssetManageReqDTO> getTotalPriceById(Long contractId);
}
