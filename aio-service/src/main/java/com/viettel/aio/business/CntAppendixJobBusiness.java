package com.viettel.aio.business;

import com.viettel.aio.dto.CntAppendixJobDTO;

import java.util.List;

public interface CntAppendixJobBusiness {
    //hienvd: Start 8/7/2019
    public List<CntAppendixJobDTO> doSearchAppendixJob(CntAppendixJobDTO criteria);
    //hienvd: End

}
