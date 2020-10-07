package com.viettel.aio.rest;

import com.viettel.aio.dto.ConstructionDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author hailh10
 */
 
public interface ConstructionRsService {

//	@GET
//	@Path("/construction/findById")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response getById(@QueryParam("id") Long id);
//
//
	@POST
	@Path("/doSearch")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response doSearch(ConstructionDTO obj);
//
//	@POST
//	@Path("/doSearchIn")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response doSearchIn(ConstructionDTO obj);

	
	@POST
	@Path("/getForAutoComplete")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    Response findByAutoComplete(ConstructionDTO obj);
	
//	@POST
//	@Path("/getForAutoCompleteHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//    public Response getForAutoCompleteHTCT(ConstructionDTO obj);
//
//	@POST
//	@Path("/doSearchHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response doSearchHTCT(ConstructionDTO obj);
//
//	@POST
//	@Path("/getForAutoCompleteIn")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//    public Response getForAutoCompleteIn(ConstructionDTO obj);
//
//	//Huypq-20190923-start
//	@POST
//	@Path("/doSearchInHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response doSearchInHTCT(ConstructionDTO obj);
//
//	@POST
//	@Path("/getForAutoCompleteInHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//    public Response getForAutoCompleteInHTCT(ConstructionDTO obj);
//	//Huy-end
}
