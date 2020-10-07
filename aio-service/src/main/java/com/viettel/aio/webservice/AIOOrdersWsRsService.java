package com.viettel.aio.webservice;

import com.viettel.aio.bo.AIOOrdersBO;
import com.viettel.aio.business.AIOOrderGoodsManageBusinessImpl;
import com.viettel.aio.business.AIOOrdersBusinessImpl;
import com.viettel.aio.dto.*;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
public class AIOOrdersWsRsService {

	private Logger LOGGER = Logger.getLogger(AIOOrdersWsRsService.class);

    @Autowired
    public AIOOrdersWsRsService(AIOOrdersBusinessImpl aioOrdersBusiness) {
        this.aioOrdersBusiness = aioOrdersBusiness;
    }

    private AIOOrdersBusinessImpl aioOrdersBusiness;

    @Context
    HttpServletRequest request;

	@POST
    @Path("/getListOrder")
    public AIOBaseResponse<List<AIOOrdersDTO>> getListOrder(AIOBaseRequest<AIOOrdersDTO> rq) {
        AIOBaseResponse<List<AIOOrdersDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<AIOOrdersDTO> result = aioOrdersBusiness.getListOrders(rq.getSysUserRequest());
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            res.setData(result);
        } catch (BusinessException e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        res.setResultInfo(resultInfo);
        return res;
    }


    @GET
    @Path("/getMetaData")
    public AIOBaseResponse<List<AppParamDTO>> getMetaData() {
        AIOBaseResponse<List<AppParamDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<AppParamDTO> result = aioOrdersBusiness.getMetaData();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            res.setData(result);
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        res.setResultInfo(resultInfo);
        return res;
    }


    @POST
    @Path("/action")
    public AIOBaseResponse action(AIOBaseRequest<AIOOrdersDTO> rq) {
        AIOBaseResponse res = new AIOBaseResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioOrdersBusiness.action(rq);
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
        res.setResultInfo(resultInfo);
        return res;
    }

    @POST
    @Path("/addNewOrder")
    public AIOBaseResponse addNewOrder(AIOBaseRequest<AIOOrdersDTO> rq) {
        AIOBaseResponse res = new AIOBaseResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioOrdersBusiness.addNewOrder(rq);
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
        res.setResultInfo(resultInfo);
        return res;
    }

    @POST
    @Path("/updateOrder")
    public AIOBaseResponse updateOrder(AIOBaseRequest<AIOOrdersDTO> rq) {
        AIOBaseResponse res = new AIOBaseResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioOrdersBusiness.updateOrder(rq);
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
        res.setResultInfo(resultInfo);
        return res;
    }
}
