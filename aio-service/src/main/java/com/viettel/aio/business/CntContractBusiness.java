package com.viettel.aio.business;

import com.viettel.aio.dto.CntConstrWorkItemTaskDTO;
import com.viettel.aio.dto.CntContractDTO;
import com.viettel.service.base.dto.DataListDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CntContractBusiness {

	List<CntContractDTO> doSearch(CntContractDTO obj);
	
	List<CntContractDTO> getForAutoComplete(CntContractDTO query);
	
//	hoanm1_20180308_start
	List<CntContractDTO> getListContract(CntContractDTO obj);
	
	List<CntContractDTO> getListContractKTTS(CntContractDTO obj);
	
	List<CntContractDTO> getForAutoCompleteMap(CntContractDTO query);
	
	List<CntContractDTO> getForAutoCompleteKTTS(CntContractDTO query);
	
	CntContractDTO findByCodeKTTS(String value);
//	hoanm1_20180308_end

	CntContractDTO findByCode(CntContractDTO obj);

//	List<CntContractDTO> getForAutoCompleteContract(CntContractDTO obj);

	DataListDTO doSearchContractOut(CntContractDTO obj);

	CntContractDTO getIdConstract(String value);

	List<CntConstrWorkItemTaskDTO> getDetailById(Long id);
}
