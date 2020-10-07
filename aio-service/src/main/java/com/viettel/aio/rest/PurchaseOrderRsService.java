package com.viettel.aio.rest;

import com.viettel.aio.dto.PurchaseOrderDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author hailh10
 */
 
public interface PurchaseOrderRsService {

//	@GET
//	@Path("/purchaseOrder/findById")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response getById(@QueryParam("id") Long id);
//
//
//	@POST
//	@Path("/findByCode")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response findByCode(List<String> codeLst);
//
//	@POST
//	@Path("/update")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response update(PurchaseOrderDTO obj);
//
//	@POST
//	@Path("/add")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response add(PurchaseOrderDTO obj);
//
//	@POST
//	@Path("/remove/{id}")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response delete(@PathParam("id") Long id);
//
//
//	@POST
//	@Path("/doSearch")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response doSearch(PurchaseOrderDTO obj);
	
//	@PUT
//	@Path("/purchaseOrder/deleteList/")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response deleteList(List<Long> ids);

	
	@POST
	@Path("/getForAutoComplete")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Response getForAutoComplete(PurchaseOrderDTO obj);
	
//	@GET
//	@Path("/downloadFile")
//	@Produces(MediaType.APPLICATION_OCTET_STREAM)
//	public Response downloadFile(@Context HttpServletRequest request)
//			throws Exception;
//
//	@POST
//    @Path("/importPurchaseOrder")
//    @Consumes(MediaType.MULTIPART_FORM_DATA)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response importPurchaseOrder(Attachment attachments, @Context HttpServletRequest request) throws Exception;

}
