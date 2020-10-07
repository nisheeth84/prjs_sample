package com.viettel.aio.business;

import com.viettel.aio.dto.CatUnitDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CatUnitBusiness {

//	CatUnitDTO findByCode(String value);
//
	List<CatUnitDTO> doSearch(CatUnitDTO obj);

	List<CatUnitDTO> getForAutoComplete(CatUnitDTO query);
	
//	List<CatUnitDTO> getForComboBox(CatUnitDTO query);
}
