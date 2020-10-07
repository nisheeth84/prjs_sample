package com.viettel.aio.rest;

import com.viettel.aio.dto.CntContractDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author hoanm1
 */
 
public interface InCntContractRsService {

//	@GET
//	@Path("/cntContract/findById")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response getById(@QueryParam("id") Long id);
//
//	@POST
//	@Path("/update")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response update(CntContractDTO obj);
//
//	@POST
//	@Path("/add")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response add(CntContractDTO obj);
//
//	@POST
//	@Path("/remove")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response delete(CntContractDTO obj);
//
//
//	@POST
//	@Path("/doSearch")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response doSearch(CntContractDTO obj);
//
//	@PUT
//	@Path("/cntContract/deleteList/")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response deleteList(List<Long> ids);
//
//
//
//	@POST
//	@Path("/cntContract/findByAutoComplete")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//    public Response findByAutoComplete(CntContractDTO obj);
//
//
////	hoanm1_20180303_start
//	@POST
//	@Path("/getForAutoComplete")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//    public Response getForAutoComplete(CntContractDTO obj);
//
//	@POST
//	@Path("/getForAutoCompleteKTTS")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//    public Response getForAutoCompleteKTTS(CntContractDTO obj);
//
//	@POST
//	@Path("/mapContract")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response mapContract(CntContractDTO obj);
//
//	@POST
//	@Path("/getListContract")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response getListContract(CntContractDTO obj);
//
//	@POST
//	@Path("/getListContractKTTS")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response getListContractKTTS(CntContractDTO obj);
////	hoanm1_20180303_end
	
	@POST
	@Path("/checkMapConstract")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response checkMapConstract(CntContractDTO obj);

}
