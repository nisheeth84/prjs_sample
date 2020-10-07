package com.viettel.aio.rest;

import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOKpiLogDTO;
import com.viettel.aio.dto.AIOPackageDTO;
import com.viettel.aio.dto.report.AIOReportDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

//VietNT_20190619_created
public interface AIOReportRsService {

    @POST
    @Path("/doSearchCostPrice")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchCostPrice(AIOReportDTO obj);

    @POST
    @Path("/getListContract")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getListContract(AIOContractDTO obj);

    @POST
    @Path("/getListPackage")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getListPackage(AIOPackageDTO obj);

    @POST
    @Path("/doSearchRpStock")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchRpStock(AIOReportDTO obj);

    @POST
    @Path("/doSearchRpSalary")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchRpSalary(AIOReportDTO obj);

    @GET
    @Path("/getDropDownData")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDropDownData();

    @POST
    @Path("/exportExcelSalary")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportExcelSalary(AIOReportDTO obj);

    @POST
    @Path("/doSearchRpSalaryDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchRpSalaryDetail(AIOReportDTO obj);

    @POST
    @Path("/exportExcelSalaryDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportExcelSalaryDetail(AIOReportDTO obj);

    @POST
    @Path("/getAutoCompleteSysGroupLevel")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getAutoCompleteSysGroupLevel(AIOReportDTO dto);

    @POST
    @Path("/doSearchDataChart")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchDataChart(AIOReportDTO dto);

    @POST
    @Path("/doSearchDataExport")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchDataExport(AIOReportDTO dto);

    @POST
    @Path("/doSearchAioReportSalary")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchAioReportSalary(AIOReportDTO obj);

    @POST
    @Path("/logAccess")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response logAccess(AIOKpiLogDTO dto);
}