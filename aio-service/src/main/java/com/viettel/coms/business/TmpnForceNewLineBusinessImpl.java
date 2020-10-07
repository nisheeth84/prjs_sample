package com.viettel.coms.business;

import com.viettel.coms.bo.TmpnForceNewLineBO;
import com.viettel.coms.dao.TmpnForceNewLineDAO;
import com.viettel.coms.dto.TmpnForceNewLineDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("tmpnForceNewLineBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TmpnForceNewLineBusinessImpl
        extends BaseFWBusinessImpl<TmpnForceNewLineDAO, TmpnForceNewLineDTO, TmpnForceNewLineBO>
        implements TmpnForceNewLineBusiness {

    @Autowired
    private TmpnForceNewLineDAO tmpnForceNewLineDAO;

    public TmpnForceNewLineBusinessImpl() {
        tModel = new TmpnForceNewLineBO();
        tDAO = tmpnForceNewLineDAO;
    }

    @Override
    public TmpnForceNewLineDAO gettDAO() {
        return tmpnForceNewLineDAO;
    }

    @Override
    public long count() {
        return tmpnForceNewLineDAO.count("TmpnForceNewLineBO", null);
    }

}
