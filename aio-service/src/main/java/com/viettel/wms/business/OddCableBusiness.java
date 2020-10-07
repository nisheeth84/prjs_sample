package com.viettel.wms.business;

import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.dto.OddCableDTO;

public interface OddCableBusiness {

    long count();

    DataListDTO doSearch(OddCableDTO obj);
}
