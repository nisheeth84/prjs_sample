package com.viettel.aio.business;

import com.viettel.aio.dto.CntContractAcceptanceCstDTO;
import com.viettel.aio.dto.CntContractAcceptanceDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CntContractAcceptanceBusiness {

//	CntContractAcceptanceDTO findByValue(String value);

	List<CntContractAcceptanceDTO> doSearch(CntContractAcceptanceDTO obj);
	
//	List<CntContractAcceptanceDTO> getForAutoComplete(CntContractAcceptanceDTO query);
	boolean addConstrucionAcceptance(CntContractAcceptanceDTO cstDTO);
	List<CntContractAcceptanceCstDTO> getAcceptanceCstByAcceptanceId(CntContractAcceptanceDTO cstDTO);
	boolean removeAcceptanceCst(List<CntContractAcceptanceCstDTO> lstCst);
	boolean addGoodsAcceptance(CntContractAcceptanceDTO cstDTO);
	boolean addStockTransAcceptance(CntContractAcceptanceDTO obj);
}
