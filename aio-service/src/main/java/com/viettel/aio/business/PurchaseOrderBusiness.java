package com.viettel.aio.business;

import com.viettel.aio.dto.PurchaseOrderDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface PurchaseOrderBusiness {

//	PurchaseOrderDTO findByCode(String value);
//
//	List<PurchaseOrderDTO> doSearch(PurchaseOrderDTO obj);
	
	List<PurchaseOrderDTO> getForAutoComplete(PurchaseOrderDTO query);
	
//	public List<PurchaseOrderDTO> importPurchaseOrder(String fileInput) throws Exception;
}
