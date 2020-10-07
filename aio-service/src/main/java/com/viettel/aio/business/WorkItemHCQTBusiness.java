package com.viettel.aio.business;

import com.viettel.aio.dto.WorkItemHCQTDTO;

import java.util.List;

/**
 * @author HIENVD
 */

public interface WorkItemHCQTBusiness {

    List<WorkItemHCQTDTO> doSearch(WorkItemHCQTDTO query);

	List<WorkItemHCQTDTO> getForAutoComplete(WorkItemHCQTDTO query);
}
