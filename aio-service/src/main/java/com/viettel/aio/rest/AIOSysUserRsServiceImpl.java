package com.viettel.aio.rest;

import com.viettel.aio.business.AIOSysUserBusiness;
import com.viettel.aio.dto.AIOSysUserDTO;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
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

public class AIOSysUserRsServiceImpl implements AIOSysUserRsService {

    protected final Logger log = Logger.getLogger(AIOSysUserRsServiceImpl.class);

    @Autowired
    private AIOSysUserBusiness aioSysUserBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIOSysUserDTO obj) {

        String sysGroupIdsStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.APPROVED,
                Constant.AdResourceKey.USER, request);
        if (StringUtils.isEmpty(sysGroupIdsStr)) {
            DataListDTO dataListDTO = new DataListDTO();
            dataListDTO.setData(new ArrayList<AIOSysUserDTO>());
            dataListDTO.setTotal(0);
            dataListDTO.setSize(obj.getPageSize());
            dataListDTO.setStart(1);
            return Response.ok(dataListDTO).build();
        }

        List<Long> sysGroupIds = Stream.of(sysGroupIdsStr.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());
        obj.setSysGroupIds(sysGroupIds);
        DataListDTO data = aioSysUserBusiness.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doApproveAccount(AIOSysUserDTO obj) {
        AIOSysUserDTO chkObj = (AIOSysUserDTO) aioSysUserBusiness.getOneById(obj.getSysUserId());
        if (chkObj == null) {
            return this.buildErrorResponse("Bản ghi không tồn tại");
        }
        if (AIOSysUserDTO.STATUS_APPROVED.equals(chkObj.getStatus())) {
            return this.buildErrorResponse("Bản ghi đã bị thay đổi.");
        }

        aioSysUserBusiness.doApproveAccount(obj);
        return Response.ok(Response.Status.OK).build();
    }

    @Override
    public Response doDeleteAccount(AIOSysUserDTO obj) {
        AIOSysUserDTO chkObj = (AIOSysUserDTO) aioSysUserBusiness.getOneById(obj.getSysUserId());
        if (chkObj == null) {
            return this.buildErrorResponse("Bản ghi không tồn tại");
        }
        if (AIOSysUserDTO.STATUS_INACTIVE.equals(chkObj.getStatus())) {
            return this.buildErrorResponse("Bản ghi đã bị thay đổi.");
        }

        aioSysUserBusiness.doDeleteAccount(obj);
        return Response.ok(Response.Status.OK).build();
    }

    @Override
    public Response doRejectAccount(AIOSysUserDTO obj) {
        AIOSysUserDTO chkObj = (AIOSysUserDTO) aioSysUserBusiness.getOneById(obj.getSysUserId());
        if (chkObj == null) {
            return this.buildErrorResponse("Bản ghi không tồn tại");
        }
        if (AIOSysUserDTO.STATUS_REJECTED.equals(chkObj.getStatus())) {
            return this.buildErrorResponse("Bản ghi đã bị thay đổi.");
        }

        aioSysUserBusiness.doRejectAccount(obj);
        return Response.ok(Response.Status.OK).build();
    }

    @Override
    public Response searchParentUsers(AIOSysUserDTO obj) {
        String sysGroupIdsStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.APPROVED,
                Constant.AdResourceKey.USER, request);
        if (StringUtils.isEmpty(sysGroupIdsStr)) {
            DataListDTO dataListDTO = new DataListDTO();
            dataListDTO.setData(new ArrayList<AIOSysUserDTO>());
            dataListDTO.setTotal(0);
            dataListDTO.setSize(obj.getPageSize());
            dataListDTO.setStart(1);
            return Response.ok(new DataListDTO()).build();
        }

        List<Long> sysGroupIds = Stream.of(sysGroupIdsStr.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());
        obj.setSysGroupIds(sysGroupIds);
        DataListDTO data = aioSysUserBusiness.searchParentUsers(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response addParent(AIOSysUserDTO obj) {
        AIOSysUserDTO chkObj = (AIOSysUserDTO) aioSysUserBusiness.getOneById(obj.getSysUserId());
        if (chkObj == null) {
            return this.buildErrorResponse("Bản ghi không tồn tại");
        }

        chkObj.setParentUserId(obj.getParentUserId());
        aioSysUserBusiness.update(chkObj);
        return Response.ok(Response.Status.OK).build();
    }

    @Override
    public Response doResetPassword(AIOSysUserDTO obj) {
        AIOSysUserDTO chkObj = (AIOSysUserDTO) aioSysUserBusiness.getOneById(obj.getSysUserId());
        if (chkObj == null) {
            return this.buildErrorResponse("Bản ghi không tồn tại");
        }
        if (AIOSysUserDTO.STATUS_INACTIVE.equals(chkObj.getStatus())) {
            return this.buildErrorResponse("Bản ghi đã bị thay đổi.");
        }

        aioSysUserBusiness.doResetPassword(obj);
        return Response.ok(Response.Status.OK).build();
    }

}
