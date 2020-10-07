package com.viettel.coms.business;

import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.service.base.dto.DataListDTO;

import javax.servlet.http.HttpServletRequest;

public interface QuantityConstructionBusiness {

    long count();

    DataListDTO doSearch(WorkItemDetailDTO obj, HttpServletRequest request);
}
