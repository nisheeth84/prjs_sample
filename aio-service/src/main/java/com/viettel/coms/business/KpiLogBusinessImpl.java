package com.viettel.coms.business;

import com.viettel.coms.bo.KpiLogBO;
import com.viettel.coms.dao.KpiLogDAO;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("kpiLogBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class KpiLogBusinessImpl extends BaseFWBusinessImpl<KpiLogDAO, KpiLogDTO, KpiLogBO> implements KpiLogBusiness {

    @Autowired
    private KpiLogDAO kpiLogDAO;

    public KpiLogBusinessImpl() {
        tModel = new KpiLogBO();
        tDAO = kpiLogDAO;
    }

    @Override
    public KpiLogDAO gettDAO() {
        return kpiLogDAO;
    }

    @Override
    public long count() {
        return kpiLogDAO.count("KpiLogBO", null);
    }

}
