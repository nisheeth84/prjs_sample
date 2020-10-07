package com.viettel.aio.business;

import com.viettel.aio.bo.AIOSurveyQuestionBO;
import com.viettel.aio.dao.AIOSurveyQuestionDAO;
import com.viettel.aio.dto.AIOSurveyQuestionDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("aioSurveyQuestionBusiness")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOSurveyQuestionBusinessImpl extends BaseFWBusinessImpl<AIOSurveyQuestionDAO, AIOSurveyQuestionDTO, AIOSurveyQuestionBO> implements AIOSurveyQuestionBusiness {
    @Autowired
    AIOSurveyQuestionDAO aioSurveyQuestionDAO;

    @Autowired
    public AIOSurveyQuestionBusinessImpl(AIOSurveyQuestionDAO aioSurveyQuestionDAO) {
        tDAO = aioSurveyQuestionDAO;
        tModel = new AIOSurveyQuestionBO();
    }
}
