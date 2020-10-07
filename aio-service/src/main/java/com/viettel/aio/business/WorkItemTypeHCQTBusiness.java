package com.viettel.aio.business;

import com.viettel.aio.dto.WorkItemTypeHCQTDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface WorkItemTypeHCQTBusiness {

	List<WorkItemTypeHCQTDTO> doSearch(WorkItemTypeHCQTDTO obj);

	List<WorkItemTypeHCQTDTO> getForAutoComplete(WorkItemTypeHCQTDTO query);
}
