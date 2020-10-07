package com.viettel.aio.rest;

import com.viettel.aio.business.AIORpContractPayrollBusiness;
import com.viettel.aio.dto.AIORpContractPayrollDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;

public class AIORpContractPayrollServiceImpl implements AIORpContractPayrollService {

    protected final Logger log = Logger.getLogger(AIORpContractPayrollServiceImpl.class);

    @Autowired
    private AIORpContractPayrollBusiness aioRpContractPayrollBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIORpContractPayrollDTO obj) {
        DataListDTO data = aioRpContractPayrollBusiness.doSearch(obj);
        return Response.ok(data).build();
    }


}
