package com.viettel.aio.webservice;

import com.viettel.aio.business.AIOLookupCustomerBusinessImpl;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOContractMobileResponse;
import com.viettel.asset.dto.ResultInfo;
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
@Path("/service/")
public class AIOLookupServiceWsRsService {

    private Logger LOGGER = Logger.getLogger(AIOLookupServiceWsRsService.class);

    @Autowired
    public AIOLookupServiceWsRsService(AIOLookupCustomerBusinessImpl aioLookupCustomerBusiness) {
        this.aioLookupCustomerBusiness = aioLookupCustomerBusiness;
    }

    private AIOLookupCustomerBusinessImpl aioLookupCustomerBusiness;

    @POST
    @Path("/getListContractLookupServiceTask")
    public AIOContractMobileResponse getListContractServiceTask(AIOContractMobileRequest request) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            List<AIOContractDTO> data = aioLookupCustomerBusiness.getListContractLookupServiceTask(request);
            response.setLstAIOContractMobileDTO(data);
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
    @Path("/getViewLookDetail")
    public AIOContractMobileResponse getViewLookDetail(AIOContractMobileRequest request) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            List<AIOContractDTO> data =  aioLookupCustomerBusiness.getViewLookDetail(request);
            response.setLstAIOContractMobileDTO(data);
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
