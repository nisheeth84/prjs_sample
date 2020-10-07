package com.viettel.coms.business;

import com.viettel.coms.bo.SynStockTransDetailSerialBO;
import com.viettel.coms.dao.SynStockTransDetailSerialDAO;
import com.viettel.coms.dto.SynStockTransDetailSerialDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("synStockTransDetailSerialBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SynStockTransDetailSerialBusinessImpl extends
        BaseFWBusinessImpl<SynStockTransDetailSerialDAO, SynStockTransDetailSerialDTO, SynStockTransDetailSerialBO>
        implements SynStockTransDetailSerialBusiness {

    @Autowired
    private SynStockTransDetailSerialDAO synStockTransDetailSerialDAO;

    public SynStockTransDetailSerialBusinessImpl() {
        tModel = new SynStockTransDetailSerialBO();
        tDAO = synStockTransDetailSerialDAO;
    }

    @Override
    public SynStockTransDetailSerialDAO gettDAO() {
        return synStockTransDetailSerialDAO;
    }

    @Override
    public long count() {
        return synStockTransDetailSerialDAO.count("SynStockTransDetailSerialBO", null);
    }

}
