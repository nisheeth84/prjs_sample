package com.viettel.aio.business;

import com.viettel.aio.bo.AIOSurveyCustomerBO;
import com.viettel.aio.dao.AIOSurveyCustomerDAO;
import com.viettel.aio.dto.AIOSurveyCustomerDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("aioSurveyCustomerBusiness")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOSurveyCustomerBusinessImpl extends BaseFWBusinessImpl<AIOSurveyCustomerDAO, AIOSurveyCustomerDTO, AIOSurveyCustomerBO> implements AIOSurveyCustomerBusiness {
    @Autowired
    AIOSurveyCustomerDAO aioSurveyCustomerDAO;

    @Autowired
    public AIOSurveyCustomerBusinessImpl(AIOSurveyCustomerDAO aioSurveyCustomerDAO) {
        tDAO = aioSurveyCustomerDAO;
        tModel = new AIOSurveyCustomerBO();
    }
}
