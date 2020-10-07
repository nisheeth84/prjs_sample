package com.viettel.erp.business;

import com.viettel.erp.dto.BMaterialAcceptMerListDTO;

import java.util.List;

public interface BMaterialAcceptMerListBusiness {

    long count();

    List<BMaterialAcceptMerListDTO> getAccpetMerList(Long bMaterialAcceptanceId);
}
