/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.dto.*;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author HungLQ9
 */
public interface TotalMonthPlanRsService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearch(TotalMonthPlanSimpleDTO obj);

    @POST
    @Path("/remove")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response remove(TotalMonthPlanSimpleDTO obj);
//  hungtd_20181213_start
  @POST
  @Path("/updateRegistry")
  @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
  @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
  public Response updateRegistry(TotalMonthPlanSimpleDTO obj);
//  hungtd_20181213_end
    //
    @POST
    @Path("/add")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response add(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/update")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response update(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/getById")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getById(Long id) throws Exception;

    @POST
    @Path("/getByIdCopy")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getByIdCopy(Long id) throws Exception;

    @POST
    @Path("/getSequence")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getSequence() throws Exception;

    @POST
    @Path("/exportExcelTemplateTarget")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelTemplateTarget() throws Exception;

    @POST
    @Path("/exportExcelTemplateSource")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelTemplateSource() throws Exception;

    @POST
    @Path("/exportExcelTemplateForceMaintain")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelTemplateForceMaintain() throws Exception;

    @POST
    @Path("/exportExcelTemplateForceNewBts")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelTemplateForceNewBts() throws Exception;

    @POST
    @Path("/exportExcelTemplateForceNewLine")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelTemplateForceNewLine() throws Exception;

    @POST
    @Path("/exportExcelTemplateMaterial")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelTemplateMaterial() throws Exception;

    @POST
    @Path("/exportExcelTemplateFinance")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelTemplateFinance() throws Exception;

    @POST
    @Path("/exportExcelTemplateContract")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcelTemplateContract() throws Exception;

    @POST
    @Path("/importTarget")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importTarget(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importSource")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importSource(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importForceMaintain")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importForceMaintain(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importForceNewBts")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importForceNewBts(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importForceNewLine")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importForceNewLine(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importMaterial")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importMaterial(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importFinance")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importFinance(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importContract")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importContract(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/fillterAllActiveCatConstructionType")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response fillterAllActiveCatConstructionType(TotalMonthPlanSimpleDTO obj);

    @POST
    @Path("/fillterAllActiveCatConstructionDeploy")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response fillterAllActiveCatConstructionDeploy(TotalMonthPlanSimpleDTO obj);

    @POST
    @Path("/saveTarget")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response saveTarget(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/saveSource")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response saveSource(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/saveContract")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response saveContract(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/saveFinance")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response saveFinance(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/saveMaterial")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response saveMaterial(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/saveForceNewBTS")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response saveForceNewBTS(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/saveForceNew")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response saveForceNew(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/saveForceMaintain")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response saveForceMaintain(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/getYearPlanDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getYearPlanDetail(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/exportTotalMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportTotalMonthPlan(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/getByIdTarget")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getByIdTarget(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/exportDetailTargetTotalMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailTargetTotalMonthPlan(TmpnTargetDTO obj) throws Exception;

    @POST
    @Path("/exportDetailSourceTotalMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailSourceTotalMonthPlan(TmpnSourceDTO obj) throws Exception;

    @POST
    @Path("/exportDetailForceMaintainTotalMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailForceMaintainTotalMonthPlan(TmpnForceMaintainDTO obj) throws Exception;

    @POST
    @Path("/exportDetailMaterialTotalMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailMaterialTotalMonthPlan(TmpnMaterialDTO obj) throws Exception;

    @POST
    @Path("/exportDetailFinanceTotalMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailFinanceTotalMonthPlan(TmpnFinanceDTO obj) throws Exception;

    @POST
    @Path("/exportDetailContractTotalMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailContractTotalMonthPlan(TmpnContractDTO obj) throws Exception;

    @POST
    @Path("/getLKBySysList")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getLKBySysList(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/saveAppendixFile")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response saveAppendixFile(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/getFileAppendixParam")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getFileAppendixParam() throws Exception;

    @POST
    @Path("/exportDetailBTSGTotalMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailBTSGTotalMonthPlan(Long id) throws Exception;

    @POST
    @Path("/exportDetailForceNewTotalMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailForceNewTotalMonthPlan(Long id) throws Exception;

    @POST
    @Path("/doSearchTarget")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchTarget(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/doSearchSource")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchSource(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/doSearchForcemaintain")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchForcemaintain(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/doSearchBTS")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchBTS(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/doSearchForceNew")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchForceNew(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/doSearchMaterial")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchMaterial(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/doSearchFinance")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchFinance(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/doSearchContract")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchContract(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/doSearchAppendix")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchAppendix(TotalMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/checkPermissionsAdd")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissionsAdd();

    @POST
    @Path("/checkPermissionsCopy")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissionsCopy();

    @POST
    @Path("/checkPermissionsDelete")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissionsDelete();

    @POST
    @Path("/checkPermissionsRegistry")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissionsRegistry();

    @POST
    @Path("/checkPermissionsUpdate")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissionsUpdate();

}
