package com.viettel.coms.rest;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.viettel.coms.dto.ConstructionTaskDetailDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import com.viettel.coms.dto.AssignHandoverDTO;

//VietNT_20181210_created
public interface AssignHandoverRsService {

	@POST
	@Path("/doSearch")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response doSearch(AssignHandoverDTO obj);

	@POST
	@Path("/addNewAssignHandover")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response addNewAssignHandover(AssignHandoverDTO obj);

	@POST
	@Path("/removeAssignHandover")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response removeAssignHandover(AssignHandoverDTO obj);

	@POST
	@Path("/attachDesignFileEdit")
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response attachDesignFileEdit(AssignHandoverDTO dto) throws Exception;

	@POST
	@Path("/importExcel")
	@Consumes({MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_JSON})
	@Produces(MediaType.APPLICATION_JSON)
	Response importExcel(Attachment attachments, @Context HttpServletRequest request) throws Exception;

	@POST
	@Path("/downloadTemplate")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	Response downloadTemplate() throws Exception;

    @POST
    @Path("/getById")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getById(Long id) throws Exception;

	//VietNT_20181218_start
	@POST
	@Path("/readFileConstructionCode")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	Response readFileConstructionCode(Attachment attachments, @Context HttpServletRequest request);

	@POST
	@Path("/doAssignHandover")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response doAssignHandover(AssignHandoverDTO obj);

	@POST
	@Path("/doSearchNV")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response doSearchNV(AssignHandoverDTO obj);

	@POST
	@Path("/getListImageHandover")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response getListImageHandover(Long handoverId);

	@POST
	@Path("/getConstructionProvinceByCode")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response getConstructionProvinceByCode(String constructionCode);

	@POST
	@Path("/getForSysUserAutoComplete")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response getForSysUserAutoComplete(SysUserCOMSDTO obj);

	@POST
	@Path("/updateWorkItemPartner")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response updateWorkItemPartner(ConstructionTaskDetailDTO dto);
	//VietNT_end
	//VietNT_20180225_start
	@POST
	@Path("/exportHandoverNV")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response exportHandoverNV(AssignHandoverDTO dto);
	//VietNT_end
}