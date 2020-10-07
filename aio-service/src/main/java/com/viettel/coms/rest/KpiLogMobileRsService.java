package com.viettel.coms.rest;

import com.viettel.coms.dto.CatConstructionTypeDTO;
import com.viettel.coms.dto.KpiLogMobileDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public interface KpiLogMobileRsService {

    @POST
    @Path("/kpiLogMobile/rpDailyTask")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response rpDailyTask(KpiLogMobileDTO obj);

    @POST
    @Path("/kpiLogMobile/getConstrTypeForAutoComplete")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response getConstructionTypeForAutoComplete(CatConstructionTypeDTO obj);

    @POST
    @Path("/kpiLogMobile/exportExcel")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response exportExcel(KpiLogMobileDTO dto) throws Exception;

}
