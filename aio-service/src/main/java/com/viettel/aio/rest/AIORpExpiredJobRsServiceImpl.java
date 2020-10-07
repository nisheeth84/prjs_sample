package com.viettel.aio.rest;

import com.viettel.aio.business.AIORpExpiredJobBusiness;
import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.io.FileNotFoundException;
import java.util.Collections;

public class AIORpExpiredJobRsServiceImpl implements AIORpRequestNOKRsService {

    protected final Logger log = Logger.getLogger(AIORpExpiredJobRsServiceImpl.class);

    @Autowired
    private AIORpExpiredJobBusiness aioRpExpiredJobBusinessImpl;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIOOrdersDTO obj) {
        DataListDTO data = aioRpExpiredJobBusinessImpl.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response exportExcel(AIOOrdersDTO dto) {
        Response res;
        try {
            String filePath = aioRpExpiredJobBusinessImpl.exportExcel(dto);
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

