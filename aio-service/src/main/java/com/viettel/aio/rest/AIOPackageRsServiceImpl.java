package com.viettel.aio.rest;

import com.viettel.aio.business.AIOPackageBusinessImpl;
import com.viettel.aio.dto.*;
import com.viettel.coms.dto.ExcelErrorDTO;
import com.viettel.coms.dto.GoodsDTO;
import com.viettel.coms.dto.RequestGoodsDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.rest.RpHSHCRsServiceImpl;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;

//VietNT_20190308_create
public class AIOPackageRsServiceImpl implements AIOPackageRsService {

    protected final Logger log = Logger.getLogger(RpHSHCRsServiceImpl.class);

    @Autowired
    private AIOPackageBusinessImpl aioPackageBusiness;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private final String ERROR_MESSAGE = "Đã có lỗi xảy ra trong quá trình xử lý dữ liệu";

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

//    public Response doSearchDebt(SynStockDailyRemainDTO obj) {
//        DataListDTO data = synStockDailyImportExportBusiness.doSearchDebt(obj);
//        return Response.ok(data).build();
//    }

    @Override
    public Response doSearchPackage(AIOPackageDTO obj) {
        DataListDTO data = aioPackageBusiness.doSearchPackage(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response getCatUnit() {
        return Response.ok().build();
    }

    @Override
    public Response addNewPackage(AIOPackageRequest dto) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            dto.getAioPackageDTO().setCreatedUser(sysUserId);
            dto.getAioPackageDTO().setCreatedDate(new Date());

            List<String> domainData = new ArrayList<>();
            String provinceIdsStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE, Constant.AdResourceKey.PACKAGE, request);
            if (StringUtils.isNotEmpty(provinceIdsStr)) {
                domainData = Arrays.asList(provinceIdsStr.split(","));
            }
            dto.getAioPackageDTO().setDomainData(domainData);

            aioPackageBusiness.addNewPackage(dto, user);
            return Response.ok(Response.Status.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }

    @Override
    public Response updatePackage(AIOPackageRequest dto) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            dto.getAioPackageDTO().setUpdateUser(sysUserId);
            dto.getAioPackageDTO().setUpdateDate(new Date());

            aioPackageBusiness.updatePackage(dto);
            return Response.ok(Response.Status.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }

    @Override
    public Response getDetailById(Long id) {
        try {
            AIOPackageRequest res = aioPackageBusiness.getDetailById(id);
            return Response.ok(res).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }

    @Override
    public Response getEngineGoodsLocationList() {
        AIOPackageResponse res = aioPackageBusiness.getEngineGoodsLocationList();
        return Response.ok(res).build();
    }

    @Override
    public Response getGoodsList(GoodsDTO dto) {
        DataListDTO dataListDTO = aioPackageBusiness.getGoodsList(dto);
        return Response.ok(dataListDTO).build();
    }

    @Override
    public Response deletePackage(Long id) {
        try {
            aioPackageBusiness.deletePackage(id);
            return Response.ok(Response.Status.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }

    @Override
    public Response readFilePackagePrice(Attachment attachments) {
        return this.readFilePackagePrice(attachments, 0);
    }

    @Override
    public Response downloadTemplatePackagePrice(List<AIOPackageDetailPriceDTO> dtos) {
        return this.downloadTemplatePackagePrice(dtos, 0);
    }

    @Override
    public Response getListService(AIOConfigServiceDTO criteria) {
        try {
            return Response.ok(aioPackageBusiness.getListService(criteria)).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra");
        }
    }

    //VietNT_09/07/2019_start
    @Override
    public Response downloadTemplatePackagePriceProvince(List<AIOPackageDetailPriceDTO> dtos) {
        return this.downloadTemplatePackagePrice(dtos, 1);
    }

    @Override
    public Response downloadTemplatePackagePriceCompany(List<AIOPackageDetailPriceDTO> dtos) {
        return this.downloadTemplatePackagePrice(dtos, 2);
    }

    private Response downloadTemplatePackagePrice(List<AIOPackageDetailPriceDTO> dtos, int option) {
        try {
            return Response.ok(Collections.singletonMap("fileName", aioPackageBusiness.createTemplatePackagePrice(dtos, option, request))).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra");
        }
    }

    private Response readFilePackagePrice(Attachment attachments, int option) {
        try {
//            List<ExcelErrorDTO> errors = new ArrayList<>();
            List<AIOPackageDetailPriceDTO> dtos = aioPackageBusiness.readFilePackagePrice(attachments, request, option);
            //VietNT_06/07/2019_start
//            AIOPackageDetailPriceDTO errorObj = new AIOPackageDetailPriceDTO();
//            errorObj.setErrorList(errors);
//            dtos.add(errorObj);
            //VietNT_end
            return Response.ok(dtos).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra");
        }
    }

    @Override
    public Response readFilePackagePriceProvince(Attachment attachments) {
        return this.readFilePackagePrice(attachments, 1);
    }

    @Override
    public Response readFilePackagePriceCompany(Attachment attachments) {
        return this.readFilePackagePrice(attachments, 2);
    }
    //VietNT_end

    @Override
    public Response getPermissionCreatePackage() {
        List<String> listProvince = aioPackageBusiness.getProvinceInPermission(request);
        return listProvince.isEmpty()
                ? this.buildErrorResponse("NOK")
                : Response.ok(listProvince).build();
    }
}
