package com.viettel.erp.business;

import com.viettel.erp.dto.CurrentStateHandoverListDTO;

import java.util.List;

public interface CurrentStateHandoverListBusiness {

    long count();

    public List<CurrentStateHandoverListDTO> getCurrentStateHandoverByListId(Long id);

    public boolean deleteMutilRecord(List<String> listReportID);
}
