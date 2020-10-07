package com.viettel.aio.rest;

import com.viettel.aio.business.AIOErrorCommonBusinessImpl;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOErrorDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;

public class AIOErrorCommonRsServiceImpl implements AIOErrorCommonRsService {

    protected final Logger log = Logger.getLogger(AIOErrorCommonRsServiceImpl.class);

    @Autowired
    public AIOErrorCommonRsServiceImpl(AIOErrorCommonBusinessImpl aioErrorCommonBusinessImpl,
                                       UserRoleBusinessImpl userRoleBusiness) {
        this.aioErrorCommonBusinessImpl = aioErrorCommonBusinessImpl;
        this.userRoleBusiness = userRoleBusiness;
    }

    private AIOErrorCommonBusinessImpl aioErrorCommonBusinessImpl;
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIOErrorDTO obj) {
        DataListDTO data = aioErrorCommonBusinessImpl.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response getErrorCommonById(Long id) {
        try {
            AIOErrorDTO dto = aioErrorCommonBusinessImpl.getErrorCommonById(id);
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
    public Response saveErrorCommon(AIOErrorDTO obj) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO sysUserDto = session.getVpsUserInfo();
            aioErrorCommonBusinessImpl.checkDuplicateContent(obj.getContentError());
            aioErrorCommonBusinessImpl.saveErrorCommon(obj, sysUserDto);
            return Response.ok(Response.Status.CREATED).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response updateCategoryProduct(AIOErrorDTO obj) {
        KttsUserSession session = userRoleBusiness.getUserSession(request);
        SysUserCOMSDTO sysUserDto = session.getVpsUserInfo();
        try {
//            int check = aioCategoryProductBusiness.checkDuplicateCategoryProductName(obj.getName());
//            if (check > 0) {
//                return Response.ok().entity(Collections.singletonMap("error", "Tên danh mục đã tồn tại!")).build();
//            }
            aioErrorCommonBusinessImpl.update(obj, sysUserDto);
            return Response.ok(Response.Status.CREATED).build();

        } catch (BusinessException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

//    @Override
//    public Response getAutoCompleteData(AIOCategoryProductDTO dto) {
//        List<AIOCategoryProductDTO> data = aioErrorCommonBusinessImpl.getAutoCompleteData(dto);
//        return Response.ok(data).build();
//    }

    @Override
    public Response removeErrorCommon(AIOErrorDTO obj) {
        try {
            aioErrorCommonBusinessImpl.remove(obj, request);
            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response approveErrorCommon(AIOErrorDTO obj) {
        try {
            aioErrorCommonBusinessImpl.approve(obj, request);
            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }


    @Override
    public Response getForAutoCompleteConfigService(AIOConfigServiceDTO obj) {
        return Response.ok(aioErrorCommonBusinessImpl.getForAutoCompleteConfigService(obj)).build();
    }

    @Override
    public Response getDropDownData() {
        return Response.ok(aioErrorCommonBusinessImpl.getDropDownData()).build();
    }

    @Override
    public Response hasPermissionManageError() {
        try {
            aioErrorCommonBusinessImpl.hasPermissionManageError(request);
            return Response.ok(HttpStatus.OK).build();
        } catch (BusinessException e) {
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }
}
