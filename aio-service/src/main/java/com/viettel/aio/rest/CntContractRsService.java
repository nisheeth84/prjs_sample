package com.viettel.aio.rest;

import com.viettel.aio.dto.*;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author hailh10
 */
 
public interface CntContractRsService {

	@GET
	@Path("/cntContract/findById")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response getById(@QueryParam("id") Long id);

	@POST
	@Path("/update")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response update(CntContractDTO obj);

	@POST
	@Path("/add")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response add(CntContractDTO obj);

	@POST
	@Path("/remove")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response delete(CntContractDTO obj);
	
	
	@POST
	@Path("/doSearch")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response doSearch(CntContractDTO obj);
	
	@PUT
	@Path("/cntContract/deleteList/")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response deleteList(List<Long> ids);
	
	
	
	@POST
	@Path("/cntContract/findByAutoComplete")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Response findByAutoComplete(CntContractDTO obj);
	
	
//	hoanm1_20180303_start
	@POST
	@Path("/getForAutoComplete")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Response getForAutoComplete(CntContractDTO obj);
	
	@POST
	@Path("/getForAutoCompleteKTTS")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Response getForAutoCompleteKTTS(CntContractDTO obj);
	
	@POST
	@Path("/mapContract")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	 Response mapContract(CntContractDTO obj);
	
	@POST
	@Path("/getListContract")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response getListContract(CntContractDTO obj);
	
	@POST
	@Path("/getListContractKTTS")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response getListContractKTTS(CntContractDTO obj);
//	hoanm1_20180303_end
	
	@POST
	@Path("/getCntInformation")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public ContractInformationDTO getCntInformation(CntContractDTO contractId);
	
//	chinhpxn_20180712_start
	@POST
	@Path("/doSearchForReport")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response doSearchForReport(CntContractReportDTO obj);
	
	@POST
	@Path("/exportContractProgress")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response exportContractProgress(CntContractReportDTO criteria) throws Exception;
//	chinhpxn_20180712_end
	
	//Huypq-20181114-start
	@POST
	@Path("/getForAutoCompleteContract")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response getForAutoCompleteContract(CntContractDTO obj);
	
	@POST
	@Path("/doSearchContractOut")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response doSearchContractOut(CntContractDTO obj);
	//huy-end
	
	//Huypq-20190612-start
	@POST
	@Path("/checkDeleteContractOS")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response checkDeleteContractOS();
	//Huy-end
	
	//Huypq-20191021-start
	@POST
	@Path("/doSearchContractXNXD")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response doSearchContractXNXD(ManageQuantityConsXnxdDTO obj);
	
	@POST
	@Path("/getDataContractTaskXNXD")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response getDataContractTaskXNXD(ManageQuantityConsXnxdDTO obj);
	
	@POST
	@Path("/getDataQuantityByDate")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response getDataQuantityByDate(ManageQuantityConsXnxdDTO obj);
	
	@POST
	@Path("/updateQuantityCons")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response updateQuantityCons(ManageQuantityConsXnxdDTO obj);
	
	@POST
	@Path("/doSearchRevenueXnxd")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response doSearchRevenueXnxd(ManageRevenueConsXnxdDTO obj);
	
	@POST
	@Path("/updateRevenueCons")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response updateRevenueCons(ManageRevenueConsXnxdDTO obj);
	
	@POST
	@Path("/saveRevenueCons")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response saveRevenueCons(ManageRevenueConsXnxdDTO obj);
	
	@POST
	@Path("/exportQuantityConsXnxd")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response exportQuantityConsXnxd(ManageQuantityConsXnxdDTO obj);
	
	@POST
	@Path("/exportRevenueConsXnxd")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response exportRevenueConsXnxd(ManageRevenueConsXnxdDTO obj);
	
	@POST
	@Path("/doSearchReportQuantity")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response doSearchReportQuantity(ManageQuantityConsXnxdDTO obj);
	
	@POST
	@Path("/doSearchReportRevenue")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response doSearchReportRevenue(ManageRevenueConsXnxdDTO obj);
	
	@POST
	@Path("/doSearchQuantityRevenue")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response doSearchQuantityRevenue(ManageQuantityConsXnxdDTO obj);
	
	@POST
	@Path("/exportQuantityRevenueConsXnxd")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response exportQuantityRevenueConsXnxd(ManageQuantityConsXnxdDTO obj);
	//Huy-end
}
