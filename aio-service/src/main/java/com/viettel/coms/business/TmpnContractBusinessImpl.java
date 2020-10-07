package com.viettel.coms.business;

import com.viettel.coms.bo.TmpnContractBO;
import com.viettel.coms.dao.TmpnContractDAO;
import com.viettel.coms.dto.TmpnContractDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("tmpnContractBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TmpnContractBusinessImpl extends BaseFWBusinessImpl<TmpnContractDAO, TmpnContractDTO, TmpnContractBO>
        implements TmpnContractBusiness {

    @Autowired
    private TmpnContractDAO tmpnContractDAO;

    public TmpnContractBusinessImpl() {
        tModel = new TmpnContractBO();
        tDAO = tmpnContractDAO;
    }

    @Override
    public TmpnContractDAO gettDAO() {
        return tmpnContractDAO;
    }

    @Override
    public long count() {
        return tmpnContractDAO.count("TmpnContractBO", null);
    }

}
