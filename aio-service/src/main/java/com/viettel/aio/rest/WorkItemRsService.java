package com.viettel.aio.rest;

import com.viettel.aio.dto.WorkItemDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author hailh10
 */
 
public interface WorkItemRsService {


	@POST
	@Path("/doSearch")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response doSearch(WorkItemDTO obj);
//
//	@GET
//	@Path("/getFileDrop")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response getFileDrop();

	@POST
	@Path("/getForAutoComplete")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    Response findByAutoComplete(WorkItemDTO obj);
	
	
//	//tatph start 17/10/2019
//	@POST
//	@Path("/getForAutoCompleteWorkItemHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//    public Response getForAutoCompleteWorkItemHTCT(CatWorkItemTypeHTCTDTO obj);
//
//	@POST
//	@Path("/getForAutoCompleteCatTaskHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//    public Response getForAutoCompleteCatTaskHTCT(CatTaskHTCTDTO obj);
//
//	@POST
//	@Path("/doSearchWorkItemHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response doSearchWorkItemHTCT(CatWorkItemTypeHTCTDTO obj);
//
//
//	@POST
//	@Path("/doSearchTaskHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response doSearchTaskHTCT(CatTaskHTCTDTO obj);
//	@POST
//	@Path("/doSearchProvince")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response doSearchProvince(CatTaskHTCTDTO obj);
//
//	@POST
//	@Path("/getForAutoCompleteProvince")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//    public Response getForAutoCompleteProvince(CatTaskHTCTDTO obj);
//
//	@POST
//	@Path("/doSearchProjectHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response doSearchProjectHTCT(ProjectEstimatesDTO obj);
//
//	@POST
//	@Path("/getForAutoCompleteProjectHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//    public Response getForAutoCompleteProjectHTCT(ProjectEstimatesDTO obj);
//
//	@POST
//	@Path("/doSearchConstrHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response doSearchConstrHTCT(ProjectEstimatesDTO obj);
//
//	@POST
//	@Path("/getForAutoCompleteConstrHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//    public Response getForAutoCompleteConstrHTCT(ProjectEstimatesDTO obj);
//
//	//tatph 18/10/2019
//

}
