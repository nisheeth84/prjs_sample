package com.viettel.aio.rest;

import com.viettel.aio.business.AIORpHrNotSalesBusinessImpl;
import com.viettel.aio.dto.report.AIORpHrNotSalesDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Created by HaiND on 9/28/2019 2:34 AM.
 */
public class AIORpHrNotSalesRsServiceImpl implements AIORpHrNotSalesRsService {

    @Autowired
    private AIORpHrNotSalesBusinessImpl aioRpHrNotSalesBusiness;

    @Override
    public Response doSearchArea(AIORpHrNotSalesDTO obj) {
        List<AIORpHrNotSalesDTO> data = aioRpHrNotSalesBusiness.doSearchArea(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchGroup(AIORpHrNotSalesDTO obj) {
        List<AIORpHrNotSalesDTO> data = aioRpHrNotSalesBusiness.doSearchGroup(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearch(AIORpHrNotSalesDTO obj) {
        DataListDTO data = aioRpHrNotSalesBusiness.doSearch(obj);
        return Response.ok(data).build();
    }
}
