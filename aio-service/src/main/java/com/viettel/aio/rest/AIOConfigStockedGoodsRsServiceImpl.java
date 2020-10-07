package com.viettel.aio.rest;

import com.viettel.aio.business.AIOConfigStockedGoodsBusinessImpl;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOConfigStockedGoodsDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.List;

//VietNT_20190530_create
public class AIOConfigStockedGoodsRsServiceImpl implements AIOConfigStockedGoodsRsService {

    protected final Logger log = Logger.getLogger(AIOConfigStockedGoodsRsServiceImpl.class);

    @Autowired
    private AIOConfigStockedGoodsBusinessImpl aioConfigStockedGoodsBusiness;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIOConfigStockedGoodsDTO obj) {
        DataListDTO data = aioConfigStockedGoodsBusiness.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response updateConfig(AIOConfigStockedGoodsDTO obj) {
        KttsUserSession session = userRoleBusiness.getUserSession(request);
        Long sysUserId = session.getVpsUserInfo().getSysUserId();
        aioConfigStockedGoodsBusiness.updateConfig(obj, sysUserId);
        return Response.ok(Response.Status.OK).build();
    }

    @Override
    public Response deleteConfig(AIOConfigStockedGoodsDTO obj) {
        aioConfigStockedGoodsBusiness.deleteConfig(obj);
        return Response.ok(Response.Status.OK).build();
    }

    @Override
    public Response downloadTemplate() {
        try {
            String filePath = aioConfigStockedGoodsBusiness.downloadTemplate();
            return Response.ok(Collections.singletonMap("fileName", filePath)).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            log.error(e);
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response importExcel(Attachment attachments, HttpServletRequest request) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            List<AIOConfigStockedGoodsDTO> result = aioConfigStockedGoodsBusiness.doImportExcel(attachments, request, sysUserId);
            if (result != null && !result.isEmpty() && (result.get(0).getErrorList() == null
                    || result.get(0).getErrorList().size() == 0)) {
                aioConfigStockedGoodsBusiness.addNewConfig(result);
                return Response.ok(result).build();
            } else if (result == null || result.isEmpty()) {
                return Response.ok().entity(Response.Status.NO_CONTENT).build();
            } else {
                return Response.ok(result).build();
            }
        } catch (Exception e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
}
