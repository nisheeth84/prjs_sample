package com.viettel.aio.webservice;

import com.viettel.aio.business.AIOCollaboratorBusinessImpl;
import com.viettel.aio.dto.AIOBaseRequest;
import com.viettel.aio.dto.AIOBaseResponse;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOContractMobileResponse;
import com.viettel.aio.dto.AIOSysGroupDTO;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.ktts2.common.BusinessException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
public class AIOCollaboratorWsRsService {

	private Logger LOGGER = Logger.getLogger(AIOCollaboratorWsRsService.class);

    @Autowired
    public AIOCollaboratorWsRsService(AIOCollaboratorBusinessImpl aioCollaboratorBusiness) {
        this.aioCollaboratorBusiness = aioCollaboratorBusiness;
    }

    private AIOCollaboratorBusinessImpl aioCollaboratorBusiness;

	@POST
    @Path("/registerCTV")
    public AIOContractMobileResponse registerCTV(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioCollaboratorBusiness.registerCTV(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (BusinessException e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        response.setResultInfo(resultInfo);
        return response;
    }
	
	@POST
    @Path("/getSysGroupTree")
    public AIOContractMobileResponse getSysGroupTree(AIOContractMobileRequest request) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<AIOSysGroupDTO> result = aioCollaboratorBusiness.getSysGroupTree(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setSysGroupDTOS(result);
        } catch (BusinessException e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        response.setResultInfo(resultInfo);
        return response;
    }

    @POST
    @Path("/changePassword")
    public AIOContractMobileResponse changePassword(AIOContractMobileRequest request) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioCollaboratorBusiness.changePassword(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (BusinessException e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        response.setResultInfo(resultInfo);
        return response;
    }

    @POST
    @Path("/test")
    public AIOBaseResponse<String> test(AIOBaseRequest<AIOContractMobileRequest> rq) {
        AIOBaseResponse<String> response = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            response.setData(aioCollaboratorBusiness.test(rq));
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (BusinessException e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        response.setResultInfo(resultInfo);
        return response;
    }
}
