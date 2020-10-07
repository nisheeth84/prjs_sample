package com.viettel.aio.rest;

import com.viettel.aio.business.AIORpSurveyBusinessImpl;
import com.viettel.aio.dto.report.AIORpSurveyDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Created by HaiND on 9/25/2019 11:56 PM.
 */
public class AIORpSurveyRsServiceImpl implements AIORpSurveyRsService {

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Autowired
    private AIORpSurveyBusinessImpl aioRpSurveyBusiness;

    @Context
    private HttpServletRequest request;

    @Override
    public Response doSearchSurvey(AIORpSurveyDTO obj) {
        List<AIORpSurveyDTO> data = aioRpSurveyBusiness.doSearchSurvey(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearch(AIORpSurveyDTO obj) {
        DataListDTO data = aioRpSurveyBusiness.doSearch(obj);
        return Response.ok(data).build();
    }
}
