package com.viettel.aio.rest;

import com.viettel.aio.business.GoodsPriceBusinessImpl;
import com.viettel.aio.dto.GoodsPriceDTO;
import com.viettel.coms.rest.RpHSHCRsServiceImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;

//VietNT_20190308_create
public class GoodPriceRsServiceImpl implements GoodPriceRsService {

    protected final Logger log = Logger.getLogger(RpHSHCRsServiceImpl.class);

    @Autowired
    private GoodsPriceBusinessImpl goodPriceBusiness;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private final String ERROR_MESSAGE = "Đã có lỗi xảy ra trong quá trình xử lý dữ liệu";

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(GoodsPriceDTO obj) {
        DataListDTO data = goodPriceBusiness.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response addNew(GoodsPriceDTO dto) {
        try {
            goodPriceBusiness.addNew(dto);
            return Response.ok(Response.Status.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }

    @Override
    public Response deleteGoodsPrice(Long id) {
        try {
            goodPriceBusiness.deleteGoodsPrice(id);
            return Response.ok(Response.Status.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }

    @Override
    public Response getGpById(Long id) {
        try {
            GoodsPriceDTO dto = goodPriceBusiness.getGpById(id);
            if (dto == null) {
                return this.buildErrorResponse("Không tìm thấy đơn giá!");
            }
            return Response.ok(dto).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }

    @Override
    public Response submitEdit(GoodsPriceDTO dto) {
        try {
            goodPriceBusiness.submitEdit(dto);
            return Response.ok(Response.Status.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        }
    }
}
