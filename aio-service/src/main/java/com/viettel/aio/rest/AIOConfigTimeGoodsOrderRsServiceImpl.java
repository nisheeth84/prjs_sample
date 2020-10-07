package com.viettel.aio.rest;

import com.viettel.aio.business.AIOConfigTimeGoodsOrderBusinessImpl;
import com.viettel.aio.dto.AIOConfigTimeGoodsOrderDTO;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;

//VietNT_20190604_create
public class AIOConfigTimeGoodsOrderRsServiceImpl implements AIOConfigTimeGoodsOrderRsService {

    protected final Logger log = Logger.getLogger(AIOConfigTimeGoodsOrderRsServiceImpl.class);

    @Autowired
    private AIOConfigTimeGoodsOrderBusinessImpl aioConfigTimeGoodsOrderBusiness;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIOConfigTimeGoodsOrderDTO obj) {
        DataListDTO data = aioConfigTimeGoodsOrderBusiness.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response saveConfig(AIOConfigTimeGoodsOrderDTO dto) {
        try {
            aioConfigTimeGoodsOrderBusiness.saveConfig(dto);
            return Response.ok(Response.Status.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }

    @Override
    public Response deleteConfig(Long id) {
        try {
            aioConfigTimeGoodsOrderBusiness.deleteConfig(id);
            return Response.ok(Response.Status.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }

    public Response getTempCode() {
        String tempCode = aioConfigTimeGoodsOrderBusiness.getTempCode();
        return Response.ok().entity(Collections.singletonMap("tempCode", tempCode)).build();
    }
}
