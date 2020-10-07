package com.viettel.aio.rest;

import com.viettel.aio.business.AIORpIncidentBusinessImpl;
import com.viettel.aio.dto.report.AIORpIncidentDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * Created by HaiND on 9/26/2019 9:31 PM.
 */
public class AIORpIncidentRsServiceImpl implements AIORpIncidentRsService {

    @Autowired
    private AIORpIncidentBusinessImpl aioRpIncidentBusiness;

    private Logger log = Logger.getLogger(AIORpImplementRsServiceImpl.class);

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearchArea(AIORpIncidentDTO obj) {
        List<AIORpIncidentDTO> data = aioRpIncidentBusiness.doSearchArea(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchGroup(AIORpIncidentDTO obj) {
        List<AIORpIncidentDTO> data = aioRpIncidentBusiness.doSearchGroup(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearch(AIORpIncidentDTO obj) {
        DataListDTO data = aioRpIncidentBusiness.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doExport(AIORpIncidentDTO obj) {
        try {
            Calendar cal = Calendar.getInstance();
            if (obj.getStartDate() == null) {
                cal.set(Calendar.DAY_OF_MONTH, 1);
                obj.setStartDate(cal.getTime());
            }
            if (obj.getEndDate() == null) {
                obj.setEndDate(new Date());
            }

            String fileName = aioRpIncidentBusiness.doExport(obj);
            return Response.ok(Collections.singletonMap("fileName", fileName)).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex);
            return buildErrorResponse("Có lỗi xảy ra");
        }
    }
}
