package com.viettel.aio.business;

import com.viettel.aio.dto.WorkItemQuotaDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface WorkItemQuotaBusiness {

	List<WorkItemQuotaDTO> doSearch(WorkItemQuotaDTO obj);
	
/*	List<WorkItemQuotaDTO> getForAutoComplete(WorkItemQuotaDTO query);
	
    public List<WorkItemQuotaDTO> importWorkItemQuota(String fileInput, Long quotaType) throws Exception;*/
}
