package com.viettel.aio.rest;

import com.viettel.aio.dto.AIOMonthPlanDTO;
import com.viettel.aio.dto.AIOMonthPlanDetailDTO;
import com.viettel.aio.dto.report.AIOReportDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.text.ParseException;

public interface AIOMonthPlanRsService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIOMonthPlanDTO obj);

    @POST
    @Path("/getDetailByMonthPlanId")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDetailByMonthPlanId(AIOMonthPlanDTO obj);

    @POST
    @Path("/exportFileBM")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportFileBM(AIOMonthPlanDTO obj) throws Exception;

    @POST
    @Path("/importExcel")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importExcel(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/insertMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response insertMonthPlan(AIOMonthPlanDTO obj);

    @POST
    @Path("/updateMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updateMonthPlan(AIOMonthPlanDTO obj);

    @POST
    @Path("/getAllSysGroupByName")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getAllSysGroupByName(AIOMonthPlanDetailDTO obj);

    @POST
    @Path("/getAllDomainDataByCode")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getAllDomainDataByCode(AIOMonthPlanDetailDTO obj);

    @POST
    @Path("/removerMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public void removerMonthPlan(AIOMonthPlanDTO obj);

    @POST
    @Path("/checkDataMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response checkDataMonthPlan(AIOMonthPlanDTO obj);

    @POST
    @Path("/doSearchChart")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchChart(AIOMonthPlanDetailDTO obj);

    @POST
    @Path("/getAutoCompleteSysGroupLevel")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getAutoCompleteSysGroupLevel(AIOMonthPlanDetailDTO obj);

    @POST
    @Path("/doSearchChartLine")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchChartLine(AIOMonthPlanDetailDTO obj);

    @POST
    @Path("/getAioMonthPlanDTO")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getAioMonthPlanDTO(Long id);

    //huypq-20190930-start
    @POST
    @Path("/doSearchChartColumnFailProvince")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchChartColumnFailProvince(AIOMonthPlanDTO obj) throws ParseException;

    //huypq-20190930-end
    //tatph-start-16/12/2019
    @POST
    @Path("/doSearchChartColumnFailGroup")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchChartColumnFailGroup(AIOReportDTO obj) throws ParseException;
    //tatph-end-16/12/2019
}
