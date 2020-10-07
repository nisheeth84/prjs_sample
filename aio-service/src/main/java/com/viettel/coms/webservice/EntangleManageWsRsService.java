package com.viettel.coms.webservice;

import com.viettel.asset.business.AuthenticateWsBusiness;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.business.EntangleManageBusiness;
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

/**
 * @author CuongNV2
 * @version 1.0
 * @since 2018-06-8
 */
@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")
public class EntangleManageWsRsService {
    private Logger LOGGER = Logger.getLogger(EntangleManageWsRsService.class);
    @Autowired
    EntangleManageBusiness entangleManageBusiness;
    @Autowired
    AuthenticateWsBusiness authenticateWsBusiness;
    @Autowired
    ConstructionTaskDAO construcitonTaskDao;

    /**
     * EntangleManagePages
     *
     * @param request
     * @return EntangleManageDTOResponse
     */
    @POST
    @Path("/getValueToInitEntangleManage/")
    public EntangleManageDTOResponse getValueToInitEntangleManage(EntangleManageDTORequest request) {
        EntangleManageDTOResponse response = new EntangleManageDTOResponse();
        try {
            List<EntangleManageDTO> data = entangleManageBusiness.getEntangleManage(request, response);
            response.setListEntangleManageDTO(data);
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

    /**
     * Update EntangleManagePages
     *
     * @param request
     * @return EntangleManageDTOResponse
     */
    @POST
    @Path("/getUpdateEntangleManage/")
    public EntangleManageDTOResponse getUpdateEntangleManage(EntangleManageDTORequest request) throws Exception {
        EntangleManageDTOResponse response = new EntangleManageDTOResponse();
        EntangleManageDTO dto = new EntangleManageDTO();

        // set list Image to response
        dto.setListImage(request.getEntangleManageDTODetail().getListImage());
        try {
            int result = entangleManageBusiness.UpdateEntangleManage(request);
            if (result == 1) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_OK);
                response.setResultInfo(resultInfo);
            } else {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                response.setResultInfo(resultInfo);
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

    /**
     * add entagle
     *
     * @param request
     * @return
     * @throws Exception
     */
    @POST
    @Path("/addEntangle/")
    public EntangleManageDTOResponse addEntangle(EntangleManageDTORequest request) throws Exception {
        EntangleManageDTOResponse response = new EntangleManageDTOResponse();
        try {
            int result = entangleManageBusiness.addEntangle(request);
            if (result != 0) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_OK);
                response.setResultInfo(resultInfo);
            } else {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                response.setResultInfo(resultInfo);
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

    /**
     * auto complete
     *
     * @param request
     * @return
     */
    @POST
    @Path("/getConstructionCode/")
    public ConstructionStationWorkItemDTOResponse getConstructionTask(SysUserRequest request) {
        ConstructionStationWorkItemDTOResponse response = new ConstructionStationWorkItemDTOResponse();
        try {
//			hoanm1_20180803_start
//			request.setSysGroupId(construcitonTaskDao.getSysGroupId(request.getAuthenticationInfo().getUsername()));
//			request.setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupId(request.getAuthenticationInfo().getUsername())));
            request.setSysGroupId(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserId()));
            request.setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserId())));
//			hoanm1_20180803_end
            authenticateWsBusiness.validateRequest(request);
            List<ConstructionStationWorkItemDTO> data = entangleManageBusiness.getNameAndAddressContruction(request);
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

    /**
     * get list image
     *
     * @param request
     * @return
     */
    @POST
    @Path("/getListImageEntagle/")
    public EntangleManageDTOResponse getListImageEntagle(EntangleManageDTORequest request) {
        EntangleManageDTOResponse response = new EntangleManageDTOResponse();
        try {
            List<ConstructionImageInfo> dataImg = entangleManageBusiness.getListImageEntagle(request.getEntangleManageDTODetail().getObstructedId());
            if (dataImg != null) {
                response.setListImg(dataImg);
            }
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
