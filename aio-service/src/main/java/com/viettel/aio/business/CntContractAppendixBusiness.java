package com.viettel.aio.business;

import com.viettel.aio.dto.CntContractAppendixDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CntContractAppendixBusiness {

//	CntContractAppendixDTO findByValue(String value);

	List<CntContractAppendixDTO> doSearch(CntContractAppendixDTO obj);
	
	List<CntContractAppendixDTO> getForAutoComplete(CntContractAppendixDTO query);
}
