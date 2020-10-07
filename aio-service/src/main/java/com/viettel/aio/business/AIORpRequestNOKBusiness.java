package com.viettel.aio.business;

import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.service.base.dto.DataListDTO;

public interface AIORpRequestNOKBusiness {
    DataListDTO doSearch(AIOOrdersDTO criteria);

    String exportExcel(AIOOrdersDTO dto) throws Exception;
}
