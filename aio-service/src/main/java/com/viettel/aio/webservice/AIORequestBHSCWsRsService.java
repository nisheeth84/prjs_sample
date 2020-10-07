package com.viettel.aio.webservice;

import com.viettel.aio.business.AIOReglectManagerBusinessImpl;
import com.viettel.aio.business.AIORequestBHSCBusinessImpl;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOContractMobileResponse;
import com.viettel.aio.dto.AIOReglectDTO;
import com.viettel.aio.dto.AIORequestBHSCDTO;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.ktts2.common.BusinessException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
public class AIORequestBHSCWsRsService {

	private Logger LOGGER = Logger.getLogger(AIORequestBHSCWsRsService.class);

    @Autowired
    public AIORequestBHSCWsRsService(AIORequestBHSCBusinessImpl aioRequestBHSCBusiness) {
        this.aioRequestBHSCBusiness = aioRequestBHSCBusiness;
    }

    private AIORequestBHSCBusinessImpl aioRequestBHSCBusiness;

	@POST
    @Path("/createRequest")
    public AIOContractMobileResponse createRequest(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioRequestBHSCBusiness.createRequest(request);
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
    @Path("/getListRequestBHSC")
    public AIOContractMobileResponse getListRequestBHSC(AIOContractMobileRequest request) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            AIORequestBHSCDTO data = aioRequestBHSCBusiness.getListRequestBHSC(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setRequestBHSCDTO(data);
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
    @Path("/getDetailRequestBHSC")
    public AIOContractMobileResponse getDetailRequestBHSC(AIOContractMobileRequest request) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            AIORequestBHSCDTO data = aioRequestBHSCBusiness.getDetailRequestBHSC(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setRequestBHSCDTO(data);
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
    @Path("/save")
    public AIOContractMobileResponse save(AIOContractMobileRequest request) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioRequestBHSCBusiness.save(request);
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
    @Path("/close")
    public AIOContractMobileResponse close(AIOContractMobileRequest request) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioRequestBHSCBusiness.close(request);
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
    @Path("/finish")
    public AIOContractMobileResponse finish(AIOContractMobileRequest request) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioRequestBHSCBusiness.finish(request);
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
