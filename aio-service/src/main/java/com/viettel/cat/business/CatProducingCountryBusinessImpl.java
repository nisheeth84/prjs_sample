package com.viettel.cat.business;

import com.viettel.cat.bo.CatProducingCountryBO;
import com.viettel.cat.dao.CatProducingCountryDAO;
import com.viettel.cat.dto.CatProducingCountryDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("catProducingCountryBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CatProducingCountryBusinessImpl extends BaseFWBusinessImpl<CatProducingCountryDAO, CatProducingCountryDTO, CatProducingCountryBO> implements CatProducingCountryBusiness {

    @Autowired
    private CatProducingCountryDAO catProducingCountryDAO;

    public CatProducingCountryBusinessImpl() {
        tModel = new CatProducingCountryBO();
        tDAO = catProducingCountryDAO;
    }

    @Override
    public CatProducingCountryDAO gettDAO() {
        return catProducingCountryDAO;
    }

    @Override
    public CatProducingCountryDTO findByCode(String value) {
        return catProducingCountryDAO.findByCode(value);
    }

    @Override
    public List<CatProducingCountryDTO> doSearch(CatProducingCountryDTO obj) {
        return catProducingCountryDAO.doSearch(obj);
    }

    @Override
    public List<CatProducingCountryDTO> getForAutoComplete(CatProducingCountryDTO query) {
        return catProducingCountryDAO.getForAutoComplete(query);
    }

    public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
        return catProducingCountryDAO.delete(ids, tableName, tablePrimaryKey);
    }

    public CatProducingCountryDTO getById(Long id) {
        return catProducingCountryDAO.getById(id);
    }

    public Object getForComboBox(CatProducingCountryDTO obj) {
        return catProducingCountryDAO.getForComboBox(obj);
    }
}
