package com.viettel.coms.business;

import com.viettel.coms.bo.YearPlanDetailPerMonthBO;
import com.viettel.coms.dao.YearPlanDetailPerMonthDAO;
import com.viettel.coms.dto.YearPlanDetailPerMonthDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("yearPlanDetailPerMonthBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class YearPlanDetailPerMonthBusinessImpl
        extends BaseFWBusinessImpl<YearPlanDetailPerMonthDAO, YearPlanDetailPerMonthDTO, YearPlanDetailPerMonthBO>
        implements YearPlanDetailPerMonthBusiness {

    @Autowired
    private YearPlanDetailPerMonthDAO yearPlanDetailPerMonthDAO;

    public YearPlanDetailPerMonthBusinessImpl() {
        tModel = new YearPlanDetailPerMonthBO();
        tDAO = yearPlanDetailPerMonthDAO;
    }

    @Override
    public YearPlanDetailPerMonthDAO gettDAO() {
        return yearPlanDetailPerMonthDAO;
    }

    @Override
    public long count() {
        return yearPlanDetailPerMonthDAO.count("YearPlanDetailPerMonthBO", null);
    }

}
