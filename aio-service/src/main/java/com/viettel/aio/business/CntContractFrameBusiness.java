package com.viettel.aio.business;

import com.viettel.aio.dto.CntContractDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CntContractFrameBusiness {

//	List<CntContractDTO> doSearch(CntContractDTO obj);
	
	List<CntContractDTO> getForAutoComplete(CntContractDTO query);
//	List<CntContractDTO> doSearchContract(CntContractDTO obj);
//
//	CntContractDTO findByCode(CntContractDTO obj);
//
//	List<CntContractDTO> getForAuto(CntContractDTO query);
}
