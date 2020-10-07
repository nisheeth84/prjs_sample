package com.viettel.aio.business;

import com.viettel.aio.dto.CatTaskHCQTDTO;

import java.util.List;

/**
 * @author HIENVD
 */

public interface CatTaskHCQTBusiness {

//	List<CatTaskHCQTDTO> doSearch(CatTaskHCQTDTO obj);

	List<CatTaskHCQTDTO> getForAutoComplete(CatTaskHCQTDTO query);
}
