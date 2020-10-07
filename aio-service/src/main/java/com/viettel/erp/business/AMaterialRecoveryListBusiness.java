package com.viettel.erp.business;

import com.viettel.erp.dto.AMaterialRecoveryListModelDTO;

import java.util.List;

public interface AMaterialRecoveryListBusiness {

    long count();

    List<AMaterialRecoveryListModelDTO> findByConstructId(Long constructId);
}
