package com.viettel.aio.business;

import com.viettel.aio.bo.ConstructionBO;
import com.viettel.aio.dao.ConstructionDAO;
import com.viettel.aio.dto.ConstructionDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("AIOconstructionBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ConstructionBusinessImpl extends BaseFWBusinessImpl<ConstructionDAO, ConstructionDTO, ConstructionBO> implements ConstructionBusiness {

    @Autowired
    private ConstructionDAO constructionDAO;
     
    public ConstructionBusinessImpl() {
        tModel = new ConstructionBO();
        tDAO = constructionDAO;
    }

    @Override
    public ConstructionDAO gettDAO() {
        return constructionDAO;
    }
	
	@Override
	public List<ConstructionDTO> doSearch(ConstructionDTO obj) {
		return constructionDAO.doSearch(obj);
	}
//
//
//	public List<ConstructionDTO> doSearchForImport(ConstructionDTO obj) {
//		return constructionDAO.doSearchForImport(obj);
//	}
	
	@Override
	public List<ConstructionDTO> getForAutoComplete(ConstructionDTO query) {
		return constructionDAO.getForAutoComplete(query);
	}
	
//	public List<ConstructionDTO> getForAutoCompleteHTCT(ConstructionDTO query) {
//		return constructionDAO.getForAutoCompleteHTCT(query);
//	}
//
//	public List<ConstructionDTO> doSearchHTCT(ConstructionDTO query) {
//		return constructionDAO.doSearchHTCT(query);
//	}
//
	@Override
	public List<ConstructionDTO> getForAutoCompleteIn(ConstructionDTO query) {
		return constructionDAO.getForAutoCompleteIn(query);
	}
//
//	public List<ConstructionDTO> doSearchIn(ConstructionDTO query) {
//		return constructionDAO.doSearchIn(query);
//	}
//
//	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
//		return constructionDAO.delete(ids, tableName, tablePrimaryKey);
//	}
//
//
//
//	public ConstructionDTO getById(Long id) {
//		return constructionDAO.getById(id);
//	}
//
//	//Huypq-20190923-start
//	public List<ConstructionDTO> doSearchInHTCT(ConstructionDTO query) {
//		return constructionDAO.doSearchInHTCT(query);
//	}
//
//	public List<ConstructionDTO> getForAutoCompleteInHTCT(ConstructionDTO query) {
//		return constructionDAO.getForAutoCompleteInHTCT(query);
//	}
//	//Huy-end
}
