package com.viettel.aio.business;

import com.viettel.aio.dto.CntContractWarrantyDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CntContractWarrantyBusiness {

//	CntContractWarrantyDTO findByValue(String value);

	List<CntContractWarrantyDTO> doSearch(CntContractWarrantyDTO obj);
	
	List<CntContractWarrantyDTO> getForAutoComplete(CntContractWarrantyDTO query);
}
