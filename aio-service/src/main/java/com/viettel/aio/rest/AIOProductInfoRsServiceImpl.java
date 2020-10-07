package com.viettel.aio.rest;

import com.viettel.aio.business.AIOProductInfoBusinessImpl;
import com.viettel.aio.dto.AIOProductInfoDTO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import com.viettel.wms.dto.GoodsDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.List;

//VietNT_20190701_create
public class AIOProductInfoRsServiceImpl implements AIOProductInfoRsService {

    protected final Logger log = Logger.getLogger(AIOProductInfoRsServiceImpl.class);

    @Autowired
    private AIOProductInfoBusinessImpl aioProductInfoBusiness;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIOProductInfoDTO obj) {
        DataListDTO data = aioProductInfoBusiness.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response getDropDownData() {
        List<AppParamDTO> data = aioProductInfoBusiness.getDropDownData();
        return Response.ok(data).build();
    }

    @Override
    public Response saveProductInfo(AIOProductInfoDTO dto) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO sysUserDto = session.getVpsUserInfo();
            aioProductInfoBusiness.saveProductInfo(dto, sysUserDto);
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
    public Response getProductInfo(Long id) {
        try {
            AIOProductInfoDTO dto = aioProductInfoBusiness.getProductInfo(id);
            return Response.ok(dto).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response disableProduct(Long id) {
        try {
            aioProductInfoBusiness.disableProduct(id);
            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    //VietNT_25/07/2019_start
    @Override
    public Response editProductInfo(AIOProductInfoDTO dto) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO sysUserDto = session.getVpsUserInfo();
            aioProductInfoBusiness.editProductInfo(dto, sysUserDto);
            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }
    //VietNT_end
}
