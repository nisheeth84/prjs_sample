package com.viettel.cat.business;

import com.viettel.cat.bo.CatManufacturerBO;
import com.viettel.cat.dao.CatManufacturerDAO;
import com.viettel.cat.dto.CatManufacturerDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;

//import com.viettel.cat.dto.CatUnitDTO;


@Service("catManufacturerBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CatManufacturerBusinessImpl extends BaseFWBusinessImpl<CatManufacturerDAO, CatManufacturerDTO, CatManufacturerBO> implements CatManufacturerBusiness {

    @Autowired
    private CatManufacturerDAO catManufacturerDAO;

    public CatManufacturerBusinessImpl() {
        tModel = new CatManufacturerBO();
        tDAO = catManufacturerDAO;
    }

    @Override
    public CatManufacturerDAO gettDAO() {
        return catManufacturerDAO;
    }

    @Override
    public CatManufacturerDTO findByCode(String code) {
        return catManufacturerDAO.findByCode(code);
    }

    @Override
    public List<CatManufacturerDTO> doSearch(CatManufacturerDTO obj) {
//		CatManufacturerDTO ccc = catManufacturerDAO.getById(1L);
//		CatManufacturerDTO haha = ccc;
        return catManufacturerDAO.doSearch(obj);
    }

    @Override
    public List<CatManufacturerDTO> getForAutoComplete(CatManufacturerDTO query) {
        return catManufacturerDAO.getForAutoComplete(query);
    }

    @Override
    public List<CatManufacturerDTO> getForComboBox(CatManufacturerDTO obj) {
        return catManufacturerDAO.getForComboBox(obj);
    }


    public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
        return catManufacturerDAO.delete(ids, tableName, tablePrimaryKey);
    }


    public CatManufacturerDTO getById(Long id) {
        return catManufacturerDAO.getById(id);
    }
}
