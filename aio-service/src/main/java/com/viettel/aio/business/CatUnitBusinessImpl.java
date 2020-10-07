package com.viettel.aio.business;

import com.viettel.aio.bo.CatUnitBO;
import com.viettel.aio.dao.CatUnitDAO;
import com.viettel.aio.dto.CatUnitDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("AIOcatUnitBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CatUnitBusinessImpl extends BaseFWBusinessImpl<CatUnitDAO, CatUnitDTO, CatUnitBO> implements CatUnitBusiness {

    @Autowired
    private CatUnitDAO catUnitDAO;
     
    public CatUnitBusinessImpl() {
        tModel = new CatUnitBO();
        tDAO = catUnitDAO;
    }

    @Override
    public CatUnitDAO gettDAO() {
        return catUnitDAO;
    }
	
//	@Override
//	public CatUnitDTO findByCode(String value) {
//		return catUnitDAO.findByCode(value);
//	}
//
	@Override
	public List<CatUnitDTO> doSearch(CatUnitDTO obj) {
		return catUnitDAO.doSearch(obj);
	}
	
	@Override
	public List<CatUnitDTO> getForAutoComplete(CatUnitDTO query) {
		return catUnitDAO.getForAutoComplete(query);
	}
	
//	@Override
//	public List<CatUnitDTO> getForComboBox(CatUnitDTO obj) {
//		return catUnitDAO.getForComboBox(obj);
//	}
//
//	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
//		return catUnitDAO.delete(ids, tableName, tablePrimaryKey);
//	}
//
////	public String forceDelete(List<Long> ids, String tableName, String tablePrimaryKey) {
////		return catUnitDAO.forceDelete(ids, tableName, tablePrimaryKey);
////	}
//
//	public CatUnitDTO getById(Long id) {
//		return catUnitDAO.getById(id);
//	}
}
