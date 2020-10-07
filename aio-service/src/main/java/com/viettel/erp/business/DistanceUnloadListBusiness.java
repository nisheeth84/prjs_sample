package com.viettel.erp.business;

import com.viettel.erp.dto.DistanceUnloadListDTO;

import java.util.List;

public interface DistanceUnloadListBusiness {

    long count();

    List<DistanceUnloadListDTO> doSearchByDisUnloadConsMinId(Long disUnloadConsMinId);
}
