package com.viettel.coms.business;

import com.viettel.coms.bo.TmpnForceMaintainBO;
import com.viettel.coms.dao.TmpnForceMaintainDAO;
import com.viettel.coms.dto.TmpnForceMaintainDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("tmpnForceMaintainBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TmpnForceMaintainBusinessImpl
        extends BaseFWBusinessImpl<TmpnForceMaintainDAO, TmpnForceMaintainDTO, TmpnForceMaintainBO>
        implements TmpnForceMaintainBusiness {

    @Autowired
    private TmpnForceMaintainDAO tmpnForceMaintainDAO;

    public TmpnForceMaintainBusinessImpl() {
        tModel = new TmpnForceMaintainBO();
        tDAO = tmpnForceMaintainDAO;
    }

    @Override
    public TmpnForceMaintainDAO gettDAO() {
        return tmpnForceMaintainDAO;
    }

    @Override
    public long count() {
        return tmpnForceMaintainDAO.count("TmpnForceMaintainBO", null);
    }

}
