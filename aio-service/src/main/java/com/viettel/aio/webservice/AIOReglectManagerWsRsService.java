package com.viettel.aio.webservice;

import com.viettel.aio.business.AIOReglectManagerBusinessImpl;
import com.viettel.aio.dto.*;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.ktts2.common.BusinessException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
public class AIOReglectManagerWsRsService {

	private Logger LOGGER = Logger.getLogger(AIOReglectManagerWsRsService.class);

    @Autowired
    public AIOReglectManagerWsRsService(AIOReglectManagerBusinessImpl aioReglectManagerBusiness) {
        this.aioReglectManagerBusiness = aioReglectManagerBusiness;
    }

    private AIOReglectManagerBusinessImpl aioReglectManagerBusiness;

	@POST
    @Path("/getListReglect")
    public AIOContractMobileResponse getListReglect(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            AIOReglectDTO result = aioReglectManagerBusiness.getListReglect(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setReglectDTO(result);
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
	
	@GET
    @Path("/getListReason")
    public AIOContractMobileResponse getListReason() {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            AIOReglectDTO result = aioReglectManagerBusiness.getListReason();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setReglectDTO(result);
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
    @Path("/putReglectOnHold")
    public AIOContractMobileResponse putReglectOnHold(AIOContractMobileRequest rq) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            AIOReglectDTO result = aioReglectManagerBusiness.putReglectOnHold(rq);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setReglectDTO(result);
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
    @Path("/startReglect/")
    public AIOContractMobileResponse startReglect(AIOContractMobileRequest request) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            AIOReglectDTO result = aioReglectManagerBusiness.startReglect(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setReglectDTO(result);
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
    @Path("/endReglect/")
    public AIOContractMobileResponse endReglect(AIOContractMobileRequest request) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            AIOReglectDTO result = aioReglectManagerBusiness.endReglect(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setReglectDTO(result);
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
