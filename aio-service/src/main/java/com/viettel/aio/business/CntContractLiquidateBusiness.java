package com.viettel.aio.business;

import com.viettel.aio.dto.CntContractLiquidateDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CntContractLiquidateBusiness {

	CntContractLiquidateDTO findByValue(String value);

	List<CntContractLiquidateDTO> doSearch(CntContractLiquidateDTO obj);
	
	List<CntContractLiquidateDTO> getForAutoComplete(CntContractLiquidateDTO query);
}
