package com.viettel.coms.business;

import com.viettel.coms.bo.TmpnSourceBO;
import com.viettel.coms.dao.TmpnSourceDAO;
import com.viettel.coms.dto.TmpnSourceDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("tmpnSourceBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TmpnSourceBusinessImpl extends BaseFWBusinessImpl<TmpnSourceDAO, TmpnSourceDTO, TmpnSourceBO>
        implements TmpnSourceBusiness {

    @Autowired
    private TmpnSourceDAO tmpnSourceDAO;

    public TmpnSourceBusinessImpl() {
        tModel = new TmpnSourceBO();
        tDAO = tmpnSourceDAO;
    }

    @Override
    public TmpnSourceDAO gettDAO() {
        return tmpnSourceDAO;
    }

    @Override
    public long count() {
        return tmpnSourceDAO.count("TmpnSourceBO", null);
    }

}
