package com.viettel.coms.business;

import com.viettel.coms.bo.TmpnFinanceBO;
import com.viettel.coms.dao.TmpnFinanceDAO;
import com.viettel.coms.dto.TmpnFinanceDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("tmpnFinanceBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TmpnFinanceBusinessImpl extends BaseFWBusinessImpl<TmpnFinanceDAO, TmpnFinanceDTO, TmpnFinanceBO>
        implements TmpnFinanceBusiness {

    @Autowired
    private TmpnFinanceDAO tmpnFinanceDAO;

    public TmpnFinanceBusinessImpl() {
        tModel = new TmpnFinanceBO();
        tDAO = tmpnFinanceDAO;
    }

    @Override
    public TmpnFinanceDAO gettDAO() {
        return tmpnFinanceDAO;
    }

    @Override
    public long count() {
        return tmpnFinanceDAO.count("TmpnFinanceBO", null);
    }

}
