package com.viettel.aio.business;

import com.viettel.aio.bo.ProjectContractBO;
import com.viettel.aio.dao.ProjectContractDAO;
import com.viettel.aio.dto.ProjectContractDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 
 * @author hnx
 *
 */
@Service("projectContractBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ProjectContractBusinessImpl extends BaseFWBusinessImpl<ProjectContractDAO, ProjectContractDTO, ProjectContractBO> implements ProjectContractBusiness {

	@Autowired
	private ProjectContractDAO projectContractDAO;
//	@Autowired
//	private UtilAttachDocumentDAO utilAttachDocumentDAO;

	public ProjectContractBusinessImpl() {
		tModel = new ProjectContractBO();
		tDAO = projectContractDAO;
	}
	@Override
	public ProjectContractDAO gettDAO() {
		return projectContractDAO;
	}
	
//	@Override
//	public ProjectContractDTO findByCode(String value) {
//		return projectContractDAO.findByCode(value);
//	}
//
//	@Override
//	public List<ProjectContractDTO> doSearch(ProjectContractDTO obj) {
//		List<ProjectContractDTO> result = projectContractDAO.doSearch(obj);
//		for (ProjectContractDTO contract : result) {
//			if (contract != null) {
//				UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
//				criteria.setObjectId(contract.getProjectContractId());
//				criteria.setType(Constants.FILETYPE.PROJECT_CONTRACT);
//				List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentDAO
//						.doSearch(criteria);
//				contract.setFileLst(fileLst);
//			}
//		}
//		return result;
//	}

	@Override
	public List<ProjectContractDTO> getForAutoComplete(ProjectContractDTO obj) {
		return projectContractDAO.getForAutoComplete(obj);
	}
}
