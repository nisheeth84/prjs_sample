package com.viettel.aio.rest;

import com.viettel.aio.dto.report.AIORpHrNotSalesDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Created by HaiND on 9/28/2019 2:33 AM.
 */
public interface AIORpHrNotSalesRsService {

    @POST
    @Path("/doSearchArea")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchArea(AIORpHrNotSalesDTO obj);

    @POST
    @Path("/doSearchGroup")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchGroup(AIORpHrNotSalesDTO obj);

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIORpHrNotSalesDTO obj);
}
