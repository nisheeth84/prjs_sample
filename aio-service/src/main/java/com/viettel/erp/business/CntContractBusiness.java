package com.viettel.erp.business;

import com.viettel.erp.dto.CntContractDTO;

import java.util.List;

public interface CntContractBusiness {

    long count();

    //  Hungnx 130618 start
    List<CntContractDTO> doSearch(CntContractDTO cntContractDTO);
//  Hungnx 130618 end
}
