package com.viettel.coms.rest;

import java.util.Collections;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.viettel.coms.business.RpQuantityBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.RpConstructionDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.coms.dto.couponExportDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;

public class RpQuantityRsServiceImpl implements RpQuantityRsService{

	protected final Logger log = Logger.getLogger(RpQuantityBusinessImpl.class);
	@Autowired
	RpQuantityBusinessImpl rpQuantityBusinessImpl;
	@Context
    HttpServletRequest request;
	@Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    @Context
    HttpServletResponse response;
    @Value("${folder_upload2}")
    private String folderUpload;
    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

	
	@Override
	public Response doSearchQuantity(WorkItemDetailDTO obj) {
		//tanqn 20181113 start
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSERACH_WORK_ITEM_SERVICE_TASK");
        objKpiLog.setDescription("Chi tiết sản lượng theo ngày");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		DataListDTO data = rpQuantityBusinessImpl.doSearchQuantity(obj, request);
		Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
	}
//	hungtd_20181217_start
	@Override
	public Response doSearch(RpConstructionDTO obj) {
		//tanqn 20181113 start
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSERACH_WORK_ITEM_SERVICE_TASK");
        objKpiLog.setDescription("Báo cáo đủ điều kiện BGMB");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		DataListDTO data = rpQuantityBusinessImpl.doSearch(obj, request);
		Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
	}
	//NHAN_BGMB
	@Override
	public Response doSearchNHAN(RpConstructionDTO obj) {
		//tanqn 20181113 start
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSERACH_WORK_ITEM_SERVICE_TASK");
        objKpiLog.setDescription("Báo cáo thông tin nhận mặt bằng");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		DataListDTO data = rpQuantityBusinessImpl.doSearchNHAN(obj, request);
		Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
	}
	//KC
		@Override
		public Response doSearchKC(RpConstructionDTO obj) {
			//tanqn 20181113 start
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
	        KpiLogDTO objKpiLog = new KpiLogDTO();
	        Date dStart = new Date();
	        objKpiLog.setStartTime(dStart);
	        objKpiLog.setCreateDatetime(dStart);
	        objKpiLog.setFunctionCode("DOSERACH_WORK_ITEM_SERVICE_TASK");
	        objKpiLog.setDescription("Báo cáo tồn chưa khởi công");
	        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
			DataListDTO data = rpQuantityBusinessImpl.doSearchKC(obj, request);
			Date dEnd = new Date();
	        objKpiLog.setEndTime(dEnd);
	        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	        objKpiLog.setStatus("1");
	        yearPlanBusinessImpl.addKpiLog(objKpiLog);
	        return Response.ok(data).build();
		}
		//TONTHICON
		@Override
		public Response doSearchTONTC(RpConstructionDTO obj) {
			//tanqn 20181113 start
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
	        KpiLogDTO objKpiLog = new KpiLogDTO();
	        Date dStart = new Date();
	        objKpiLog.setStartTime(dStart);
	        objKpiLog.setCreateDatetime(dStart);
	        objKpiLog.setFunctionCode("DOSERACH_WORK_ITEM_SERVICE_TASK");
	        objKpiLog.setDescription("Báo cáo tồn thi công");
	        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
			DataListDTO data = rpQuantityBusinessImpl.doSearchTONTC(obj, request);
			Date dEnd = new Date();
	        objKpiLog.setEndTime(dEnd);
	        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	        objKpiLog.setStatus("1");
	        yearPlanBusinessImpl.addKpiLog(objKpiLog);
	        return Response.ok(data).build();
		}
		@Override
		public Response doSearchHSHC(RpConstructionDTO obj) {
			//tanqn 20181113 start
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
	        KpiLogDTO objKpiLog = new KpiLogDTO();
	        Date dStart = new Date();
	        objKpiLog.setStartTime(dStart);
	        objKpiLog.setCreateDatetime(dStart);
	        objKpiLog.setFunctionCode("DOSERACH_WORK_ITEM_SERVICE_TASK");
	        objKpiLog.setDescription("Báo cáo đủ điều kiện BGMB");
	        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
			DataListDTO data = rpQuantityBusinessImpl.doSearchHSHC(obj, request);
			Date dEnd = new Date();
	        objKpiLog.setEndTime(dEnd);
	        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	        objKpiLog.setStatus("1");
	        yearPlanBusinessImpl.addKpiLog(objKpiLog);
	        return Response.ok(data).build();
		}
		@Override
		public Response export(RpConstructionDTO obj) throws Exception {
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
	        KpiLogDTO objKpiLog = new KpiLogDTO();
	        Date dStart = new Date();
	        objKpiLog.setStartTime(dStart);
	        objKpiLog.setCreateDatetime(dStart);
	        objKpiLog.setFunctionCode("IMPORT_WORK_ITEM_SERVICE_TASK");
	        objKpiLog.setDescription("Chi tiết sản lượng theo ngày");
	        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
			try {
				Date dEnd = new Date();
		        objKpiLog.setEndTime(dEnd);
		        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
		        objKpiLog.setStatus("1");
		        yearPlanBusinessImpl.addKpiLog(objKpiLog);
	            String strReturn = rpQuantityBusinessImpl.export(obj, request);
	            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
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
//	hungtd_20181217_end

	@Override
	public Response exportWorkItemServiceTask(WorkItemDetailDTO obj) throws Exception {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("IMPORT_WORK_ITEM_SERVICE_TASK");
        objKpiLog.setDescription("Chi tiết sản lượng theo ngày");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		try {
			Date dEnd = new Date();
	        objKpiLog.setEndTime(dEnd);
	        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	        objKpiLog.setStatus("1");
	        yearPlanBusinessImpl.addKpiLog(objKpiLog);
            String strReturn = rpQuantityBusinessImpl.exportWorkItemServiceTask(obj, request);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
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
//tanqn 20181113 end
//	hungtd_20192101_start
	@Override
	public Response doSearchCoupon(couponExportDTO obj) {
		//tanqn 20181113 start
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSERACH_WORK_ITEM_SERVICE_TASK");
        objKpiLog.setDescription("phiếu vật tư A cấp chưa nhận");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		DataListDTO data = rpQuantityBusinessImpl.doSearchCoupon(obj, request);
		Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
	}
//	hungtd_20192101_end
	
//	hungtd_20192101_start
	@Override
	public Response doSearchPopup(couponExportDTO obj) {
		//tanqn 20181113 start
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSERACH_WORK_ITEM_SERVICE_TASK");
        objKpiLog.setDescription("phiếu vật tư A cấp chưa nhận");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		DataListDTO data = rpQuantityBusinessImpl.doSearchPopup(obj, request);
		Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
	}
//	hungtd_20192101_end
}
