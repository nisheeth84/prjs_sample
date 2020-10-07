package com.viettel.coms.business;

import com.viettel.coms.bo.TmpnForceNewBtsBO;
import com.viettel.coms.dao.TmpnForceNewBtsDAO;
import com.viettel.coms.dto.TmpnForceNewBtsDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("tmpnForceNewBtsBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TmpnForceNewBtsBusinessImpl
        extends BaseFWBusinessImpl<TmpnForceNewBtsDAO, TmpnForceNewBtsDTO, TmpnForceNewBtsBO>
        implements TmpnForceNewBtsBusiness {

    @Autowired
    private TmpnForceNewBtsDAO tmpnForceNewBtsDAO;

    public TmpnForceNewBtsBusinessImpl() {
        tModel = new TmpnForceNewBtsBO();
        tDAO = tmpnForceNewBtsDAO;
    }

    @Override
    public TmpnForceNewBtsDAO gettDAO() {
        return tmpnForceNewBtsDAO;
    }

    @Override
    public long count() {
        return tmpnForceNewBtsDAO.count("TmpnForceNewBtsBO", null);
    }

}
