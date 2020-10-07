package com.viettel.aio.rest;

import com.viettel.aio.dto.AIORevenueReportSearchDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public interface AIORevenueReportRsService {

    @POST
    @Path("/searchRevenueReport")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response searchRevenueReport(AIORevenueReportSearchDTO obj);
    @POST
    @Path("/searchAreas")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response searchAreas(AIORevenueReportSearchDTO obj);
    @POST
    @Path("/exportRevenueReport")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportRevenueReport(AIORevenueReportSearchDTO obj);
}
