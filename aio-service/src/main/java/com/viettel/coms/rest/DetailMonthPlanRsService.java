/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.dto.ConstructionTaskDTO;
import com.viettel.coms.dto.ConstructionTaskDetailDTO;
import com.viettel.coms.dto.DetailMonthPlanSimpleDTO;
import com.viettel.coms.dto.SysUserDetailCOMSDTO;
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
public interface DetailMonthPlanRsService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearch(DetailMonthPlanSimpleDTO obj);

    @POST
    @Path("/remove")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response remove(DetailMonthPlanSimpleDTO obj);
//    hungtd_20181213_start
    @POST
    @Path("/updateRegistry")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateRegistry(DetailMonthPlanSimpleDTO obj);
//    hungtd_20181213_end

    //
    @POST
    @Path("/add")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response add(DetailMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/update")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response update(DetailMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/getById")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getById(Long id) throws Exception;

    @POST
    @Path("/constructionTask/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchConsTask(ConstructionTaskDetailDTO obj) throws Exception;

    @POST
    @Path("/getSequence")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getSequence() throws Exception;

    @POST
    @Path("/updateListTC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateListTC(DetailMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/updateListHSHC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateListHSHC(DetailMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/updateListLDT")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateListLDT(DetailMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/updateListDT")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateListDT(DetailMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/updateListCVK")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateListCVK(DetailMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/getWorkItemDetail")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getWorkItemDetail(DetailMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/getYearPlanDetailTarget")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getYearPlanDetailTarget(DetailMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/exportTemplateListTC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportTemplateListTC(SysUserDetailCOMSDTO obj) throws Exception;

    @POST
    @Path("/exportTemplateListHSHC")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportTemplateListHSHC(SysUserDetailCOMSDTO obj) throws Exception;

    @POST
    @Path("/exportTemplateListLDT")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportTemplateListLDT(SysUserDetailCOMSDTO obj) throws Exception;

    @POST
    @Path("/exportTemplateListCVK")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportTemplateListCVK(SysUserDetailCOMSDTO obj) throws Exception;

    @POST
    @Path("/exportTemplateListDT")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportTemplateListDT(SysUserDetailCOMSDTO obj) throws Exception;

    @POST
    @Path("/exportTemplateListYCVT")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportTemplateListYCVT(SysUserDetailCOMSDTO obj) throws Exception;

    @POST
    @Path("/importTC")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importTC(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importHSHC")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importHSHC(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importLDT")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importLDT(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importCVK")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importCVK(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importDT")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importDT(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/importYCVT")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importYCVT(Attachment attachments, @Context HttpServletRequest request) throws Exception;

    @POST
    @Path("/doSearchMaterial")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response doSearchMaterial(ConstructionTaskDetailDTO obj) throws Exception;

    @POST
    @Path("/updateListDmpnOrder")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response updateListDmpnOrder(DetailMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/exportDetailMonthPlan")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailMonthPlan(DetailMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/exportDetailMonthPlanTab1")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailMonthPlanTab1(ConstructionTaskDetailDTO obj) throws Exception;

    @POST
    @Path("/exportDetailMonthPlanTab2")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailMonthPlanTab2(ConstructionTaskDetailDTO obj) throws Exception;

    @POST
    @Path("/exportDetailMonthPlanTab3")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailMonthPlanTab3(ConstructionTaskDetailDTO obj) throws Exception;

    @POST
    @Path("/exportDetailMonthPlanTab5")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailMonthPlanTab5(ConstructionTaskDetailDTO obj) throws Exception;

    @POST
    @Path("/exportDetailMonthPlanTab6")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailMonthPlanTab6(ConstructionTaskDetailDTO obj) throws Exception;

    @POST
    @Path("/exportDetailMonthPlanBTS")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportDetailMonthPlanBTS(ConstructionTaskDetailDTO obj) throws Exception;

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
    public Response checkPermissionsDelete(DetailMonthPlanSimpleDTO obj) throws Exception;

    @POST
    @Path("/checkPermissionsRegistry")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissionsRegistry();

    @POST
    @Path("/checkPermissionsUpdate")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response checkPermissionsUpdate(DetailMonthPlanSimpleDTO obj) throws Exception;
    
    //tanqn start 20181108
    @POST
    @Path("/removeRow")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response removeRow(ConstructionTaskDTO obj);
    //tanqn start 20181108

}
