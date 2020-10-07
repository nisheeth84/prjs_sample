package com.viettel.aio.rest;

import com.viettel.aio.business.AIOPackageBusinessImpl;
import com.viettel.aio.business.AIORpPersonalInventoryBusinessImpl;
import com.viettel.aio.dto.AIOPackageDTO;
import com.viettel.aio.dto.AIOPackageRequest;
import com.viettel.aio.dto.AIOPackageResponse;
import com.viettel.coms.dto.GoodsDTO;
import com.viettel.coms.dto.MerEntitySimpleDTO;
import com.viettel.coms.rest.RpHSHCRsServiceImpl;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.io.FileNotFoundException;
import java.util.Collections;

//VietNT_20190320_create
public class AIORpPersonalInventoryRsServiceImpl implements AIORpPersonalInventoryRsService {

    protected final Logger log = Logger.getLogger(RpHSHCRsServiceImpl.class);

    @Autowired
    private AIORpPersonalInventoryBusinessImpl rpPersonalInventoryBusiness;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearchPackage(MerEntitySimpleDTO obj) {
        DataListDTO data = rpPersonalInventoryBusiness.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response exportHandoverNV(MerEntitySimpleDTO dto) {
        Response res;
        try {
            String filePath = rpPersonalInventoryBusiness.exportExcel(dto);
            if (StringUtils.isEmpty(filePath)) {
                res = this.buildErrorResponse("Không có dữ liệu!");
            } else {
                res = Response.ok(Collections.singletonMap("fileName", filePath)).build();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            res = this.buildErrorResponse("Không tìm thấy biểu mẫu");
        } catch (Exception e) {
            e.printStackTrace();
            res = this.buildErrorResponse("Có lỗi xảy ra trong quá trình xuất file!");
        }
        return res;
    }
}
