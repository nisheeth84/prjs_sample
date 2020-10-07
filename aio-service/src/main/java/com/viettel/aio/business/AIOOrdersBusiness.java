package com.viettel.aio.business;

import java.util.List;

import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.service.base.dto.DataListDTO;

public interface AIOOrdersBusiness {

	List<AIOOrdersDTO> autoSearchCatProvice(String keySearch);

	List<AIOOrdersDTO> autoSearchService();

	List<AIOOrdersDTO> autoSearchChanel();

	Long add(AIOOrdersDTO obj);

	AIOOrdersDTO viewDetail(AIOOrdersDTO obj);

	Long confirmStatus(AIOOrdersDTO obj);

	Long confirmList(AIOOrdersDTO obj);

	DataListDTO popupSearchCatProvice(AIOOrdersDTO obj);

}
