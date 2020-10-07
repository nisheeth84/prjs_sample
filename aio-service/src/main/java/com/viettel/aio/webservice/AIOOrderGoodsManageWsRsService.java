package com.viettel.aio.webservice;

import com.viettel.aio.business.AIOOrderGoodsManageBusinessImpl;
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
public class AIOOrderGoodsManageWsRsService {

	private Logger LOGGER = Logger.getLogger(AIOOrderGoodsManageWsRsService.class);

    @Autowired
    public AIOOrderGoodsManageWsRsService(AIOOrderGoodsManageBusinessImpl aioOrderGoodsManageBusiness) {
        this.aioOrderGoodsManageBusiness = aioOrderGoodsManageBusiness;
    }

    private AIOOrderGoodsManageBusinessImpl aioOrderGoodsManageBusiness;

	@POST
    @Path("/getListOrderGoods")
    public AIOContractMobileResponse getListOrderGoods(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<AIOOrderRequestDTO> result = aioOrderGoodsManageBusiness.getListOrderGoods(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setOrderRequests(result);
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
    @Path("/getOrderDetail")
    public AIOContractMobileResponse getOrderDetail(AIOContractMobileRequest request) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<AIOOrderRequestDetailDTO> result = aioOrderGoodsManageBusiness.getOrderDetail(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setOrderRequestsDetails(result);
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
    @Path("/getDataAddOrder")
    public AIOContractMobileResponse getDataAddOrder(AIOContractMobileRequest rq) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            AIOOrderRequestDTO result = aioOrderGoodsManageBusiness.getDataAddOrder(rq);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setOrderRequestData(result);
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
    @Path("/saveOrderRequest/")
    public AIOContractMobileResponse saveOrderRequest(AIOContractMobileRequest request) {
        AIOContractMobileResponse response = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioOrderGoodsManageBusiness.saveOrderRequest(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (BusinessException e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Trùng mã yêu cầu, hãy thao tác lại!");
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        response.setResultInfo(resultInfo);
        return response;
    }
}
