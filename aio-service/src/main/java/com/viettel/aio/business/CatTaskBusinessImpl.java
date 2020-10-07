package com.viettel.aio.business;

import com.viettel.aio.dao.CatTaskDAO;
import com.viettel.cat.bo.CatTaskBO;
import com.viettel.cat.dto.CatTaskDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("catTaskBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CatTaskBusinessImpl extends BaseFWBusinessImpl<CatTaskDAO, CatTaskDTO, CatTaskBO> implements CatTaskBusiness {

    @Autowired
    private CatTaskDAO catTaskDAO;
     
    public CatTaskBusinessImpl() {
        tModel = new CatTaskBO();
        tDAO = catTaskDAO;
    }

    @Override
    public CatTaskDAO gettDAO() {
        return catTaskDAO;
    }
	
//	@Override
//	public CatTaskDTO findByCode(String value) {
//		return catTaskDAO.findByCode(value);
//	}
//
	@Override
	public List<CatTaskDTO> doSearch(CatTaskDTO obj) {
		return catTaskDAO.doSearch(obj);
	}
	
	@Override
	public List<CatTaskDTO> getForAutoComplete(CatTaskDTO query) {
		return catTaskDAO.getForAutoComplete(query);
	}

//	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
//		return catTaskDAO.delete(ids, tableName, tablePrimaryKey);
//	}
//
//	public CatTaskDTO getById(Long id) {
//		return catTaskDAO.getById(id);
//	}
}
