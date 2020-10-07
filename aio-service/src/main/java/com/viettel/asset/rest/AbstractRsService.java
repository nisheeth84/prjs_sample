package com.viettel.asset.rest;

import com.viettel.asset.filter.session.UserSession;
import com.viettel.ktts2.common.BusinessException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

public class AbstractRsService {
    //protected UserSession userSession;
    @Context
    HttpServletRequest request;
    protected static final String USER_SESSION_KEY = "USER_SESSION_KEY";
    protected static final String VSA_USER_TOKEN_KEY = "VSA_USER_TOKEN_KEY";

    public UserSession getUserSession() {
        UserSession s = (UserSession) request.getSession().getAttribute(USER_SESSION_KEY);
        if (s == null) {
            throw new BusinessException("user is not authen");
        }
        return s;

    }

}
