package com.viettel.erp.business;

import com.viettel.erp.bo.CatUnitBO;
import com.viettel.erp.dao.CatUnitDAO;
import com.viettel.erp.dto.CatUnitDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;


@Service("catUnitBusinessImpl")
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

    @Override
    public long count() {
        return catUnitDAO.count("CatUnitBO", null);
    }


}
