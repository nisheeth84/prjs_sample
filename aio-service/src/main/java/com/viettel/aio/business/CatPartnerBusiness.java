package com.viettel.aio.business;

import com.viettel.aio.dto.CatPartnerDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CatPartnerBusiness {

//	CatPartnerDTO findByCode(String value);
//
//	List<CatPartnerDTO> doSearch(CatPartnerDTO obj);
	
	List<CatPartnerDTO> getForAutoComplete(CatPartnerDTO query);
	
//	List<CatPartnerDTO> getForComboBox(CatPartnerDTO query);
}
