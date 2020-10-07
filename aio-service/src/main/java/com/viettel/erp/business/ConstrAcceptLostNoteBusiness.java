package com.viettel.erp.business;

import com.viettel.erp.dto.ConstrAcceptLostNoteDTO;

import java.util.List;

public interface ConstrAcceptLostNoteBusiness {

    long count();

    List<ConstrAcceptLostNoteDTO> getValueLossById(Long contractId);
}
