package com.viettel.aio.webservice;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.viettel.aio.business.AIOContractServiceMobileBusinessImpl;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOContractMobileResponse;
import com.viettel.asset.dto.ResultInfo;

@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")
public class AIOContractManageWsRsService {

	private Logger LOGGER = Logger.getLogger(AIOContractManageWsRsService.class);
	
	@Autowired
    AIOContractServiceMobileBusinessImpl aioContractBusiness;

	//Lấy danh sách và chi tiết hợp đồng
	@POST
    @Path("/getContractOfPerformer/")
    public AIOContractMobileResponse getContractOfPerformer(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            ResultInfo resultInfo = new ResultInfo();
            List<AIOContractDTO> result = aioContractBusiness.getContractOfPerformer(request.getSysUserRequest().getSysUserId());
            response.setLstAIOContractMobileDTO(result);
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
