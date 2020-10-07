package com.viettel.aio.business;

import com.viettel.aio.bo.CatPartnerBO;
import com.viettel.aio.dao.CatPartnerDAO;
import com.viettel.aio.dto.CatPartnerDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("AIOcatPartnerBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CatPartnerBusinessImpl extends BaseFWBusinessImpl<CatPartnerDAO,CatPartnerDTO, CatPartnerBO> implements CatPartnerBusiness {

    @Autowired
    private CatPartnerDAO catPartnerDAO;
     
    public CatPartnerBusinessImpl() {
        tModel = new CatPartnerBO();
        tDAO = catPartnerDAO;
    }

    @Override
    public CatPartnerDAO gettDAO() {
        return catPartnerDAO;
    }
	
//	@Override
//	public CatPartnerDTO findByCode(String code) {
//		return catPartnerDAO.findByCode(code);
//	}
//
//	@Override
//	public List<CatPartnerDTO> doSearch(CatPartnerDTO obj) {
//		return catPartnerDAO.doSearch(obj);
//	}
	
	@Override
	public List<CatPartnerDTO> getForAutoComplete(CatPartnerDTO query) {
		return catPartnerDAO.getForAutoComplete(query);
	}

//	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
//		return catPartnerDAO.delete(ids, tableName, tablePrimaryKey);
//	}
//
//	@Override
//	public List<CatPartnerDTO> getForComboBox(CatPartnerDTO obj) {
//		return catPartnerDAO.getForComboBox(obj);
//	}
//
//
//	public CatPartnerDTO getById(Long id) {
//		return catPartnerDAO.getById(id);
//	}
}
