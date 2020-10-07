/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.dto.*;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.util.List;

/**
 * @author HungLQ9
 */
public interface ConstructionTaskRsService {

    @POST
    @Path("/constructionTask/getConstructionTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getConstructionTask();

    @POST
    @Path("/constructionTask/getConstructionTaskById")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getConstructionTaskById(Long id);

    // ############################################################################

    @POST
    @Path("/constructionTask/getDataForGrant")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getDataForGrant(GranttDTO granttSearch);

    @POST
    @Path("/constructionTask/getDataResources")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getDataResources();

    @POST
    @Path("/constructionTask/getDataAssignments")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getDataAssignments(GranttDTO granttSearch);

    @POST
    @Path("/constructionTask/updateCompletePercent")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateCompletePercent(ConstructionTaskGranttDTO dto);

    @POST
    @Path("/constructionTask/deleteGrantt")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response deleteGrantt(ConstructionTaskGranttDTO dto);

    @POST
    @Path("/constructionTask/createTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response createTask(ConstructionTaskGranttDTO dto);

    @POST
    @Path("/checkPermissions")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissions(ConstructionDetailDTO obj);

    @POST
    @Path("/constructionTask/getDataConstructionGrantt")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getDataConstructionGrantt(GranttDTO granttSearch);

    // ############################################################################

    @POST
    @Path("/constructionTask/updateConstructionTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateConstructionTask(ConstructionTaskDTO obj);

    @POST
    @Path("/constructionTask/addConstructionTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addConstructionTask(ConstructionTaskDTO obj);

    @POST
    @Path("/doSearchForReport")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchForReport(ConstructionTaskDetailDTO obj);

    @POST
    @Path("/constructionTask/deleteConstructionTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response deleteConstructionTask(Long id);

    @POST
    @Path("/exportConstructionTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportConstructionTask(ConstructionTaskDetailDTO obj) throws Exception;
    //Huypq-20181017-start
    @POST
    @Path("/exportConstructionTaskSlow")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportConstructionTaskSlow(GranttDTO granttSearch) throws Exception;
    //Huypq-end
    @POST
    @Path("/doSearchForConsManager")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchForConsManager(ConstructionTaskDetailDTO obj);

    @POST
    @Path("/doSearchForRevenue")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchForRevenue(ConstructionTaskDetailDTO obj);

    @POST
    @Path("/exportContructionHSHC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportContructionHSHC(ConstructionTaskDetailDTO obj) throws Exception;

    @POST
    @Path("/exportContructionDT")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportContructionDT(ConstructionTaskDetailDTO obj) throws Exception;

    @POST
    @Path("/removeComplete")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response removeComplete(List<String> listId) throws Exception;

    @POST
    @Path("/removeHSHC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response removeHSHC(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/approveConstrRevenue")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response approveRevenue(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/callbackConstrRevenue")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response callbackConstrRevenue(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/rejectionConstrRevenue")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response rejectionRevenue(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/construction/addConstructionTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addConstructionTask(ConstructionTaskDetailDTO obj) throws Exception;

    @POST
    @Path("/construction/searchConstruction")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response searchConstruction(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/rpDailyTaskConstruction")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response rpDailyTConstruction(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/construction/searchConstructionDSTH")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response searchConstructionDSTH(ConstructionDetailDTO obj) throws Exception;

    @POST
    @Path("/construction/searchWorkItems")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response searchWorkItems(WorkItemDetailDTO obj) throws Exception;

    @POST
    @Path("/constructionTask/rpDailyTaskWorkItems")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response rpDailyTaskWorkItems(WorkItemDetailDTO obj) throws Exception;

    @POST
    @Path("/construction/searchCatTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response searchCatTask(WorkItemDetailDTO obj) throws Exception;

    @POST
    @Path("/construction/searchPerformer")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response searchPerformer(SysUserDetailCOMSDTO obj) throws Exception;

    @POST
    @Path("/construction/updatePerfomer")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updatePerfomer(ConstructionTaskDTO obj) throws Exception;

    @POST
    @Path("/exportPdfService")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_OCTET_STREAM})
    public Response exportPdfService(ConstructionTaskDetailDTO obj) throws Exception;

    @POST
    @Path("/construction/getCountConstruction")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getCountConstruction(GranttDTO obj) throws Exception;

    @POST
    @Path("/construction/getCountConstructionForTc")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getCountConstructionForTc(GranttDTO obj) throws Exception;

    @POST
    @Path("/construction/addConstructionTaskTC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addConstructionTaskTC(ConstructionTaskDetailDTO obj) throws Exception;

    // chinhpxn20180714_start
    @GET
    @Path("/downloadFileForConstructionTask")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFileForConstructionTask(@Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importConstructionTask")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importConstructionTask(Attachment attachments, @Context HttpServletRequest request)
            throws Exception;

    // chinhpxn20180714_end

    @POST
    @Path("/constructionTask/getListImageById")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getListImageById(ConstructionTaskDTO obj) throws Exception;

    @POST
    @Path("/constructionTask/rpSumTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response rpSumTask(ConstructionTaskDTO obj);

    @POST
    @Path("/constructionTask/exportExcelRpSumTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelRpSumTask(ConstructionTaskDTO dto) throws Exception;

    //nhantv - 180811
    @POST
    @Path("/getWorkItemForAssign")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getWorkItemForAssign(WorkItemDetailDTO obj) throws Exception;

    @POST
    @Path("/getWorkItemForAddingTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getWorkItemForAddingTask(WorkItemDetailDTO obj);

    @POST
    @Path("/getForChangePerformerAutocomplete")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getForChangePerformerAutocomplete(ConstructionTaskDTO obj);

    @POST
    @Path("/getConstrForChangePerformer")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getConstrForChangePerformer(ConstructionTaskDTO obj);

    @POST
    @Path("/getPerformerForChanging")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getPerformerForChanging(ConstructionTaskDTO obj);

    @POST
    @Path("/getPerformerAutocomplete")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getPerformerAutocomplete(ConstructionTaskDTO obj);

    @POST
    @Path("/findForChangePerformer")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response findForChangePerformer(ConstructionTaskDTO obj);

    @POST
    @Path("/updatePerformer")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updatePerformer(ConstructionTaskDetailDTO obj);

    @POST
    @Path("/saveListTaskFromImport")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	Response saveListTaskFromImport(ConstructionTaskDetailDTO obj)
			throws Exception;

    @POST
    @Path("/importLDT")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importLDT(Attachment attachments, @Context HttpServletRequest request) throws Exception;
    
    @POST
    @Path("/importHSHC")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importHSHC(Attachment attachments, @Context HttpServletRequest request) throws Exception;
    
  //Huypq_20181025-start-chart
    @POST
    @Path("/getDataChart")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getDataChart(ConstructionTaskDTO obj);
    
    @POST
    @Path("/getDataChartAcc")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getDataChartAcc(ConstructionTaskDTO obj);
  //Huypq_20181025-end-chart

    //VietNT_28112018
    @POST
    @Path("/importConstructionHSHC")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importConstructionHSHC(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/downloadTemplateFileHSHC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response downloadTemplateFileHSHC(ConstructionTaskDetailDTO dto) throws Exception;
    //VietNT_end
	//Tungtt_20181129_ start
    @POST
    @Path("/checkPermissionsApproved")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissionsApproved(ConstructionDetailDTO obj);
    
   
    @POST
    @Path("/approveHSHC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response approveHSHC(ConstructionDetailDTO obj);
    
    @POST
    @Path("/UpdateUndoHshc")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response UpdateUndoHshc(ConstructionDetailDTO obj);
    
    @POST
    @Path("/checkPermissionsApprovedHSHC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissionsApprovedHSHC (ConstructionDetailDTO obj);
    
    @POST
    @Path("/checkPermissionsUndo")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissionsUndo (ConstructionDetailDTO obj);
    //Tungtt_20181129_ end
    //VietNT_20181207_start
    @POST
    @Path("/getConstructionByStationId")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getConstructionByStationId(ConstructionDTO obj) throws Exception;
    //VietNT_end
}
