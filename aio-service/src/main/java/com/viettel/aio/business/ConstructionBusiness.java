package com.viettel.aio.business;

import com.viettel.aio.dto.ConstructionDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface ConstructionBusiness {


	List<ConstructionDTO> doSearch(ConstructionDTO obj);
	
	List<ConstructionDTO> getForAutoComplete(ConstructionDTO query);
	
	List<ConstructionDTO> getForAutoCompleteIn(ConstructionDTO query);
}
