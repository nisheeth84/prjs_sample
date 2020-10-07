package com.viettel.aio.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOBaseRequest;
import com.viettel.aio.dto.AIOBaseResponse;
import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.aio.dto.AIOProvinceDTO;

import java.util.List;

public interface AIOOrdersRsService {
	@POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIOOrdersDTO obj);
	
	@POST
    @Path("/add")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response add(AIOOrdersDTO obj);
	
	@POST
	@Path("/autoSearchCatProvice")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response autoSearchCatProvice(String code);
	
	@POST
	@Path("/autoSearchService")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response autoSearchService();
	
	@POST
	@Path("/autoSearchChanel")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response autoSearchChanel();
	
	@POST
    @Path("/viewDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response viewDetail(AIOOrdersDTO obj);
	
	@POST
    @Path("/confirmStatus")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response confirmStatus(AIOOrdersDTO obj);
	
	@POST
    @Path("/confirmList")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response confirmList(AIOOrdersDTO obj);
	
	@POST
	@Path("/popupSearchCatProvice")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response popupSearchCatProvice(AIOOrdersDTO obj);
	
	@POST
    @Path("/checkHasPermission")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response checkHasPermission();

	//ycks web
	@POST
	@Path("/getDetailAioOrder")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	AIOBaseResponse<AIOOrdersDTO> getDetailAioOrder(AIOOrdersDTO rq);

	@POST
	@Path("/doSearchAioOrder")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	Response doSearchAioOrder(AIOOrdersDTO obj);

	@GET
	@Path("/getListProvince")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	AIOBaseResponse<List<AIOProvinceDTO>> getListProvince();

	@POST
	@Path("/getDataDistrict")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	AIOBaseResponse<List<AIOAreaDTO>> getDataDistrict(AIOOrdersDTO rq);

	@POST
	@Path("/getDataWard")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	AIOBaseResponse<List<AIOAreaDTO>> getDataWard(AIOOrdersDTO rq);

	@POST
	@Path("/updateAioOrder")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	AIOBaseResponse updateAioOrder(AIOOrdersDTO rq);

	@POST
	@Path("/createNewOrder")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	AIOBaseResponse createNewOrder(AIOBaseRequest<AIOOrdersDTO> rq);
}
