package com.viettel.aio.rest;

import com.viettel.aio.business.AIORequestBHSCBusinessImpl;
import com.viettel.aio.business.AIOTvbhBusinessImpl;
import com.viettel.aio.business.CommonServiceAio;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dto.AIOCategoryProductDTO;
import com.viettel.aio.dto.AIOCategoryProductPriceDTO;
import com.viettel.aio.dto.AIOLocationUserDTO;
import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.aio.dto.AIOProductInfoDTO;
import com.viettel.aio.dto.AIORequestBHSCDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
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

public class AIOTvbhRsServiceImpl implements AIOTvbhRsService {

    protected final Logger log = Logger.getLogger(AIOTvbhRsServiceImpl.class);

    @Autowired
    public AIOTvbhRsServiceImpl(AIOTvbhBusinessImpl aioAIOTvbhBusinessImpl, UserRoleBusinessImpl userRoleBusiness) {
        this.aioAIOTvbhBusinessImpl = aioAIOTvbhBusinessImpl;
        this.userRoleBusiness = userRoleBusiness;
    }

    private AIOTvbhBusinessImpl aioAIOTvbhBusinessImpl;
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
    public Response getCategory() {
        List<UtilAttachDocumentDTO> data = aioAIOTvbhBusinessImpl.getCategory();
        return Response.ok(data).build();
    }

    @Override
    public Response getProductByCategory(AIOProductInfoDTO aioProductInfoDTO) {
        List<AIOProductInfoDTO> data = aioAIOTvbhBusinessImpl.getProductByCategory(aioProductInfoDTO);
        return Response.ok(data).build();
    }

    @Override
    public Response getDaiGia(AIOCategoryProductDTO aioProductInfoDTO) {
        List<AIOCategoryProductPriceDTO> data = aioAIOTvbhBusinessImpl.getDaiGia(aioProductInfoDTO);
        return Response.ok(data).build();
    }

    @Override
    public Response getProductById(AIOProductInfoDTO aioProductInfoDTO) {
        List<UtilAttachDocumentDTO> data = aioAIOTvbhBusinessImpl.getProductById(aioProductInfoDTO);
        return Response.ok(data).build();
    }

    @Override
    public Response getListImage(List<Long> listId) {
        List<UtilAttachDocumentDTO> data = aioAIOTvbhBusinessImpl.getListImage(listId);
        return Response.ok(data).build();
    }

    @Override
    public Response getHightLightProduct(AIOProductInfoDTO aioProductInfoDTO) {
        List<AIOProductInfoDTO> data = aioAIOTvbhBusinessImpl.getHightLightProduct(aioProductInfoDTO);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchProductInfo(AIOProductInfoDTO aioProductInfoDTO) {
        List<AIOProductInfoDTO> ls = aioAIOTvbhBusinessImpl.doSearchProductInfo(aioProductInfoDTO);
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(aioProductInfoDTO.getTotalRecord());
            data.setSize(ls.size());
            data.setStart(1);
            return Response.ok(data).build();
        }
    }

    @Override
    public Response autoSearchProduct(String keySearch) {
        List<AIOProductInfoDTO> lst = aioAIOTvbhBusinessImpl.autoSearchProduct(keySearch);
        if (lst == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(lst).build();
        }
    }

}
