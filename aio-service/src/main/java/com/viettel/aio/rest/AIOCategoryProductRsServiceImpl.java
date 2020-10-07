package com.viettel.aio.rest;

import com.viettel.aio.business.AIOCategoryProductBusiness;
import com.viettel.aio.dto.AIOCategoryProductDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.List;

//StephenTrung__20191105_create
public class AIOCategoryProductRsServiceImpl implements AIOCategoryProductRsService {

    protected final Logger log = Logger.getLogger(AIOCategoryProductRsServiceImpl.class);

    @Autowired
    private AIOCategoryProductBusiness aioCategoryProductBusiness;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIOCategoryProductDTO obj) {
        DataListDTO data = aioCategoryProductBusiness.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response getCategoryProductById(Long id) {
        try {
            AIOCategoryProductDTO dto = aioCategoryProductBusiness.getCategoryProductById(id);
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
    public Response saveCategoryProduct(AIOCategoryProductDTO obj) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO sysUserDto = session.getVpsUserInfo();
            int check = aioCategoryProductBusiness.checkDuplicateCategoryProductName(obj.getName());
            if (check > 0) {
                return Response.ok().entity(Collections.singletonMap("error", "Tên danh mục đã tồn tại!")).build();
            }

            Long id = aioCategoryProductBusiness.saveCategoryProduct(obj, sysUserDto);
            if (id > 0L) {
                return Response.ok(Response.Status.CREATED).build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }

        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return this.buildErrorResponse("Trùng mã yêu cầu, hãy thao tác lại!");
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }

    @Override
    public Response updateCategoryProduct(AIOCategoryProductDTO obj) {
        KttsUserSession session = userRoleBusiness.getUserSession(request);
        SysUserCOMSDTO sysUserDto = session.getVpsUserInfo();
        try {
//            int check = aioCategoryProductBusiness.checkDuplicateCategoryProductName(obj.getName());
//            if (check > 0) {
//                return Response.ok().entity(Collections.singletonMap("error", "Tên danh mục đã tồn tại!")).build();
//            }
            aioCategoryProductBusiness.updateCategoryProduct(obj, sysUserDto);
            return Response.ok(Response.Status.CREATED).build();

        } catch (BusinessException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response getAutoCompleteData(AIOCategoryProductDTO dto) {
        List<AIOCategoryProductDTO> data = aioCategoryProductBusiness.getAutoCompleteData(dto);
        return Response.ok(data).build();
    }

    @Override
    public Response removeCategoryProduct(AIOCategoryProductDTO obj) {
        try {
            aioCategoryProductBusiness.removeCategoryProduct(obj);
            return Response.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }


    }
}
