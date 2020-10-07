package com.viettel.aio.rest;

import com.viettel.aio.dto.CatTaskHCQTDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author HIENVD
 */

public interface CatTaskHCQTRsService {

	@POST
	@Path("/doSearch")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response doSearch(CatTaskHCQTDTO criteria);

	@POST
	@Path("/getForAutoComplete")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response findByAutoComplete(CatTaskHCQTDTO obj);

//	@POST
//	@Path("/doSearchCatTask")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response doSearchCatTask(CatTaskHCQTDTO obj);
//
//	@POST
//	@Path("/saveCatTask")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response saveCatTask(CatTaskHCQTDTO obj);
//
//	@POST
//	@Path("/update")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response updateWorkItemTask(CatTaskHCQTDTO obj);
//
//	@POST
//	@Path("/remove")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response deleteWorkItemTask(CatTaskHCQTDTO obj);
//
//	@POST
//	@Path("/checkCatTaskExit")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response checkCatTaskExit(CatTaskHCQTDTO obj);
//
//	@POST
//	@Path("/importCatTaskHCQT")
//	@Consumes(MediaType.MULTIPART_FORM_DATA)
//	@Produces(MediaType.APPLICATION_JSON)
//	public Response importCatTaskHCQT(Attachment attachments, @Context HttpServletRequest request) throws Exception;
//
//	// Huypq-20190827-start
//	@POST
//	@Path("/exportTaskHCQT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response exportTaskHCQT(CatTaskHCQTDTO obj) throws Exception;
//	// Huy-end
}
