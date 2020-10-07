package com.viettel.aio.business;

import com.viettel.cat.dto.CatTaskDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CatTaskBusiness {

//	CatTaskDTO findByCode(String value);

	List<CatTaskDTO> doSearch(CatTaskDTO obj);
	
	List<CatTaskDTO> getForAutoComplete(CatTaskDTO query);
}
