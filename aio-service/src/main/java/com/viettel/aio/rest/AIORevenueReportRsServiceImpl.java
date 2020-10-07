package com.viettel.aio.rest;

import com.viettel.aio.business.AIORevenueReportBussiness;
import com.viettel.aio.business.CommonServiceAio;
import com.viettel.aio.dto.AIORevenueDailyDTO;
import com.viettel.aio.dto.AIORevenueReportDTO;
import com.viettel.aio.dto.AIORevenueReportSearchDTO;
import com.viettel.asset.business.SysGroupBusiness;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.erp.dto.DataListDTO;
import com.viettel.ktts2.business.CommonSysGroupBusiness;
import com.viettel.ktts2.dto.KttsUserSession;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.text.SimpleDateFormat;
import java.util.*;

public class AIORevenueReportRsServiceImpl implements AIORevenueReportRsService {

    @Autowired
    public AIORevenueReportRsServiceImpl(AIORevenueReportBussiness aioRevenueReportBussiness) {
        this.aioRevenueReportBussiness = aioRevenueReportBussiness;
    }

    private AIORevenueReportBussiness aioRevenueReportBussiness;

    @Context
    HttpServletRequest request;

    private Logger log = Logger.getLogger(AIORevenueReportRsServiceImpl.class);

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    private String convertDate(Date startDate) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/YYYY");
        String s = sdf.format(startDate);
        return s;
      
    }
    @Override
    public Response searchRevenueReport(AIORevenueReportSearchDTO obj) {
        DataListDTO data = new DataListDTO();
        if (AIORevenueReportSearchDTO.TYPE_BY_PROVINCE == obj.getType()) {
            List<AIORevenueReportDTO> dtos = aioRevenueReportBussiness.revenueByProvince(obj);
            data.setData(dtos);
            data.setTotal(obj.getTotalRecord());
            data.setSize(obj.getPageSize());
            data.setStart(1);
            return Response.ok(data).build();
        }
        if (AIORevenueReportSearchDTO.TYPE_BY_GROUP == obj.getType()) {
            List<AIORevenueReportDTO> dtos = aioRevenueReportBussiness.revenueByGroup(obj);
            data.setData(dtos);
            data.setTotal(obj.getTotalRecord());
            data.setSize(obj.getPageSize());
            data.setStart(1);
            return Response.ok(data).build();
        }
        if (AIORevenueReportSearchDTO.TYPE_BY_STAFF == obj.getType()) {

            List<AIORevenueReportDTO> dtos = aioRevenueReportBussiness.revenueByStaff(obj);
            data.setData(dtos);
            data.setTotal(obj.getTotalRecord());
            data.setSize(obj.getPageSize());
            data.setStart(1);
            return Response.ok(data).build();
        }
        if (AIORevenueReportSearchDTO.TYPE_DAILY == obj.getType()) {
            List<AIORevenueDailyDTO> dtos = aioRevenueReportBussiness.revenueDaily(obj);
            data.setData(dtos);
            data.setTotal(obj.getTotalRecord());
            data.setSize(obj.getTotalRecord());
            data.setStart(1);
            return Response.ok(data).build();
        }
        return buildErrorResponse("Chưa chọn loại báo cáo");
    }

    @Override
    public Response searchAreas(AIORevenueReportSearchDTO obj) {
        return Response.ok(aioRevenueReportBussiness.searchAreas(obj)).build();
    }

    @Override
    public Response exportRevenueReport(AIORevenueReportSearchDTO obj) {
        try {
            String fileName = aioRevenueReportBussiness.exportRevenue(obj);
            return Response.ok(Collections.singletonMap("fileName", fileName)).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex);
            return buildErrorResponse("Có lỗi xảy ra");
        }
    }
}