package com.viettel.coms.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.viettel.coms.dto.MaterialDebtReportDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;

public interface MaterialDebtReportRsService {

	@POST
    @Path("/doSearchDetailForReport")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchDetailForReport(WorkItemDetailDTO obj);

	@POST
    @Path("/doSearchForReport")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchForReport(MaterialDebtReportDTO obj) throws Exception;

	@POST
    @Path("/exportReport")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	Response exportReport(MaterialDebtReportDTO obj) throws Exception;

	@POST
    @Path("/exportDetailReport")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	Response exportDetailReport(MaterialDebtReportDTO obj) throws Exception;

}
