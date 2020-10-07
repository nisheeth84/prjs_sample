package com.viettel.aio.business;

import com.viettel.aio.dto.WorkItemDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface WorkItemBusiness {



	List<WorkItemDTO> doSearch(WorkItemDTO obj);
	
	List<WorkItemDTO> getForAutoComplete(WorkItemDTO query);
}
