package com.viettel.aio.rest;

import com.viettel.aio.business.AIORequestBHSCBusinessImpl;
import com.viettel.aio.business.CommonServiceAio;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dto.AIOLocationUserDTO;
import com.viettel.aio.dto.AIORequestBHSCDTO;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class AIORequestWarrantyServiceImpl implements AIORequestWarrantyService {

    protected final Logger log = Logger.getLogger(AIORequestWarrantyServiceImpl.class);

    @Autowired
    public AIORequestWarrantyServiceImpl(AIORequestBHSCBusinessImpl aioRequestWarrantyBusiness, UserRoleBusinessImpl userRoleBusiness) {
        this.aioRequestWarrantyBusiness = aioRequestWarrantyBusiness;
        this.userRoleBusiness = userRoleBusiness;
    }

    private AIORequestBHSCBusinessImpl aioRequestWarrantyBusiness;
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    private void checkPermission(String operationId, String adResourceKey) {
        if (!VpsPermissionChecker.hasPermission(operationId, adResourceKey, request)) {
            throw new BusinessException(AIOErrorType.NOT_AUTHORIZE.msg + AIOObjectType.DEPLOY.getName());
        }
    }

    @Override
    public Response doSearch(AIORequestBHSCDTO obj) {
        String sysGroupIdsStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.REQUEST_BHSC, request);
        if (StringUtils.isEmpty(sysGroupIdsStr)) {
            DataListDTO dataListDTO = new DataListDTO();
            dataListDTO.setData(new ArrayList<>());
            dataListDTO.setTotal(0);
            dataListDTO.setSize(obj.getPageSize());
            dataListDTO.setStart(1);
            return Response.ok(new DataListDTO()).build();
        }

        List<Long> sysGroupIds = Stream.of(sysGroupIdsStr.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());
        obj.setPerformerGroupIds(sysGroupIds);
        DataListDTO data = aioRequestWarrantyBusiness.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response approve(AIORequestBHSCDTO obj) {
        try {
            checkPermission(Constant.OperationKey.APPROVED, Constant.AdResourceKey.REQUEST_BHSC);
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            obj.setUpdatedUser(sysUserId);
            aioRequestWarrantyBusiness.approve(obj);
            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }

    }

    @Override
    public Response deny(AIORequestBHSCDTO obj) {
        try {
            checkPermission(Constant.OperationKey.APPROVED, Constant.AdResourceKey.REQUEST_BHSC);
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            obj.setUpdatedUser(sysUserId);
            aioRequestWarrantyBusiness.deny(obj);
            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }

    }

    @Override
    public Response choosePerformer(AIORequestBHSCDTO obj) {

        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysGroupId();
            aioRequestWarrantyBusiness.choosePerformer(obj.getPerformerId(), obj.getRequestBhscIds(), sysUserId);
            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response getListPerformer(AIOLocationUserDTO criteria) {
        KttsUserSession session = userRoleBusiness.getUserSession(request);
        Long sysUserId = session.getVpsUserInfo().getSysUserId();
        DataListDTO data = aioRequestWarrantyBusiness.getListPerformer(criteria, sysUserId);
        return Response.ok(data).build();
    }

    @Override
    public Response getDetail(Long requestId) {
        AIORequestBHSCDTO dto = new AIORequestBHSCDTO();
        dto.setGoods(aioRequestWarrantyBusiness.getDetailByRequestId(requestId));
        dto.setImages(aioRequestWarrantyBusiness.getListImages(requestId));
        return Response.ok(dto).build();
    }
}
