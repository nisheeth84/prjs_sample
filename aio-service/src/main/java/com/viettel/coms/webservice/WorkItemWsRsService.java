package com.viettel.coms.webservice;

import com.viettel.asset.business.AuthenticateWsBusiness;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.business.WorkItemBusinessImpl;
import com.viettel.coms.dao.ConstructionTaskDAO;
import com.viettel.coms.dto.*;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")
public class WorkItemWsRsService {
    private Logger LOGGER = Logger.getLogger(ConstructionTaskWsRsService.class);
    @Autowired
    WorkItemBusinessImpl workItemBusiness;

    @Autowired
    ConstructionTaskDAO construcitonTaskDao;

    @Autowired
    AuthenticateWsBusiness authenticateWsBusiness;

    @POST
    @Path("/getNameWorkItemByConstructionId/")
    public ConstructionStationWorkItemDTOResponse getNameWorkItem(ConstructionStationWorkItemDTORequest request) {
        ConstructionStationWorkItemDTOResponse response = new ConstructionStationWorkItemDTOResponse();
        try {

            authenticateWsBusiness.validateRequest(request.getSysUserRequest());
            List<ConstructionStationWorkItemDTO> data = workItemBusiness.getNameWorkItem(request.getConstructionStationWorkItem());
            response.setListConstructionStationWorkItem(data);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setResultInfo(resultInfo);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;
    }


    @POST
    @Path("/getNameCatTask/")
    public ConstructionStationWorkItemDTOResponse getNameConstructionTaskTask(ConstructionStationWorkItemDTORequest request) {
        ConstructionStationWorkItemDTOResponse response = new ConstructionStationWorkItemDTOResponse();
        try {

            authenticateWsBusiness.validateRequest(request.getSysUserRequest());
            List<ConstructionStationWorkItemDTO> data = workItemBusiness.getNameCatTask(request.getConstructionStationWorkItem());
            response.setListConstructionStationWorkItem(data);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setResultInfo(resultInfo);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;

    }

    // danh sach hang muc hoan thanh
    @POST
    @Path("/getListWorkItemByUser/")
    public WorkItemDetailDTOResponse getListWorkItemByUser(SysUserRequest request) {
        WorkItemDetailDTOResponse response = new WorkItemDetailDTOResponse();
        try {

            authenticateWsBusiness.validateRequest(request);
//			hoanm1_20180602_start
//			request.setSysGroupId(construcitonTaskDao.getSysGroupId(request.getAuthenticationInfo().getUsername()));
//			request.setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupId(request.getAuthenticationInfo().getUsername())));
            request.setSysGroupId(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserId()));
            request.setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserId())));
//			hoanm1_20180602_end
            List<WorkItemDetailDTO> data = workItemBusiness.getListWorkItemByUser(request);
            response.setListWorkItemDetailDTO(data);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setResultInfo(resultInfo);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;

    }


    @POST
    @Path("/updateWorkItem/")
    public WorkItemDetailDTOResponse updateWorkItem(WorkItemDetailDTORequest request) {
        WorkItemDetailDTOResponse response = new WorkItemDetailDTOResponse();
        try {

            authenticateWsBusiness.validateRequest(request.getSysUserRequest());
//			hoanm1_20180602_start
//			request.getSysUserRequest().setSysGroupId(construcitonTaskDao.getSysGroupId(request.getSysUserRequest().getAuthenticationInfo().getUsername()));
//			request.getSysUserRequest().setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupId(request.getSysUserRequest().getAuthenticationInfo().getUsername())));
            request.getSysUserRequest().setSysGroupId(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserRequest().getSysUserId()));
            request.getSysUserRequest().setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserRequest().getSysUserId())));
//			hoanm1_20180602_end
            int value = workItemBusiness.updateWorkItem(request);
            if (value == 1) {

                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_OK);
                response.setResultInfo(resultInfo);
                resultInfo.setMessage("update thành công hạng mục hoàn thành và công trình hoàn thành");
            } else if (value == 2) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_OK);
                response.setResultInfo(resultInfo);
                resultInfo.setMessage("update thành công hạng mục hoàn thành");
            } else {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                response.setResultInfo(resultInfo);
                resultInfo.setMessage("update không thành công");
            }

        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;

    }

    @POST
    @Path("/getImageByWorkItem/")
    public WorkItemDetailDTOResponse getImageByWorkItem(WorkItemDetailDTORequest request) {
        WorkItemDetailDTOResponse response = new WorkItemDetailDTOResponse();
        try {
            authenticateWsBusiness.validateRequest(request.getSysUserRequest());
//			hoanm1_20180803_start
//			request.getSysUserRequest().setSysGroupId(construcitonTaskDao.getSysGroupId(request.getSysUserRequest().getAuthenticationInfo().getUsername()));
//			request.getSysUserRequest().setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupId(request.getSysUserRequest().getAuthenticationInfo().getUsername())));
            request.getSysUserRequest().setSysGroupId(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserRequest().getSysUserId()));
            request.getSysUserRequest().setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserRequest().getSysUserId())));
//			hoanm1_20180803_end
            List<ConstructionImageInfo> value = workItemBusiness.getListImageByWorkItem(request);
            response.setListImage(value);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setResultInfo(resultInfo);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;

    }


}
