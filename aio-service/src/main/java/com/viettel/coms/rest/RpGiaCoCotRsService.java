package com.viettel.coms.rest;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import com.viettel.coms.dto.RpGiaCoCotDTO;

public interface RpGiaCoCotRsService {

	@POST
    @Path("/doSearchGiaCoCot")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchGiaCoCot(RpGiaCoCotDTO obj);
	
	@POST
    @Path("/readFileStationReport")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    Response readFileStationReport(Attachment attachments, @Context HttpServletRequest request);

	@POST
    @Path("/readFileContractReport")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    Response readFileContractReport(Attachment attachments, @Context HttpServletRequest request);
	
	@POST
    @Path("/exportCompleteProgress")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportCompleteProgress(RpGiaCoCotDTO obj) throws Exception;
}
