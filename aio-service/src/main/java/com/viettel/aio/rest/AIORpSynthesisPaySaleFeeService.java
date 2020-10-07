package com.viettel.aio.rest;

import com.viettel.aio.dto.AIORpSynthesisGenCodeForChannelDTO;
import com.viettel.aio.dto.AIORpSynthesisPaySaleFeeDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public interface AIORpSynthesisPaySaleFeeService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIORpSynthesisPaySaleFeeDTO obj);

    @POST
    @Path("/exportExcel")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportExcel(AIORpSynthesisPaySaleFeeDTO dto);
}