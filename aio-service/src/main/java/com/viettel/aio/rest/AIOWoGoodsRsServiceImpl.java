package com.viettel.aio.rest;

import com.viettel.aio.business.AIOWoGoodsBusinessImpl;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOWoGoodsDTO;
import com.viettel.aio.dto.AppParamDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.dto.SysUserDetailCOMSDTO;
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
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author hailh10
 */

public class AIOWoGoodsRsServiceImpl implements AIOWoGoodsRsService {

    protected final Logger log = Logger.getLogger(AIOWoGoodsRsService.class);
    @Autowired
    public AIOWoGoodsRsServiceImpl(AIOWoGoodsBusinessImpl aioWoGoodsBusinessImpl, UserRoleBusinessImpl userRoleBusiness) {
        this.aioWoGoodsBusinessImpl = aioWoGoodsBusinessImpl;
        this.userRoleBusiness = userRoleBusiness;
    }

    private AIOWoGoodsBusinessImpl aioWoGoodsBusinessImpl;
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    @Override
    public Response doSearch(AIOWoGoodsDTO obj) {
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW, Constant.AdResourceKey.WO_GOODS, request);
        DataListDTO data = new DataListDTO();
        if (StringUtils.isNotEmpty(sysGroupIdStr)) {
            data = aioWoGoodsBusinessImpl.doSearch(obj, sysGroupIdStr);
        } else {
            data.setData(new ArrayList());
            data.setSize(0);
            data.setTotal(0);
            data.setStart(1);
        }
        return Response.ok(data).build();
    }

    public Response getWODetailById(AIOWoGoodsDTO id) {
        DataListDTO data = new DataListDTO();
        data = aioWoGoodsBusinessImpl.getWODetailById(id);
        data.setSize(0);
        data.setTotal(0);
        data.setStart(1);
        return Response.ok(data).build();
    }

    public Response submitApprove(AIOWoGoodsDTO dto) {
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.APPROVED, Constant.AdResourceKey.WO_GOODS, request);
        if (StringUtils.isNotEmpty(sysGroupIdStr)) {
            // reassign performer to current user
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            dto.setPerformerId(user.getSysUserId());

            aioWoGoodsBusinessImpl.submitApprove(dto);
            return Response.ok(Response.Status.OK).build();
        } else {
            return this.buildErrorResponse(AIOErrorType.NOT_AUTHORIZE.msg);
        }
    }

    public Response submitReject(AIOWoGoodsDTO dto) {
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.APPROVED, Constant.AdResourceKey.WO_GOODS, request);
        if (StringUtils.isNotEmpty(sysGroupIdStr)) {
            // reassign performer to current user
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            dto.setPerformerId(user.getSysUserId());

            aioWoGoodsBusinessImpl.submitReject(dto);
            return Response.ok(Response.Status.OK).build();
        } else {
            return this.buildErrorResponse(AIOErrorType.NOT_AUTHORIZE.msg);
        }
    }

    @Override
    public Response getConfigService(AIOWoGoodsDTO obj) {
        List<AIOConfigServiceDTO> data = aioWoGoodsBusinessImpl.getConfigService(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response getAppParam() {
        List<AppParamDTO> data = aioWoGoodsBusinessImpl.getAppParam();
        return Response.ok(data).build();
    }

    @Override
    public Response searchPerformer(AIOWoGoodsDTO obj) throws Exception {
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(aioWoGoodsBusinessImpl.searchPerformer(obj));
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setStart(1);
        return Response.ok(dataListDTO).build();
    }

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response exportExcel(AIOWoGoodsDTO dto) {
        try {
            String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW, Constant.AdResourceKey.WO_GOODS, request);
            String filePath = aioWoGoodsBusinessImpl.exportExcel(dto, sysGroupIdStr);
            return Response.ok(Collections.singletonMap("fileName", filePath)).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            return this.buildErrorResponse("Không tìm thấy file biểu mẫu!");
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    public Response getPermissionApprove() {
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.APPROVED, Constant.AdResourceKey.WO_GOODS, request);
        if (StringUtils.isNotEmpty(sysGroupIdStr)) {
            return Response.ok(Response.Status.OK).build();
        } else {
            return this.buildErrorResponse(AIOErrorType.NOT_AUTHORIZE.msg);
        }
    }
}
