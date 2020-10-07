package com.viettel.erp.business;

import com.viettel.erp.dto.VConstructionHcqtDTO;

import java.util.List;

public interface VConstructionHcqtBusiness {

    long count();

    List<VConstructionHcqtDTO> getContractTotalValueById(Long contractId);

}
