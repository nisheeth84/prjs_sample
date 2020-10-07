package com.viettel.coms.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.viettel.coms.dto.ConstructionDTO;
import com.viettel.coms.dto.GoodsDTO;
import com.viettel.coms.dto.SynStockDailyImportExportDTO;
import com.viettel.coms.dto.SynStockDailyImportExportRequest;
import com.viettel.coms.dto.SynStockDailyRemainDTO;

//VietNT_20190129_start
public interface SynStockDailyImportExportRsService {

//    @POST
//    @Path("/doSearch")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response doSearch(SynStockDailyImportExportDTO obj);
	@POST
	@Path("/doSearchDebt")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response doSearchDebt(SynStockDailyRemainDTO obj);
	
	@POST
	@Path("/doSearchImportExportTonACap")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response doSearchImportExportTonACap(SynStockDailyRemainDTO obj);
	
	@POST
	@Path("/exportExcelDebt")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response exportExcelDebt(SynStockDailyRemainDTO obj) throws Exception;
	
	@POST
	@Path("/getForCompleteGoods")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response getForCompleteGoods(GoodsDTO obj);
	
	@POST
	@Path("/doSearchGoods")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response doSearchGoods(SynStockDailyRemainDTO obj);
	
	@POST
	@Path("/exportExcelImportExportTonACap")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response exportExcelImportExportTonACap(SynStockDailyRemainDTO obj) throws Exception;
	
	@POST
	@Path("/doSearchCompareReport")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response doSearchCompareReport(SynStockDailyRemainDTO obj);
	
	@POST
	@Path("/getForCompleteConstruction")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response getForCompleteConstruction(ConstructionDTO obj);
	
	@POST
	@Path("/exportExcelCompare")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response exportExcelCompare(SynStockDailyRemainDTO obj) throws Exception;
	
//VietNT_20190218_start
	@POST
    @Path("/doSearchGoodsDebtConfirmDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchGoodsDebtConfirmDetail(SynStockDailyImportExportDTO obj);

    @POST
    @Path("/exportGoodsDebtConfirmDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportGoodsDebtConfirmDetail(SynStockDailyImportExportRequest obj);

    @POST
    @Path("/doSearchGoodsDebtConfirmGeneral")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchGoodsDebtConfirmGeneral(SynStockDailyImportExportDTO obj);

    @POST
    @Path("/exportGoodsDebtConfirmGeneral")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportGoodsDebtConfirmGeneral(SynStockDailyImportExportRequest obj);

    @POST
    @Path("/doSearchContractPerformance")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchContractPerformance(SynStockDailyImportExportDTO obj);

    @POST
    @Path("/exportContractPerformance")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportContractPerformance(SynStockDailyImportExportDTO obj);

    @POST
    @Path("/doSearchRpDetailIERByConstructionCode")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchRpDetailIERByConstructionCode(SynStockDailyImportExportDTO obj);

    @POST
    @Path("/getGoodsForAutoComplete")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getGoodsForAutoComplete(GoodsDTO obj);

    @POST
    @Path("/exportDetailIERGoods")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportDetailIERGoods(SynStockDailyImportExportDTO obj);
//VietNT_20190218_end
}