package com.viettel.aio.rest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOBaseRequest;
import com.viettel.aio.dto.AIOBaseResponse;
import com.viettel.aio.dto.AIOProvinceDTO;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.ktts2.common.BusinessException;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.viettel.aio.business.AIOOrdersBusinessImpl;
import com.viettel.aio.business.SendSmsEmailBusinessImpl;
import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.aio.dto.SendSmsEmailDTO;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.springframework.dao.DataIntegrityViolationException;

public class AIOOrdersRsServiceImpl implements AIOOrdersRsService {

    protected final Logger LOGGER = Logger.getLogger(AIOOrdersRsServiceImpl.class);

    @Autowired
    private AIOOrdersBusinessImpl aioOrdersBusinessImpl;

    @Autowired
    private UserRoleBusinessImpl userRoleBusinessImpl;

    @Autowired
    private SendSmsEmailBusinessImpl sendSmsEmailBusinessImpl;

    @Context
    private HttpServletRequest request;

    @Override
    public Response doSearch(AIOOrdersDTO obj) {
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.APPROVED, Constant.AdResourceKey.CALLCENTER, request);
        DataListDTO data = new DataListDTO();
        if (StringUtils.isNotEmpty(sysGroupIdStr)) {
            data = aioOrdersBusinessImpl.doSearch(obj, sysGroupIdStr);
        } else {
            data.setData(new ArrayList());
            data.setSize(0);
            data.setTotal(0);
            data.setStart(1);
        }
        return Response.ok(data).build();
    }

    @Override
    public Response checkHasPermission() {
        boolean check = VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATED, Constant.AdResourceKey.CALLCENTER, request);
        return Response.ok(check).build();
    }

    @Override
    public Response add(AIOOrdersDTO obj) {
        Long id = 0L;
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        obj.setCreatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
        obj.setCreatedUser(objUser.getSysUserId());
        obj.setCreatedDate(new Date());
        id = aioOrdersBusinessImpl.add(obj);
        if (id != 0L) {
            List<AIOOrdersDTO> lstData = aioOrdersBusinessImpl.getDomainData(obj.getCatProviceId(), null);

            for (AIOOrdersDTO data : lstData) {
                List<AIOOrdersDTO> lstCheck = aioOrdersBusinessImpl.getDomainData(null, data.getSysUserId());
                if (lstCheck != null && lstCheck.size() == 1) {
                    data.setAioOrdersId(id);
                    SendSmsEmailDTO sms = sendSmsEmail(data, obj);
                    sendSmsEmailBusinessImpl.save(sms);
                }
            }
        }

        if (id == 0L) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.status(Response.Status.OK).build();
        }
    }

    public SendSmsEmailDTO sendSmsEmail(AIOOrdersDTO obj, AIOOrdersDTO req) {
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        SendSmsEmailDTO dto = new SendSmsEmailDTO();
        dto.setSubject("Thông báo công việc AIO");
        dto.setContent("Bạn nhận được yêu cầu từ bộ phận chăm sóc khách hàng.Tiếp xúc khách hàng :" + req.getCustomerName() + " với SĐT: " + req.getCustomerPhone());
        dto.setType("1");
        dto.setStatus("0");
        dto.setReceivePhoneNumber(obj.getCustomerPhone());
        dto.setReceiveEmail(obj.getEmail());
        dto.setCreatedDate(new Date());
        dto.setCreatedUserId(objUser.getSysUserId());
        dto.setCreatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
        return dto;
    }

    @Override
    public Response autoSearchCatProvice(String keySearch) {
        List<AIOOrdersDTO> lst = aioOrdersBusinessImpl.autoSearchCatProvice(keySearch);
        if (lst == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(lst).build();
        }
    }

    @Override
    public Response popupSearchCatProvice(AIOOrdersDTO obj) {
        DataListDTO data = new DataListDTO();
        data = aioOrdersBusinessImpl.popupSearchCatProvice(obj);
        if (data == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(data).build();
        }
    }

    @Override
    public Response autoSearchService() {
        List<AIOOrdersDTO> lst = aioOrdersBusinessImpl.autoSearchService();
        if (lst == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(lst).build();
        }
    }

    @Override
    public Response autoSearchChanel() {
        List<AIOOrdersDTO> lst = aioOrdersBusinessImpl.autoSearchChanel();
        if (lst == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(lst).build();
        }
    }

    @Override
    public Response viewDetail(AIOOrdersDTO obj) {
        AIOOrdersDTO dto = aioOrdersBusinessImpl.viewDetail(obj);
        if (dto == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(dto).build();
        }
    }

    @Override
    public Response confirmStatus(AIOOrdersDTO obj) {
        Long id = 0L;
        id = aioOrdersBusinessImpl.confirmStatus(obj);
        if (id == 0L) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.OK).build();
        }
    }

    @Override
    public Response confirmList(AIOOrdersDTO obj) {
        Long id = 0L;
        id = aioOrdersBusinessImpl.confirmList(obj);
        if (id == 0L) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.OK).build();
        }
    }

    // ycks web
    @POST
    @Path("/getListOrder")
    public AIOBaseResponse<List<AIOOrdersDTO>> getListOrder(AIOBaseRequest<AIOOrdersDTO> rq) {
        AIOBaseResponse<List<AIOOrdersDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<AIOOrdersDTO> result = aioOrdersBusinessImpl.getListOrders(rq.getSysUserRequest());
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
            List<AppParamDTO> result = aioOrdersBusinessImpl.getMetaData();
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
    @Path("/getAreaPathByAreaId")
    public AIOBaseResponse<AIOAreaDTO> getAreaPathByAreaId(Long idArea) {
        AIOBaseResponse<AIOAreaDTO> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            AIOAreaDTO result = aioOrdersBusinessImpl.getAreaPathByAreaId(idArea);
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
            aioOrdersBusinessImpl.action(rq);
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
            aioOrdersBusinessImpl.addNewOrder(rq);
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
            aioOrdersBusinessImpl.updateOrder(rq);
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

    @Override
    public AIOBaseResponse<AIOOrdersDTO> getDetailAioOrder(AIOOrdersDTO rq) {
        AIOBaseResponse<AIOOrdersDTO> res = new AIOBaseResponse<>();
//        AIOOrdersDTO dto = rq.toDTO();
        ResultInfo resultInfo = new ResultInfo();
        try {
            AIOOrdersDTO result = aioOrdersBusinessImpl.viewDetailAioOrders(rq, request);
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

    @Override
    public Response doSearchAioOrder(AIOOrdersDTO obj) {
        DataListDTO data = aioOrdersBusinessImpl.doSearchOrders(obj);
        return Response.ok(data).build();
    }

    @Override
    public AIOBaseResponse<List<AIOProvinceDTO>> getListProvince() {
        AIOBaseResponse<List<AIOProvinceDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<AIOProvinceDTO> result = aioOrdersBusinessImpl.getListProvince();
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

    @Override
    public AIOBaseResponse<List<AIOAreaDTO>> getDataDistrict(AIOOrdersDTO rq) {
        AIOBaseResponse<List<AIOAreaDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<AIOAreaDTO> result = aioOrdersBusinessImpl.getDataDistrict(rq.getCatProviceId());
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

    @Override
    public AIOBaseResponse<List<AIOAreaDTO>> getDataWard(AIOOrdersDTO rq) {
        AIOBaseResponse<List<AIOAreaDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<AIOAreaDTO> result = aioOrdersBusinessImpl.getDataWard(rq.getAreaProvinceId());
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

    @Override
    public AIOBaseResponse updateAioOrder(AIOOrdersDTO rq) {
        AIOBaseResponse res = new AIOBaseResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioOrdersBusinessImpl.updateAioOrders(rq, request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        res.setResultInfo(resultInfo);
        return res;
    }

    @Override
    public AIOBaseResponse createNewOrder(AIOBaseRequest<AIOOrdersDTO> rq) {
        AIOBaseResponse res = new AIOBaseResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioOrdersBusinessImpl.createNewOrder(rq ,request);
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

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }
}
