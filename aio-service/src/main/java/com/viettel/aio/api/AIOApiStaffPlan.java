package com.viettel.aio.api;

import com.viettel.aio.business.CommonServiceAio;
import com.viettel.aio.request.RequestMsg;
import com.viettel.aio.request.staff.plan.RequestStaffPlan;
import com.viettel.aio.response.ResponseMsg;
import com.viettel.aio.service.staff.plan.AIOStaffPlanService;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;


public class AIOApiStaffPlan {
    @Autowired
    AIOStaffPlanService staffPlanService;
    @Autowired
    private CommonServiceAio commonServiceAio;

    @POST
    @Path("/api_staff_plan")
    @Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    public ResponseMsg apiPost(RequestMsg<RequestStaffPlan> requestMsg){
        try {
            return staffPlanService.doAction(requestMsg);
        }catch (Exception e){
            return returnException(e);
        }
    }
    @POST
    @Path("/api_staff_plan_import_file")
    @Consumes({MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_JSON})
    @Produces(MediaType.APPLICATION_JSON)
    public ResponseMsg importFile(Attachment attachments, @Context HttpServletRequest request){
        String filePath = commonServiceAio.uploadToServer(attachments, request);
        try{
            RequestMsg<RequestStaffPlan> requestMsg= new RequestMsg<>();
            RequestStaffPlan requestStaffPlan=new RequestStaffPlan();
            requestStaffPlan.setPathFile(filePath);
            requestMsg.setData(requestStaffPlan);
            requestMsg.setServiceCode("STAFF_PLAN_IMPORT_EXCELL");
            return  staffPlanService.doAction(requestMsg);
        }catch (Exception e){
            return returnException(e);
        }
    }

    private ResponseMsg returnException(Exception e){
        ResponseMsg responseMsg=new ResponseMsg();
        responseMsg.setStatus(500);
        responseMsg.setMessage(e.toString());
        return responseMsg;
    }
}
