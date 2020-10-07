package com.viettel.aio.rest;

import com.viettel.aio.business.AIORpImplementBusiness;
import com.viettel.aio.dto.report.AIORpImplementDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.*;

public class AIORpImplementRsServiceImpl implements AIORpImplementRsService {

    @Autowired
    private AIORpImplementBusiness aioRpImplementBusiness;

    @Context
    HttpServletRequest request;

    private Logger log = Logger.getLogger(AIORpImplementRsServiceImpl.class);

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIORpImplementDTO obj) {
        Calendar cal = Calendar.getInstance();
        if (obj.getStartDate() == null) {
            cal.set(Calendar.DAY_OF_MONTH, 1);
            obj.setStartDate(cal.getTime());
        }
        if (obj.getEndDate() == null) {
            obj.setEndDate(new Date());
        }
        List<AIORpImplementDTO> dtos;
        if (obj.getRpLevel() == AIORpImplementDTO.LEVEL_GROUP) {
            dtos = aioRpImplementBusiness.implementByGroup(obj);
        } else {
            dtos = aioRpImplementBusiness.implementByProvince(obj);
        }

        DataListDTO data = new DataListDTO();
        data.setData(dtos);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return Response.ok(data).build();
    }

    @Override
    public Response doExport(AIORpImplementDTO obj) {
        try {
            Calendar cal = Calendar.getInstance();
            if (obj.getStartDate() == null) {
                cal.set(Calendar.DAY_OF_MONTH, 1);
                obj.setStartDate(cal.getTime());
            }
            if (obj.getEndDate() == null) {
                obj.setEndDate(new Date());
            }

            String fileName = aioRpImplementBusiness.doExport(obj);
            return Response.ok(Collections.singletonMap("fileName", fileName)).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex);
            return buildErrorResponse("Có lỗi xảy ra");
        }

    }
}
