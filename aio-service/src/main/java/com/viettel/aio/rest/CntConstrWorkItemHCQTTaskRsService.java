package com.viettel.aio.rest;

import com.viettel.aio.dto.CntAppendixJobDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author HIENVD
 */
 
public interface CntConstrWorkItemHCQTTaskRsService {


	//hienvd: Start 8/7/2019
	@POST
	@Path("/doSearchAppendixJob")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	 Response doSearchAppendixJob(CntAppendixJobDTO criteria);

	@POST
	@Path("/addHCQT")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	 Response addJobHCQT(CntAppendixJobDTO obj);

	@POST
	@Path("/checkValidate")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	 Response checkValidate(CntAppendixJobDTO obj);

	@POST
	@Path("/removeJobHCQT")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	 Response removeJobHCQT(CntAppendixJobDTO obj);

	@POST
	@Path("/updateJobHCQT")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	 Response updateJobHCQT(CntAppendixJobDTO obj);

	@GET
	@Path("/downloadFile")
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	 Response downloadFile(@Context HttpServletRequest request)
			throws Exception;
	@POST
	@Path("/importCntJobHCQT")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	 Response importCntJobHCQT(Attachment attachments, @Context HttpServletRequest request) throws Exception;
	
	//Huypq-20190827-start
	@POST
	@Path("/exportContentHCQT")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	 Response exportContentHCQT(CntAppendixJobDTO obj);
	//huy-end
}
