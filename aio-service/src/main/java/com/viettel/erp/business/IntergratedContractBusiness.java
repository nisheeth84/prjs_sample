package com.viettel.erp.business;

import com.viettel.erp.dto.IntergratedContractDTO;

import java.util.List;

public interface IntergratedContractBusiness {

    long count();

    List<IntergratedContractDTO> getIntergratedContractConstrt(IntergratedContractDTO dto);
}
