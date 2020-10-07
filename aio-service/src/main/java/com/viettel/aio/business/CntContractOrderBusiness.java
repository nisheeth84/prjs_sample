package com.viettel.aio.business;

import com.viettel.aio.dto.CntContractOrderDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CntContractOrderBusiness {

	CntContractOrderDTO findByValue(String value);

	List<CntContractOrderDTO> doSearch(CntContractOrderDTO obj);
	
	List<CntContractOrderDTO> getForAutoComplete(CntContractOrderDTO query);
}
