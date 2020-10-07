package com.viettel.aio.webservice;

import com.viettel.aio.business.AIOErrorBussinessImpl;
import com.viettel.aio.dto.AIOBaseRequest;
import com.viettel.aio.dto.AIOBaseResponse;
import com.viettel.aio.dto.AIOCommonMistakeRequest;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOErrorDTO;
import com.viettel.aio.dto.AIORequestGetErrorDetailDTO;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.ktts2.common.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.List;

@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")
public class AIOCommonMistakeRsService {

    @Autowired
    public AIOCommonMistakeRsService( AIOErrorBussinessImpl aioErrorBussiness ) {
        this.aioErrorBussiness =aioErrorBussiness ;
    }
    private  AIOErrorBussinessImpl aioErrorBussiness;

    @Context
    HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @POST
    @Path("/getListAIOConfigService/")
    public AIOBaseResponse getListAIOConfigService(AIOBaseRequest<AIOConfigServiceDTO> request) {
        AIOBaseResponse<List<AIOConfigServiceDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<AIOConfigServiceDTO> result = aioErrorBussiness.lstAIOConfigService();
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

    @POST
    @Path("/getListErrorByIdConfigService/")
    public AIOBaseResponse getListErrorByIdConfigService(AIOBaseRequest<AIOCommonMistakeRequest> request) {
        AIOBaseResponse<List<AIOErrorDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            if(request.getData().getContentError()==null)
            {
                request.getData().setContentError("");
            }
            List<AIOErrorDTO> result = aioErrorBussiness.getListByIdConfigService(request.getData());
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

    @POST
    @Path("/getItemError/")
    public AIOBaseResponse getItemError(AIOBaseRequest<AIOCommonMistakeRequest> request) {
        AIOBaseResponse<List<AIORequestGetErrorDetailDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<AIORequestGetErrorDetailDTO> result = aioErrorBussiness.getItemAIOError(request.getData().getIdError());
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

    @POST
    @Path("/updateStatusAioError/")
    public AIOBaseResponse updateStatusAioError(AIOBaseRequest<AIOCommonMistakeRequest> res) {
        AIOBaseResponse response = new AIOBaseResponse();
        try {
            response = aioErrorBussiness.updateStatusAioError(res.getData().getAioErrorDTO(),res.getSysUserRequest().getSysUserId());
            return response;
        } catch (Exception e) {
            response.getResultInfo().setStatus(ResultInfo.RESULT_NOK);
            response.getResultInfo().setMessage("Có lỗi xảy ra");
            return response;
        }
    }

    @POST
    @Path("/createAioError/")
    public AIOBaseResponse createAioError(AIOBaseRequest<AIOCommonMistakeRequest> request) {
        AIOBaseResponse response = new AIOBaseResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioErrorBussiness.saveAioError(request.getData().getAioErrorDTO()
                    ,request.getData().getAioErrorDetailDTOList(),request.getData().getSysUserRequest().getSysUserId()
                    ,request.getData().getSysUserRequest().getName());
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
