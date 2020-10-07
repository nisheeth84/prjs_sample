package com.viettel.aio.business;

import com.viettel.aio.bo.WorkItemBO;
import com.viettel.aio.dao.WorkItemDAO;
import com.viettel.aio.dto.WorkItemDTO;

import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("AIOworkItemBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class WorkItemBusinessImpl extends BaseFWBusinessImpl<WorkItemDAO, WorkItemDTO, WorkItemBO> implements WorkItemBusiness {

    @Autowired
    private WorkItemDAO workItemDAO;
     
    public WorkItemBusinessImpl() {
        tModel = new WorkItemBO();
        tDAO = workItemDAO;
    }

    @Override
    public WorkItemDAO gettDAO() {
        return workItemDAO;
    }
	

	@Override
	public List<WorkItemDTO> doSearch(WorkItemDTO obj) {
		return workItemDAO.doSearch(obj);
	}
//
//	//tatph - start
//	public List<CatWorkItemTypeHTCTDTO> doSearchWorkItemHTCT(CatWorkItemTypeHTCTDTO obj) {
//		return workItemDAO.doSearchWorkItemHTCT(obj);
//	}
//
//	public List<CatTaskHTCTDTO> doSearchTaskHTCT(CatTaskHTCTDTO obj) {
//		return workItemDAO.doSearchTaskHTCT(obj);
//	}
//	public List<CatTaskHTCTDTO> doSearchProvince(CatTaskHTCTDTO obj) {
//		return workItemDAO.doSearchProvince(obj);
//	}
//
//	public List<CatTaskHTCTDTO> getForAutoCompleteProvince(CatTaskHTCTDTO query) {
//		return workItemDAO.getForAutoCompleteProvince(query);
//	}
//
//	public List<ConstructionProjectDTO> doSearchProjectHTCT(ProjectEstimatesDTO obj) {
//		return workItemDAO.doSearchProjectHTCT(obj);
//	}
//
//	public List<ConstructionProjectDTO> getForAutoCompleteProjectHTCT(ProjectEstimatesDTO query) {
//		return workItemDAO.getForAutoCompleteProjectHTCT(query);
//	}
//
//	public List<ProjectEstimatesDTO> doSearchConstrHTCT(ProjectEstimatesDTO obj) {
//		return workItemDAO.doSearchConstrHTCT(obj);
//	}
//
//	public List<ProjectEstimatesDTO> getForAutoCompleteConstrHTCT(ProjectEstimatesDTO query) {
//		return workItemDAO.getForAutoCompleteConstrHTCT(query);
//	}
//
//	//tatph end
//	public List<ProjectEstimatesDTO> getFileDrop() {
//		// Hieunn
//		// get list filedrop form APP_PARAM with PAR_TYPE =
//		// 'SHIPMENT_DOCUMENT_TYPE' and Status=1
//		return workItemDAO.getFileDrop();
//	}
	
	
	@Override
	public List<WorkItemDTO> getForAutoComplete(WorkItemDTO query) {
		return workItemDAO.getForAutoComplete(query);
	}
	
	
//	public List<CatWorkItemTypeHTCTDTO> getForAutoCompleteWorkItemHTCT(CatWorkItemTypeHTCTDTO query) {
//		return workItemDAO.getForAutoCompleteWorkItemHTCT(query);
//	}
//
//	public List<CatTaskHTCTDTO> getForAutoCompleteCatTaskHTCT(CatTaskHTCTDTO query) {
//		return workItemDAO.getForAutoCompleteCatTaskHTCT(query);
//	}
//
//
//	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
//		return workItemDAO.delete(ids, tableName, tablePrimaryKey);
//	}
//
//
//	public WorkItemDTO getById(Long id) {
//		return workItemDAO.getById(id);
//	}
}
