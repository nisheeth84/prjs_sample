package com.viettel.aio.business;

import com.viettel.aio.dto.AIORpContractPayrollDTO;
import com.viettel.service.base.dto.DataListDTO;

public interface AIORpContractPayrollBusiness {
    DataListDTO doSearch(AIORpContractPayrollDTO criteria);
}

