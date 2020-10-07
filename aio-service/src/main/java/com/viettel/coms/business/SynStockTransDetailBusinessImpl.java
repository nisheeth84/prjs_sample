package com.viettel.coms.business;

import com.viettel.coms.bo.SynStockTransDetailBO;
import com.viettel.coms.dao.SynStockTransDetailDAO;
import com.viettel.coms.dto.SynStockTransDetailDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("synStockTransDetailBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SynStockTransDetailBusinessImpl
        extends BaseFWBusinessImpl<SynStockTransDetailDAO, SynStockTransDetailDTO, SynStockTransDetailBO>
        implements SynStockTransDetailBusiness {

    @Autowired
    private SynStockTransDetailDAO synStockTransDetailDAO;

    public SynStockTransDetailBusinessImpl() {
        tModel = new SynStockTransDetailBO();
        tDAO = synStockTransDetailDAO;
    }

    @Override
    public SynStockTransDetailDAO gettDAO() {
        return synStockTransDetailDAO;
    }

    @Override
    public long count() {
        return synStockTransDetailDAO.count("SynStockTransDetailBO", null);
    }

}
