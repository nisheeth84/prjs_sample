package com.viettel.aio.business;

import com.viettel.aio.dto.CntContractBreachDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CntContractBreachBusiness {

	CntContractBreachDTO findByValue(String value);

	List<CntContractBreachDTO> doSearch(CntContractBreachDTO obj);
	
	List<CntContractBreachDTO> getForAutoComplete(CntContractBreachDTO query);
}
