package com.viettel.coms.rest;

import com.viettel.coms.business.RequestGoodsBusinessImpl;
import com.viettel.coms.dto.ConstructionDetailDTO;
import com.viettel.coms.dto.RequestGoodsDTO;
import com.viettel.coms.dto.RequestGoodsDetailDTO;
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

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

//VietNT_20190104_created
public class RequestGoodsRsServiceImpl implements RequestGoodsRsService {

    protected final Logger log = Logger.getLogger(RpHSHCRsServiceImpl.class);

    @Autowired
    private RequestGoodsBusinessImpl requestGoodsBusiness;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private final String ERROR_MESSAGE = "Đã có lỗi xảy ra trong quá trình xử lý dữ liệu";

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(RequestGoodsDTO obj) {
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.REQUEST, Constant.AdResourceKey.GOODS, request);
        List<String> groupIdList = ConvertData.convertStringToList(sysGroupIdStr, ",");
        DataListDTO data = new DataListDTO();
        if (groupIdList != null && !groupIdList.isEmpty()) {
            data = requestGoodsBusiness.doSearch(obj, groupIdList);
        } else {
            data.setData(new ArrayList<>());
            data.setTotal(0);
            data.setSize(10);
            data.setStart(1);
        }
        return Response.ok(data).build();
    }

    @Override
    public Response searchConstruction(ConstructionDetailDTO obj) {
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.REQUEST, Constant.AdResourceKey.GOODS, request);
        DataListDTO data = new DataListDTO();
        if (StringUtils.isNotEmpty(sysGroupIdStr)) {
            data = requestGoodsBusiness.searchConstruction(obj, sysGroupIdStr);
        } else {
            data.setData(new ArrayList<>());
            data.setTotal(0);
            data.setSize(10);
            data.setStart(1);
        }
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchDetail(RequestGoodsDetailDTO obj) {
        DataListDTO data = requestGoodsBusiness.doSearchDetail(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response getCatUnit() {
        List<RequestGoodsDetailDTO> dtos = requestGoodsBusiness.getCatUnit();
        return Response.ok(dtos).build();
    }

    @Override
    public Response addNewRequestGoods(RequestGoodsDTO dto) {
        KttsUserSession session = userRoleBusiness.getUserSession(request);
        Long sysUserId = session.getVpsUserInfo().getSysUserId();
        try {
            requestGoodsBusiness.addNewRequestGoods(dto, sysUserId);
            return Response.ok(Response.Status.OK).build();
        } catch (Exception e) {
        	e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }

    @Override
    public Response doRequestGoods(List<Long> requestIds) {
        KttsUserSession session = userRoleBusiness.getUserSession(request);
        Long sysUserId = session.getVpsUserInfo().getSysUserId();

        try {
            requestGoodsBusiness.doRequestGoods(requestIds, sysUserId);
            return Response.ok(Response.Status.OK).build();
        } catch (Exception e) {
        	e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }

    @Override
    public Response importExcel(Attachment attachments, HttpServletRequest request) throws Exception {
        try {
            Long sysUserId = userRoleBusiness.getUserSession(request).getVpsUserInfo().getSysUserId();
            String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.REQUEST, Constant.AdResourceKey.GOODS, request);
            String filePath = requestGoodsBusiness.uploadToServer(attachments, request);

            List<RequestGoodsDTO> result = requestGoodsBusiness.doImportExcel(filePath, sysUserId, sysGroupIdStr);
            if (result != null && !result.isEmpty()
                    && (result.get(0).getErrorList() == null
                    || result.get(0).getErrorList().size() == 0)) {
                requestGoodsBusiness.addNewRequestGoodsImport(result);
                return Response.ok(result).build();
            } else if (result == null || result.isEmpty()) {
                return Response.ok().entity(Response.Status.NO_CONTENT).build();
            } else {
                return Response.ok(result).build();
            }
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(ERROR_MESSAGE);
        } catch (Exception e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response importExcelDetail(Attachment attachments, HttpServletRequest request) throws Exception {
        try {
            String filePath = requestGoodsBusiness.uploadToServer(attachments, request);
            List<RequestGoodsDetailDTO> result = requestGoodsBusiness.readExcelImportDetail(filePath);
            if (result == null || result.isEmpty()) {
                return Response.ok().entity(Response.Status.NO_CONTENT).build();
            } else {
                return Response.ok(result).build();
            }
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(ERROR_MESSAGE);
        } catch (Exception e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response downloadTemplate(long templateDetail) throws Exception {
        try {
            String filePath = requestGoodsBusiness.downloadTemplate(templateDetail);
            return Response.ok(Collections.singletonMap("fileName", filePath)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    @Override
    public Response editRequestGoods(RequestGoodsDTO dto) throws Exception {
        try {
            Long sysUserId = userRoleBusiness.getUserSession(request).getVpsUserInfo().getSysUserId();
            requestGoodsBusiness.editRequestGoods(dto, sysUserId);
            return Response.ok().entity(Response.Status.OK).build();
        } catch (Exception e) {
        	e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }

    @Override
    public Response getDetailsById(Long requestGoodsId) throws Exception {
        DataListDTO dataListDTO = requestGoodsBusiness.getDetailsById(requestGoodsId);
        return Response.ok(dataListDTO).build();
    }

    @Override
    public Response deleteRequest(Long requestGoodsId) throws Exception {
        try {
            requestGoodsBusiness.deleteRequest(requestGoodsId);
            return Response.ok().entity(Response.Status.OK).build();
        } catch (Exception e) {
        	e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }
}
