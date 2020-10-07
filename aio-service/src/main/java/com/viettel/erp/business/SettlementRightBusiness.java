package com.viettel.erp.business;

import com.viettel.erp.dto.SettlementRightDTO;

import java.util.List;

public interface SettlementRightBusiness {

    long count();

    public List<SettlementRightDTO> getAllAMonitorOrBInChargeByConstructId(SettlementRightDTO dto);

    //minhpvn : lay nguoi ky quyet toan a-b form 6
    public List<SettlementRightDTO> getAllAMonitorOrBInChargeByConstructIdForm6(SettlementRightDTO dto);
}
