package com.viettel.aio.rest;

import com.viettel.aio.dto.AIOMonthPlanDTO;
import com.viettel.aio.dto.AIOMonthPlanDetailDTO;
import com.viettel.aio.dto.AIOStaffPlainDTO;
import com.viettel.aio.dto.AIOStaffPlanDetailDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public interface AIOEmployeeManagerRsService {

	@POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIOStaffPlainDTO obj);

    @POST
    @Path("/exportDetailToExcel")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportDetailToExcel(AIOStaffPlainDTO obj);
	
	@POST
    @Path("/getDetailByMonthPlanId")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDetailByMonthPlanId(AIOStaffPlainDTO obj);

    @POST
    @Path("/getDetailByStaffPlanId")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDetailByStaffPlanId(AIOStaffPlainDTO obj);

    @POST
    @Path("/getMonthlyTargetsByStaffId")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getMonthlyTargetsByStaffId(AIOStaffPlainDTO obj);

	@POST
    @Path("/exportFileBM")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportFileBM(AIOStaffPlainDTO obj) throws Exception;

	@POST
	@Path("/importExcel")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public Response importExcel(Attachment attachments, @Context HttpServletRequest request) throws Exception;

	@POST
    @Path("/insertMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response insertMonthPlan(AIOStaffPlainDTO obj);


    @POST
    @Path("/searchColumnsConfigService")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response searchColumnsConfigService();


	@POST
    @Path("/updateMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updateMonthPlan(AIOStaffPlainDTO obj);
//
	@POST
    @Path("/getAllSysGroupByCode")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getAllSysGroupByCode(AIOStaffPlanDetailDTO obj);


    @POST
    @Path("/getAllSysUserByName")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getAllSysUserByName(AIOStaffPlanDetailDTO obj);

//
//	@POST
//    @Path("/getAllDomainDataByCode")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response getAllDomainDataByCode(AIOMonthPlanDetailDTO obj);
//
	@POST
    @Path("/removerMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public void removerMonthPlan(AIOStaffPlainDTO obj);

	@POST
    @Path("/checkDataMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response checkDataMonthPlan(AIOStaffPlainDTO obj);



//	@POST
//    @Path("/doSearchChart")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response doSearchChart(AIOMonthPlanDetailDTO obj);
//
//	@POST
//    @Path("/getAutoCompleteSysGroupLevel")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response getAutoCompleteSysGroupLevel(AIOMonthPlanDetailDTO obj);
//
//	@POST
//    @Path("/doSearchChartLine")
//    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
//    Response doSearchChartLine(AIOMonthPlanDetailDTO obj);
//
	@POST
    @Path("/getAioMonthPlanDTO")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getAioMonthPlanDTO(Long id);

    @POST
    @Path("/validateNewEdit")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response validateNewEdit(AIOStaffPlanDetailDTO obj);
}
