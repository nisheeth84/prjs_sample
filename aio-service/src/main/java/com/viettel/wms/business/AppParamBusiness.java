package com.viettel.wms.business;

import com.viettel.wms.dto.AppParamDTO;

import java.util.List;

public interface AppParamBusiness {

    long getTotal();


    List<AppParamDTO> getFileDrop();
}
