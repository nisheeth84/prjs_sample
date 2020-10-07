package com.viettel.aio.business;

import com.viettel.aio.dto.ProjectContractDTO;

import java.util.List;

/**
 * 
 * @author hnx
 *
 */
public interface ProjectContractBusiness {
//	ProjectContractDTO findByCode(String value);
//	List<ProjectContractDTO> doSearch(ProjectContractDTO obj);
	List<ProjectContractDTO> getForAutoComplete(ProjectContractDTO query);
}
