package com.viettel.erp.business;

import com.viettel.erp.dto.ConstrAcceptWorkListDTO;

import java.util.List;

public interface ConstrAcceptWorkListBusiness {

    long count();

    List<ConstrAcceptWorkListDTO> getAllbyConstructId(Long constructId);

    List<ConstrAcceptWorkListDTO> getProposedSettlementById(Long contractId);
}
