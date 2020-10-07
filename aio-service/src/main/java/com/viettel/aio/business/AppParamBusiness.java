package com.viettel.aio.business;

import com.viettel.aio.dto.AppParamDTO;

import java.util.List;

public interface AppParamBusiness {

	 List<AppParamDTO> doSearch(AppParamDTO appParamDTO);
}
