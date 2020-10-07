package com.viettel.aio.rest;

import com.viettel.aio.dto.CntContractTaskXNXDDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author tatph
 */
 
public interface CntContractTaskXNXDRsService {


	//tatph: Start 9/10/2019
	@POST
	@Path("/doSearchPLHD")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response doSearchPLHD(CntContractTaskXNXDDTO criteria);

//	@POST
//	@Path("/addJobPLHD")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response addJobPLHD(CntContractTaskXNXDDTO obj);
//
//	@POST
//	@Path("/checkValidatePLHD")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response checkValidatePLHD(CntContractTaskXNXDDTO obj);
//
//	@POST
//	@Path("/removeJobPLHD")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response removeJobPLHD(CntContractTaskXNXDDTO obj);
//
//	@POST
//	@Path("/updateJobPLHD")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response updateJobPLHD(CntContractTaskXNXDDTO obj);

	@GET
	@Path("/downloadFile")
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	Response downloadFile(@Context HttpServletRequest request)
			throws Exception;
	@POST
	@Path("/importCntJobPLHD")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	Response importCntJobPLHD(Attachment attachments, @Context HttpServletRequest request) throws Exception;
	
//	//tatph-9/10/2019-start
//	@POST
//	@Path("/exportContentPLHD")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response exportContentPLHD(CntContractTaskXNXDDTO obj);
//	tatph-end
}
