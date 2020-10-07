package com.viettel.aio.rest;

import com.viettel.aio.business.AIOKpiLogBusiness;
import com.viettel.aio.business.AIOReportBusinessImpl;
import com.viettel.aio.config.FunctionCodeLog;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOKpiLogDTO;
import com.viettel.aio.dto.AIOPackageDTO;
import com.viettel.aio.dto.report.AIOReportDTO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

//VietNT_20190619_create
public class AIOReportRsServiceImpl implements AIOReportRsService {

    protected final Logger log = Logger.getLogger(AIOReportRsServiceImpl.class);

    @Autowired
    public AIOReportRsServiceImpl(AIOReportBusinessImpl aioReportBusiness, AIOKpiLogBusiness aioKpiLogBusiness) {
        this.aioReportBusiness = aioReportBusiness;
        this.aioKpiLogBusiness = aioKpiLogBusiness;
    }

    private AIOReportBusinessImpl aioReportBusiness;
    private AIOKpiLogBusiness aioKpiLogBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearchCostPrice(AIOReportDTO obj) {
        DataListDTO data = aioReportBusiness.doSearchRpCostPrice(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response getListContract(AIOContractDTO obj) {
        DataListDTO data = aioReportBusiness.getListContract(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response getListPackage(AIOPackageDTO obj) {
        DataListDTO data = aioReportBusiness.getListPackage(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchRpStock(AIOReportDTO obj) {
        DataListDTO data = aioReportBusiness.doSearchRpStock(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchRpSalary(AIOReportDTO obj) {
        DataListDTO data = aioReportBusiness.doSearchRpSalary(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response getDropDownData() {
        List<AppParamDTO> data = aioReportBusiness.getDropDownData();
        return Response.ok(data).build();
    }

    @Override
    public Response exportExcelSalary(AIOReportDTO obj) {
        try {
            String filePath = aioReportBusiness.exportExcelSalary(obj);
            return Response.ok(Collections.singletonMap("fileName", filePath)).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            return this.buildErrorResponse("Không tìm thấy file biểu mẫu!");
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response doSearchRpSalaryDetail(AIOReportDTO obj) {
        DataListDTO data = aioReportBusiness.doSearchRpSalaryDetail(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response exportExcelSalaryDetail(AIOReportDTO obj) {
        try {
            String filePath = aioReportBusiness.exportExcelAIOSalaryDetail(obj);
            return Response.ok(Collections.singletonMap("fileName", filePath)).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            return this.buildErrorResponse("Không tìm thấy file biểu mẫu!");
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response getAutoCompleteSysGroupLevel(AIOReportDTO obj) {
        List<AIOReportDTO> data = aioReportBusiness.getAutoCompleteSysGroupLevel(obj, request);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchDataChart(AIOReportDTO obj) {
        Map<String, List<AIOReportDTO>> dataMap = aioReportBusiness.doSearchDataChart(obj);
        return Response.ok(dataMap).build();
    }

    @Override
    public Response doSearchDataExport(AIOReportDTO obj) {
        List<AIOReportDTO> data = aioReportBusiness.doSearchDataExport(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchAioReportSalary(AIOReportDTO obj) {
        DataListDTO data = aioReportBusiness.doSearchAIORpSalary(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response logAccess(AIOKpiLogDTO dto) {
        // save log use function
        try {
            FunctionCodeLog functionCode = Enum.valueOf(FunctionCodeLog.class, dto.getFunctionCode());
            KttsUserSession session = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            aioKpiLogBusiness.createGenericLog(functionCode, session.getVpsUserInfo());
        } catch (BusinessException e) {
            e.printStackTrace();
        }
        return Response.ok(Response.Status.OK).build();
    }
}
