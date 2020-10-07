package com.viettel.coms.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.viettel.coms.dto.RpConstructionDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.coms.dto.couponExportDTO;

public interface RpQuantityRsService {

	@POST
    @Path("/doSearchQuantity")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchQuantity(WorkItemDetailDTO obj);
//	hungtd_20181217_start
	@POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearch(RpConstructionDTO obj);
	@POST
	//NHANBGMB
    @Path("/doSearchNHAN")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchNHAN(RpConstructionDTO obj);
	//KC
	@POST
    @Path("/doSearchKC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchKC(RpConstructionDTO obj);
	//TONTHICON
	@POST
    @Path("/doSearchTONTC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchTONTC(RpConstructionDTO obj);
	@POST
    @Path("/doSearchHSHC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchHSHC(RpConstructionDTO obj);
	
	@POST
    @Path("/export")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response export(RpConstructionDTO obj) throws Exception;
//	hungtd_20181217_end

	@POST
    @Path("/exportWorkItemServiceTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportWorkItemServiceTask(WorkItemDetailDTO obj) throws Exception;
	
//	hungtd_20192101_start
	@POST
    @Path("/doSearchCoupon")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchCoupon(couponExportDTO obj);
//	hungtd_20192101_end
//	hungtd_20192201_start
	@POST
    @Path("/doSearchPopup")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchPopup(couponExportDTO obj);
//	hungtd_20192201_end

}
