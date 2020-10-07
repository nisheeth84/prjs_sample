package com.viettel.coms.rest;

import com.viettel.coms.business.KpiLogMobileBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.CatConstructionTypeDTO;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.KpiLogMobileDTO;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.Date;
import java.util.List;

public class KpiLogMobileRsServiceImpl implements KpiLogMobileRsService {

    protected final Logger log = Logger.getLogger(KpiLogMobileRsService.class);
    @Autowired
    KpiLogMobileBusinessImpl kpiLogMobileBusinessImpl;

    @Context
    HttpServletRequest request;
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    @Override
    public Response rpDailyTask(KpiLogMobileDTO obj) {
    	//tanqn 20181113 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("RP_DAILY_TASK");
        objKpiLog.setDescription("Báo cáo thực hiện công việc theo ngày");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        //tanqn 20181113 end
//		hoanm1_20180815_start
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.DATA, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        List<KpiLogMobileDTO> ls = kpiLogMobileBusinessImpl.rpDailyTask(obj, groupIdList);
//		hoanm1_20180815_end
        if (ls == null) {
        	//tanqn 20181113 start
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(obj.getTotalRecord());
            data.setSize(ls.size());
            data.setStart(1);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(data).build();
        }//tanqn20181113 end
    }

    @Override
    public Response getConstructionTypeForAutoComplete(CatConstructionTypeDTO obj) {
        DataListDTO results = kpiLogMobileBusinessImpl.getConstructionTypeForAutoComplete(obj);
        return Response.ok(results).build();
    }

    @Override
    public Response exportExcel(KpiLogMobileDTO obj) throws Exception {
    	//tanqn 20181113 start
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_EXCEL_KPI_LOG_MOBILE");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Báo cáo thực hiện công việc theo ngày");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        //tanqn 20181113 end
        try {
        	Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", kpiLogMobileBusinessImpl.exportExcel(obj, request)))
                    .build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            objKpiLog.setReason(e.toString());
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }

}
