package com.viettel.coms.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.viettel.coms.dto.ConstructionTaskDetailDTO;

public interface RpHSHCRsService {

	 @POST
	    @Path("/doSearchForConsManager")
	    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	    public Response doSearchForConsManager(ConstructionTaskDetailDTO obj);
	 
	 @POST
	    @Path("/exportContructionHSHC")
	    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	    public Response exportContructionHSHC(ConstructionTaskDetailDTO obj) throws Exception;

}
