package com.viettel.aio.webservice;

import com.viettel.aio.business.AIORevenueAndContractRemainBusinessImpl;
import com.viettel.aio.dto.AIOBaseRequest;
import com.viettel.aio.dto.AIOBaseResponse;
import com.viettel.aio.dto.AIORevenueAndRemainDTO;
import com.viettel.aio.dto.AIOSysGroupDTO;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.ktts2.common.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
public class AIORevenueAndContractRemainWsRsService {

    @Autowired
    public AIORevenueAndContractRemainWsRsService(AIORevenueAndContractRemainBusinessImpl aioRevenueAndContractRemainBusiness) {
        this.aioRevenueAndContractRemainBusiness = aioRevenueAndContractRemainBusiness;
    }

    private AIORevenueAndContractRemainBusinessImpl aioRevenueAndContractRemainBusiness;

    @POST
    @Path("/checkPermission/")
    public AIOBaseResponse<List<String>> checkPermission(AIOBaseRequest rq) {
        AIOBaseResponse<List<String>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<String> domains = aioRevenueAndContractRemainBusiness.checkPermission(rq.getSysUserRequest());
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            res.setData(domains);
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
    @Path("/getContractDashboardInfo/")
    public AIOBaseResponse<AIORevenueAndRemainDTO> getContractDashboardInfo(AIOBaseRequest<AIORevenueAndRemainDTO> rq) {
        AIOBaseResponse<AIORevenueAndRemainDTO> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            AIORevenueAndRemainDTO result = aioRevenueAndContractRemainBusiness.getContractDashboardInfo(rq);
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
    @Path("/getDetailContract/")
    public AIOBaseResponse<AIORevenueAndRemainDTO> getDetailContract(AIOBaseRequest<AIORevenueAndRemainDTO> rq) {
        AIOBaseResponse<AIORevenueAndRemainDTO> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            AIORevenueAndRemainDTO result = null;
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
    @Path("/getRevenueDashboardInfo/")
    public AIOBaseResponse<AIORevenueAndRemainDTO> getRevenueDashboardInfo(AIOBaseRequest<AIORevenueAndRemainDTO> rq) {
        AIOBaseResponse<AIORevenueAndRemainDTO> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            AIORevenueAndRemainDTO result = aioRevenueAndContractRemainBusiness.getRevenueDashboardInfo(rq);
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
    @Path("/getListGroup/")
    public AIOBaseResponse<List<AIOSysGroupDTO>> getListGroup(AIOBaseRequest rq) {
        AIOBaseResponse<List<AIOSysGroupDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<AIOSysGroupDTO> result = aioRevenueAndContractRemainBusiness.getListGroup(rq.getSysUserRequest().getDepartmentId());
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
}
