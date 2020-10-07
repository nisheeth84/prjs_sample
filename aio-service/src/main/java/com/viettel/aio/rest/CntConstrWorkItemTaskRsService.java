package com.viettel.aio.rest;

import com.viettel.aio.dto.CntAppendixJobDTO;
import com.viettel.aio.dto.CntConstrWorkItemTaskDTO;
import com.viettel.aio.dto.CntContractDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author hailh10
 */
 
public interface CntConstrWorkItemTaskRsService {

//	@GET
//	@Path("/cntConstrWorkItemTask/findById")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response getById(@QueryParam("id") Long id);
//
//	@POST
//	@Path("/update")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response update(CntConstrWorkItemTaskDTO obj);
//
//	@POST
//	@Path("/add")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response add(CntConstrWorkItemTaskDTO obj);
//
	@POST
	@Path("/remove")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response delete(CntConstrWorkItemTaskDTO obj);
	
	
	
	@POST
	@Path("/doSearch")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response doSearch(CntConstrWorkItemTaskDTO obj);
	
//	@POST
//	@Path("/doSearchForTab")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response doSearchForTab(CntConstrWorkItemTaskDTO obj);
//
//	@PUT
//	@Path("/cntConstrWorkItemTask/deleteList/")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response deleteList(List<Long> ids);
//
//
//	@POST
//	@Path("/cntConstrWorkItemTask/findByAutoComplete")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//    public Response findByAutoComplete(CntConstrWorkItemTaskDTO obj);
//
	@GET
	@Path("/downloadFile")
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response downloadFile(@Context HttpServletRequest request)
			throws Exception;
//
//	@POST
//    @Path("/importCntConstruction")
//    @Consumes(MediaType.MULTIPART_FORM_DATA)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response importCntConstruction(Attachment attachments, @Context HttpServletRequest request) throws Exception;
//
	@POST
	@Path("/getConstructionTask")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response getConstructionTask(CntConstrWorkItemTaskDTO criteria);

	@POST
	@Path("/getConstructionWorkItem")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response getConstructionWorkItem(CntConstrWorkItemTaskDTO criteria);
//
//	@POST
//	@Path("/getTaskProgress")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response getTaskProgress(CntConstrWorkItemTaskDTO criteria);
//
//	@POST
//	@Path("/doSearchContractProgress")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response doSearchContractProgress(CntContractDTO criteria);
//
//	@POST
//	@Path("/exportContractProgress")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	Response exportContractProgress(CntContractDTO criteria) throws Exception;
//
//	@POST
//	@Path("/doSearchContractProgressDetail")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	Response doSearchContractProgressDetail(CntContractDTO criteria);
//
//	@POST
//	@Path("/exportContractProgressPDF")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	Response exportContractProgressPDF(CntContractDTO criteria) throws Exception;
//
	@POST
	@Path("/getConstructionByContractId")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response getConstructionByContractId(CntConstrWorkItemTaskDTO criteria) throws Exception;
	/**TRUNGPT start 25/11/19**/
	@POST
	@Path("/addOS")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response addOS(CntConstrWorkItemTaskDTO obj);
//
//	@POST
//	@Path("/updateOS")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response updateOS(CntConstrWorkItemTaskDTO obj);
//
	@POST
    @Path("/importCntConstructionOS")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
     Response importCntConstructionOS(Attachment attachments, @Context HttpServletRequest request) throws Exception;
//	/**Hoangnh end 28012019**/
//
//	//hienvd: Start 8/7/2019
	@POST
	@Path("/doSearchAppendixJob")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	Response doSearchAppendixJob(CntAppendixJobDTO criteria);
//	//hienvd: end

	@POST
	@Path("/exportExcelTemplate")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	Response exportExcelTemplate(String fileName) throws Exception;
//
//	//hienvd: START 9/9/2019
//
//	@POST
//	@Path("/importCntConstructionOSTypeHTCT")
//	@Consumes(MediaType.MULTIPART_FORM_DATA)
//	@Produces(MediaType.APPLICATION_JSON)
//	public Response importCntConstructionOSTypeHTCT(Attachment attachments, @Context HttpServletRequest request) throws Exception;
//	//hienvd: END
//
//	//Huypq-20190919-start
//	@POST
//    @Path("/importCntConstructionHTCT")
//    @Consumes(MediaType.MULTIPART_FORM_DATA)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response importCntConstructionHTCT(Attachment attachments, @Context HttpServletRequest request) throws Exception;
//
//	@POST
//	@Path("/addHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response addHTCT(CntConstrWorkItemTaskDTO obj);
//
//	@POST
//	@Path("/updateHTCT")
//	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response updateHTCT(CntConstrWorkItemTaskDTO obj);
	//Huy-end
}
