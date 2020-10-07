/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.asset.dto.SysGroupDto;
import com.viettel.cat.constant.Constants;
import com.viettel.cat.dto.CatPartnerDTO;
import com.viettel.coms.ConstructionProgressDTO;
import com.viettel.coms.business.ConstructionBusinessImpl;
import com.viettel.coms.business.UtilAttachDocumentBusinessImpl;
import com.viettel.coms.business.WorkItemBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.config.JasperReportConfig;
import com.viettel.coms.dao.ConstructionTaskDAO;
import com.viettel.coms.dto.*;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import viettel.passport.client.UserToken;

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import java.io.*;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class ConstructionRsServiceImpl implements ConstructionRsService {

	protected final Logger log = Logger.getLogger(ConstructionRsServiceImpl.class);
	@Autowired
	ConstructionBusinessImpl constructionBusinessImpl;

	@Autowired
	ConstructionTaskDAO constructionTaskDao;
	@Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
	@Context
	HttpServletRequest request;

	@Context
	HttpServletResponse response;

	@Autowired
	private UserRoleBusinessImpl userRoleBusinessImpl;

	// chinhpxn 20180605 start
	@Autowired
	WorkItemBusinessImpl workItemBusinessImpl;
	// chinhpxn 20180605 end

	@Value("${folder_upload2}")
	private String folderUpload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;
	@Value("${allow.file.ext}")
	private String allowFileExt;
	@Value("${allow.folder.dir}")
	private String allowFolderDir;
	@Value("${folder_upload}")
	private String folderTemp;
	// hungnx 070618 start
	@Autowired
	UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl;

	// hungnx 070618 end

	@Override
	public Response getCatConstructionType() {
		return Response.ok(constructionBusinessImpl.getCatConstructionType()).build();
	}

	@Override
	public Response getCatConstructionDeploy() {
		return Response.ok(constructionBusinessImpl.getCatConstructionDeploy()).build();
	}

	@Override
	public Response getCatStation(CatStationDTO obj) {
		return Response.ok(constructionBusinessImpl.getCatStation(obj, request)).build();
	}

	@Override
	public Response doSearch(ConstructionDetailDTO obj) {

		// Tienth_20180329 Start
		//tanqn start 20181116
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_CONSTRUCTION_DETAIL");
        objKpiLog.setDescription("Quản lý công trình");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		// Tienth_20180329 END
		Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
		DataListDTO data = constructionBusinessImpl.doSearch(obj, sysGroupId, request);
		Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
		return Response.ok(data).build();
	}

	@Override
	public Response doSearchTTTDCT(ConstructionDetailDTO obj) {

		// Tienth_20180329 Start
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		// Tienth_20180329 END
		Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
		DataListDTO data = constructionBusinessImpl.doSearchTTTDCT(obj, sysGroupId, request);
		return Response.ok(data).build();
	}

	@Override
	public Response doSearchDSTH(ConstructionDetailDTO obj) {

		// Tienth_20180329 Start
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		// Tienth_20180329 END
		Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
		DataListDTO data = constructionBusinessImpl.doSearchDSTH(obj, sysGroupId, request);
		return Response.ok(data).build();
	}

	@Override
	public Response doSearchWorkItem(ConstructionDetailDTO obj) {
		DataListDTO data = constructionBusinessImpl.doSearchWorkItem(obj);
		return Response.ok(data).build();
	}

	@Override
	public Response addWorkItem(WorkItemDetailDTO obj) throws Exception {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");

		try {
			obj.setCreatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setStatus("1");
			obj.setCreatedDate(new Date());
			obj.setCreatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			Long ids = constructionBusinessImpl.addWorkItem(obj);
			if (ids == 0l) {
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				return Response.ok(Response.Status.CREATED).build();
			}
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response exportExcelHm(WorkItemDetailDTO obj) throws Exception {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_EXEL_HM");
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		try {
			String strReturn = constructionBusinessImpl.exportExcelHm(obj);
			Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
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

	@Override
	public Response updateDayHshc(ConstructionDetailDTO obj) throws Exception {
		Long ids;
		try {
			ids = constructionBusinessImpl.updateDayHshc(obj);
			return Response.ok(Response.Status.CREATED).build();
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}

	}

	@Override
	public Response updateWorkItem(WorkItemDetailDTO obj) throws Exception {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		try {
			obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setStatus("1");
			obj.setUpdatedDate(new Date());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			Long ids = constructionBusinessImpl.updateWorkItem(obj);
			if (ids == 0l) {
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				return Response.ok(Response.Status.CREATED).build();
			}
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response remove(ConstructionDetailDTO obj) {
		try {
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			//tanqn 2018 start
			KpiLogDTO objKpiLog = new KpiLogDTO();
	        Date dStart = new Date();
	        objKpiLog.setStartTime(dStart);
	        objKpiLog.setCreateDatetime(dStart);
	        objKpiLog.setFunctionCode("DELETE_CONSTRUCTION");
	        objKpiLog.setDescription("Thông tin công trình");
	        objKpiLog.setTransactionCode(obj.getCode());
	        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setUpdatedDate(new Date());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			constructionBusinessImpl.remove(obj, request);
			Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
			//tanqn 20181113 end
			return Response.ok().build();
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response add(ConstructionDTO obj) throws Exception {
		UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
		// hoanm1_20180305_start
		KttsUserSession s = userRoleBusinessImpl.getUserSession(request);
		//tanqn 20181113 start
		KpiLogDTO objKpiLog = new KpiLogDTO();
		Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("INSERT_CONSTRUCTION");
        objKpiLog.setDescription("Thông tin công trình");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(s.getVpsUserInfo().getSysUserId());
      //tanqn 20181113 end
		// hoanm1_20180305_end
		try {
			// hoanm1_20180305_start
			Long sysUserId = s.getVpsUserInfo().getSysUserId();
			Long sysGroupId = s.getVpsUserInfo().getSysGroupId();
			// hoanm1_20180305_end
			obj.setCreatedUserId(sysUserId);
			obj.setStatus("1");
			obj.setCreatedDate(new Date());
			obj.setCreatedGroupId(sysGroupId);
			// obj.setSysGroupId(objUser.getDeptId().toString());
			obj.setConstructionState("1");
			Long ids = constructionBusinessImpl.add(obj, request);
			// hungnx 07062018 start
			obj.setConstructionId(ids);
			for (UtilAttachDocumentDTO file : obj.getFileLst()) {
				file.setObjectId(ids);
				file.setType(Constants.FILETYPE.CONSTRUCTION);
				file.setDescription(Constants.FileDescription.get(file.getType()));
				file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
				file.setStatus("1");
				file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
				utilAttachDocumentBusinessImpl.save(file);
			}
			// hungnx 07062018 end
			if (ids == 0l) {
				//tanqn 20181113 start
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
              //tanqn 20181113 end
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				// chinhpxn 20180605 start
				String constructionCode = obj.getCode().substring(0, 2);
				if (constructionCode.equalsIgnoreCase("CB") || constructionCode.equalsIgnoreCase("TC")) {
					List<WorkItemDetailDTO> workItemLst = workItemBusinessImpl.doSearchForAutoAdd(constructionCode,
							obj.getCatConstructionTypeId());
					for (WorkItemDetailDTO workItem : workItemLst) {
						workItem.setConstructionId(ids);
						workItem.setConstructorId(Long.parseLong(obj.getSysGroupId()));
						workItem.setSupervisorId(Long.parseLong(obj.getSysGroupId()));
						workItem.setIsInternal("1");
						workItem.setStatus("1");
						workItem.setCode(obj.getCode().trim() + "_" + workItem.getCode());
						addWorkItem(workItem);
					}
				}

				// chinhpxn 20180605 end
				//tanqn 20181113 start
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
              //tanqn 20181113 end
				return Response.ok(Response.Status.CREATED).build();
			}
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}

	}

	@Override
	public Response update(ConstructionDTO obj) throws Exception {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		//tan 20181113 start
		KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("UPDATE_CONSTRUCTION");
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        //tanqn 20181113 end
		try {
			obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setUpdatedDate(new Date());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			Long ids = constructionBusinessImpl.updateConstruction(obj, request);
			if (ids == 0l) {
				//tanqn 20181113 start
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                //tanqn 20181113 end
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				// hungnx 070618 start
				UtilAttachDocumentDTO fileSearch = new UtilAttachDocumentDTO();
				fileSearch.setObjectId(obj.getConstructionId());
				fileSearch.setType(Constants.FILETYPE.CONSTRUCTION);
				List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentBusinessImpl.doSearch(fileSearch);
				if (fileLst != null) {
					for (UtilAttachDocumentDTO file : fileLst) {
						if (file != null) {
							utilAttachDocumentBusinessImpl.delete(file);
						}
					}
				}
				if (obj.getFileLst() != null) {
					for (UtilAttachDocumentDTO file : obj.getFileLst()) {
						file.setObjectId(obj.getConstructionId());
						file.setType(Constants.FILETYPE.CONSTRUCTION);
						file.setDescription(Constants.FileDescription.get(file.getType()));
						file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
						file.setCreatedUserId(obj.getUpdatedUserId());
						file.setStatus("1");
						file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
						utilAttachDocumentBusinessImpl.save(file);
					}
				}
				// hungnx 070618 end
				//tanqn 20181113 start
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                //tanqn 20181113 end
				return Response.ok(Response.Status.CREATED).build();
			}
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response getById(Long id) throws Exception {
		ConstructionDetailDTO data = constructionBusinessImpl.getById(id);
		return Response.ok(data).build();
	}

	@Override
	public Response getAppParamByType(String type) {
		return Response.ok(constructionBusinessImpl.getAppParamByType(type)).build();
	}

	@Override
	public Response updateVuongItem(ObstructedDetailDTO obj) throws Exception {
		// TODO Auto-generated method stub
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		//tanqn 20181113 start
		KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("UPDATE_VƯỚNG_ITEM");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        //tanqn 20181113 end
		try {
			DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
			Date today = new Date();
			Date todayWithZeroTime = formatter.parse(formatter.format(today));
			if (obj.getObstructedId() == null) {
				obj.setCreatedUserId(objUser.getVpsUserInfo().getSysUserId());
				obj.setCreatedDate(todayWithZeroTime);
				obj.setCreatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			} else {
				obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
				obj.setUpdatedDate(new Date());
				obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			}

			ConstructionDetailDTO dto = constructionBusinessImpl.updateVuongItem(obj, objUser.getFullName(),
					objUser.getVpsUserInfo().getSysUserId());
			if (dto.getConstructionId() == null) {
				//tanqn 20181113 start
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                //tanqn 20181113 end
				return Response.ok(dto).build();
			}
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response updateConstrLicence(ConstructionDetailDTO obj) throws Exception {
		// TODO Auto-generated method stub
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		//tanqn 20181113 start
		KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("UPDATE_CONSTRLICENCE");
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		try {
			obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setUpdatedDate(new Date());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			Long ids = constructionBusinessImpl.updateConstrLicence(obj, objUser.getFullName());
			if (ids == 0l) {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.ok(Response.Status.CREATED).build();
			}
			//tanqn 20181113 end
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}

	}

	@Override
	public Response updateConstrDesign(ConstructionDetailDTO obj) throws Exception {
		// TODO Auto-generated method stub
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		//tanqn 20181113 start
		KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("UPDATE_CONSTRDESIGN");
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		try {
			obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setUpdatedDate(new Date());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			Long ids = constructionBusinessImpl.updateConstrDesign(obj, objUser.getFullName());
			if (ids == 0l) {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.ok(Response.Status.CREATED).build();
			}
			//tanqn 20181113 end
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}

	}

	@Override
	public Response updateBGMBItem(ConstructionDetailDTO obj) throws Exception {
		// TODO Auto-generated method stub
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		//tanqn 20181113 start
		KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("UPDATE_CONSTRUCTION_BGMBITEM");
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		try {
			obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setUpdatedDate(new Date());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			Long ids = constructionBusinessImpl.updateBGMBItem(obj, objUser.getFullName());
			if (ids == 0l) {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                //tanqn 20181113 end
				return Response.ok(Response.Status.CREATED).build();
			}
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}

	}

	@Override
	public Response updateStartItem(ConstructionDetailDTO obj) throws Exception {
		// TODO Auto-generated method stub
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("INSERT_DETAIL_MONTH_PLAN");
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		try {
			obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setUpdatedDate(new Date());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			Long ids = constructionBusinessImpl.updateStartItem(obj, objUser.getFullName());
			if (ids == 0l) {
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				return Response.ok(Response.Status.CREATED).build();
			}
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}

	}

	@Override
	public Response updateMerchandiseItem(ConstructionDetailDTO obj) throws Exception {
		// TODO Auto-generated method stub
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		//tanqn 20181113 start
		KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("UPDATE_MERCHANDISE_ITEM");
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		try {
			obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setUpdatedDate(new Date());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			Long ids = constructionBusinessImpl.updateMerchandiseItem(obj, objUser.getFullName());
			if (ids == 0l) {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.ok(Response.Status.CREATED).build();
			}
			//tanqn 20181113 end
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}

	}

	@Override
	public Response updateHSHCItem(ConstructionDetailDTO obj) throws Exception {
		// TODO Auto-generated method stub
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		//tanqn 20181113 start
				KpiLogDTO objKpiLog = new KpiLogDTO();
		        Date dStart = new Date();
		        objKpiLog.setStartTime(dStart);
		        objKpiLog.setCreateDatetime(dStart);
		        objKpiLog.setFunctionCode("UPDATE_HSHC_ITEM");
		        objKpiLog.setDescription("Quản lý HSHC");
		        objKpiLog.setTransactionCode(obj.getCode());
		        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		try {
			obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setUpdatedDate(new Date());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			Long ids = constructionBusinessImpl.updateHSHCItem(obj, objUser.getFullName(), request);
			if (ids == 0l) {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.ok(Response.Status.CREATED).build();
			}
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}

	}

	@Override
	public Response updateDTItem(ConstructionDetailDTO obj) throws Exception {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		//tanqn 20181113 start
		KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("UPDATE_DT_ITEM");
        objKpiLog.setDescription("Quản lý doanh thu");
        objKpiLog.setTransactionCode(obj.getCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		try {
			obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setUpdatedDate(new Date());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			Long ids = constructionBusinessImpl.updateDTItem(obj, objUser.getFullName(),
					objUser.getVpsUserInfo().getSysUserId(), request);
			if (ids == 0l) {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.ok(Response.Status.CREATED).build();
			}
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}

	}

	@Override
	public Response updateDTItemApproved(ConstructionDetailDTO obj) throws Exception {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		//tanqn 20181113 start
				KpiLogDTO objKpiLog = new KpiLogDTO();
		        Date dStart = new Date();
		        objKpiLog.setStartTime(dStart);
		        objKpiLog.setCreateDatetime(dStart);
		        objKpiLog.setFunctionCode("UPDATE_DT_ITEM_APPROVED");
		        objKpiLog.setDescription("Quản lý doanh thu");
		        objKpiLog.setTransactionCode(obj.getCode());
		        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		try {
			obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setUpdatedDate(new Date());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			Long ids = constructionBusinessImpl.updateDTItemApproved(obj, objUser.getFullName(),
					objUser.getVpsUserInfo().getSysUserId(), request);
			if (ids == 0l) {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.ok(Response.Status.CREATED).build();
			}
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response getWorkItemType(Long ida) {
		// TODO Auto-generated method stub
		return Response.ok(constructionBusinessImpl.getWorkItemType(ida)).build();
	}

	@Override
	public Response getConstructionHSHCById(ConstructionTaskDetailDTO obj) throws Exception {

		return Response.ok(constructionBusinessImpl.getConstructionHSHCById(obj)).build();

	}

	// public Response getConstructionHSHCById(ConstructionTaskDetailDTO obj)
	// throws Exception{
	// return
	// Response.ok(constructionBusinessImpl.getConstructionHSHCById(obj)).build();

	// }

	@Override
	public Response getStockStrans(Long id) {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		//tanqn 20181113
		KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_VTTB_MERCHANDISE");
        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
		return Response.ok(constructionBusinessImpl.getStockStrans(id)).build();
	}

	@Override
	public Response saveMerchandise(ConstructionDetailDTO obj) throws Exception {
		try {
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			//tanqn 20181113
			KpiLogDTO objKpiLog = new KpiLogDTO();
	        Date dStart = new Date();
	        objKpiLog.setStartTime(dStart);
	        objKpiLog.setCreateDatetime(dStart);
	        objKpiLog.setFunctionCode("INSERT_MERCHANDISE");
	        objKpiLog.setDescription("Chỉnh sửa thông tin công trình");
	        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
			Long ids = constructionBusinessImpl.saveMerchandise(obj, objUser);
			if (ids == 0l) {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
				return Response.ok(Response.Status.CREATED).build();
			}
			//tanqn 20181113 end
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}

	}

	@Override
	public Response confirmPkx(SynStockTransDTO obj) {
		constructionBusinessImpl.confirmPkx(obj);
		return Response.ok().build();
	}

	@Override
	public Response detaillPhieu(SynStockTransDTO obj) {
		DataListDTO data = constructionBusinessImpl.detaillPhieu(obj);
		return Response.ok(data).build();
	}

	@Override
	public Response exportExcelConstruction(ConstructionDetailDTO obj) throws Exception {
		try {
			KttsUserSession objSec = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			obj.setSysGroupId(objSec.getVpsUserInfo().getSysGroupId().toString());
			String strReturn = constructionBusinessImpl.exportConstruction(obj, request);
			return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
		} catch (Exception e) {
			log.error(e);
		}
		return null;
	}

	@Override
	public Response searchMerchandise(ConstructionDetailDTO obj) {
		DataListDTO data = constructionBusinessImpl.searchMerchandise(obj);
		return Response.ok(data).build();
	}

	// chinhpxn20180620
	@Override
	public Response searchMerchandiseForSave(ConstructionDetailDTO obj) {
		List<ConstructionMerchandiseDTO> data = constructionBusinessImpl.searchMerchandiseForSave(obj);
		return Response.ok(data).build();
	}

	// chinhpxn20180620

	@Override
	public Response getDataSign(Long sysStockId) {
		// TODO Auto-generated method stub
		return Response.ok(constructionBusinessImpl.getDataSign(sysStockId)).build();
	}

	@Override
	public Response NoSerial(CommonDTO dto) throws Exception {
		if (dto != null) {
			return NoSynStockTransDetaill(dto);
		}
		return null;
	}

	private Response NoSynStockTransDetaill(CommonDTO dto) throws Exception {
		if (dto.getObjectId() != null) {
			KttsUserSession objSec = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			ExportPxkDTO data = constructionBusinessImpl.NoSynStockTransDetaill(dto);
			ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
			ClassLoader classloader = Thread.currentThread().getContextClassLoader();
			String reportPath = classloader.getResource("../" + "doc-template").getPath();
			String filePath = reportPath + "/YeuCauCoSerial.jasper";
			JRBeanCollectionDataSource tbl2 = new JRBeanCollectionDataSource(data.getStockList());
			params.put("tbl2", tbl2);
			Format formatter = new SimpleDateFormat("dd");
			String dd = formatter.format(new Date());
			formatter = new SimpleDateFormat("MM");
			String mm = formatter.format(new Date());
			formatter = new SimpleDateFormat("yyyy");
			String yyyy = formatter.format(new Date());
			params.put("mm", mm);
			params.put("dd", dd);
			params.put("year", yyyy);
			params.put("sysGroupName", objSec.getVpsUserInfo().getDepartmentName());
			params.put("totalMonney", data.getTotalMonney());
			if (dto.getNameDVYC() != null) {
				params.put("nameDVYC", dto.getNameDVYC());
			}
			if (dto.getNamePetitioner() != null) {
				params.put("namePetitioner", dto.getNamePetitioner());
			}
			if (dto.getShipper() != null) {
				params.put("shipper", dto.getShipper());
			}

			JasperPrint jasperPrint = JasperFillManager.fillReport(filePath, params, new JREmptyDataSource());
			jasperPrint.addStyle(JasperReportConfig.getNormalStyle(reportPath));
			String pathReturn = generateLocationFile();
			File udir = new File(folderUpload + pathReturn);
			if (!udir.exists()) {
				udir.mkdirs();
			}
			File file = new File(folderUpload + pathReturn + File.separator + "YeuCauCoSerial.docx");
			// JasperExportManager.exportReportToPdfFile(jasperPrint,folderUpload+pathReturn
			// +"KehoachThangChiTiet.pdf");
			JRDocxExporter exporter = new JRDocxExporter();
			exporter.setParameter(JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
			exporter.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
			exporter.setParameter(JRExporterParameter.OUTPUT_FILE, file);
			exporter.exportReport();
			if (file.exists()) {
				ResponseBuilder response = Response.ok(file);
				response.header("Content-Disposition", "attachment; filename=\"" + "YeuCauKhongSerial.docx" + "\"");
				return response.build();
			}
		}
		return null;
	}

	@Override
	public Response YesSerial(CommonDTO dto) throws Exception {
		if (dto != null) {
			return YesSynStockTransDetaill(dto);
		}
		return null;
	}

	private Response YesSynStockTransDetaill(CommonDTO dto) throws Exception {
		if (dto.getObjectId() != null) {
			KttsUserSession objSec = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			ExportPxkDTO data = constructionBusinessImpl.YesSynStockTransDetaill(dto);
			ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
			ClassLoader classloader = Thread.currentThread().getContextClassLoader();
			String reportPath = classloader.getResource("../" + "doc-template").getPath();
			String filePath = reportPath + "/YeuCauCoSerial.jasper";
			JRBeanCollectionDataSource tbl2 = new JRBeanCollectionDataSource(data.getStockList());
			params.put("tbl2", tbl2);
			Format formatter = new SimpleDateFormat("dd");
			String dd = formatter.format(new Date());
			formatter = new SimpleDateFormat("MM");
			String mm = formatter.format(new Date());
			formatter = new SimpleDateFormat("yyyy");
			String yyyy = formatter.format(new Date());
			params.put("mm", mm);
			params.put("dd", dd);
			params.put("year", yyyy);
			params.put("sysGroupName", objSec.getVpsUserInfo().getDepartmentName());
			params.put("totalMonney", data.getTotalMonney());
			if (dto.getNameDVYC() != null) {
				params.put("nameDVYC", dto.getNameDVYC());
			}
			if (dto.getNamePetitioner() != null) {
				params.put("namePetitioner", dto.getNamePetitioner());
			}
			if (dto.getShipper() != null) {
				params.put("shipper", dto.getShipper());
			}
			JasperPrint jasperPrint = JasperFillManager.fillReport(filePath, params, new JREmptyDataSource());
			jasperPrint.addStyle(JasperReportConfig.getNormalStyle(reportPath));
			String pathReturn = generateLocationFile();
			File udir = new File(folderUpload + pathReturn);
			if (!udir.exists()) {
				udir.mkdirs();
			}
			File file = new File(folderUpload + pathReturn + File.separator + "YeuCauCoSerial.docx");
			// JasperExportManager.exportReportToPdfFile(jasperPrint,folderUpload+pathReturn
			// +"KehoachThangChiTiet.pdf");
			JRDocxExporter exporter = new JRDocxExporter();
			exporter.setParameter(JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
			exporter.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
			exporter.setParameter(JRExporterParameter.OUTPUT_FILE, file);
			exporter.exportReport();
			if (file.exists()) {
				ResponseBuilder response = Response.ok(file);
				response.header("Content-Disposition", "attachment; filename=\"" + "YeuCauCoSerial.docx" + "\"");
				return response.build();
			}
		}
		return null;
	}

	private String generateLocationFile() {
		Calendar cal = Calendar.getInstance();
		return File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator + cal.get(Calendar.YEAR)
				+ File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator + cal.get(Calendar.DATE)
				+ File.separator + cal.get(Calendar.MILLISECOND);
	}

	@Override
	public Response getLisCatTask(WorkItemDetailDTO obj) {
		DataListDTO data = constructionBusinessImpl.getListCatTask(obj);
		return Response.ok(data).build();
	}

	@Override
	public Response doSearchPerformer(SysUserDetailCOMSDTO obj) {

		// Tienth_20180329 Start
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");

		// Tienth_20180329 END
		DataListDTO data = constructionBusinessImpl.doSearchPerformer(obj, objUser.getVpsUserInfo().getSysGroupId(),
				request);
		return Response.ok(data).build();
	}

	@Override
	public Response exportConstruction(ConstructionDetailDTO dto) throws Exception {
		// TODO Auto-generated method stub
		//tanqn 20181113 start
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_CONSTRUCTION");
        objKpiLog.setDescription("Xuất EXPORT_CONSTRUCTION");
        objKpiLog.setTransactionCode(dto.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String reportPath = classloader.getResource("../" + "doc-template").getPath();
		String filePath = reportPath + "/HoSoCongTrinh.doc";
		File file = new File(filePath);
		Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
		//tanqn 20181113 end
		return Response.ok(file).build();
	}

	@Override
	public Response downloadFileImportTP() throws Exception {
		try {
			UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
			String strReturn = constructionBusinessImpl.downloadFileImportTP("file-import-thau-phu.xlsx");
			return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
		} catch (Exception e) {
			log.error(e);
		}
		return null;
	}

	// chinhpxn 20180608 start

	@Override
	public Response downloadFile(HttpServletRequest request) throws Exception {
		String filePath = UEncrypt.decryptFileUploadPath(request.getQueryString());

		File file = new File(filePath);
		InputStream ExcelFileToRead = new FileInputStream(filePath);

		if (!file.exists()) {
			file = new File(filePath);
			if (!file.exists()) {
				// logger.warn("File {} is not found", fileName);
				return Response.status(Response.Status.BAD_REQUEST).build();
			}

		}

		XSSFWorkbook wb = new XSSFWorkbook(ExcelFileToRead);
		XSSFSheet sheet = wb.getSheetAt(1);

		CellStyle style = wb.createCellStyle(); // Create new style
		style.setWrapText(true); // Set wordwrap
		style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		style.setBorderTop(HSSFCellStyle.BORDER_THIN);
		style.setBorderRight(HSSFCellStyle.BORDER_THIN);
		style.setBorderLeft(HSSFCellStyle.BORDER_THIN);

		// get data for sheet 1
		List<WorkItemDetailDTO> workItemLst = constructionBusinessImpl.getCatWorkItemType();

		// write susGroup data to excel file
		int rowOrder = 1;
		for (WorkItemDetailDTO obj : workItemLst) {
			if (obj != null) {
				XSSFRow row = sheet.createRow(rowOrder);
				XSSFCell Cell0 = row.createCell(0);
				Cell0.setCellStyle(style);
				Cell0.setCellValue(obj.getCatConstructionTypeName());
				XSSFCell Cell1 = row.createCell(1);
				Cell1.setCellStyle(style);
				Cell1.setCellValue(obj.getName());
				rowOrder++;
			}
		}

		// get data for sheet 2
		sheet = wb.getSheetAt(2);
		List<SysGroupDto> sysGroupLst = constructionBusinessImpl.getSysGroupForImport();
		List<CatPartnerDTO> catPartnerLst = constructionBusinessImpl.getCatPartnerForImport();
		// sysGroup
		rowOrder = 1;
		for (SysGroupDto obj : sysGroupLst) {
			if (obj != null) {
				XSSFRow row = sheet.createRow(rowOrder);
				XSSFCell Cell0 = row.createCell(0);
				Cell0.setCellStyle(style);
				Cell0.setCellValue(obj.getGroupCode());
				XSSFCell Cell1 = row.createCell(1);
				Cell1.setCellStyle(style);
				Cell1.setCellValue(obj.getName());
				XSSFCell Cell2 = row.createCell(2);
				Cell2.setCellStyle(style);
				Cell2.setCellValue(obj.getGroupNameLevel1());
				XSSFCell Cell3 = row.createCell(3);
				Cell3.setCellStyle(style);
				Cell3.setCellValue(obj.getGroupNameLevel2());
				XSSFCell Cell4 = row.createCell(4);
				Cell4.setCellStyle(style);
				Cell4.setCellValue(obj.getGroupNameLevel3());
				rowOrder++;
			}
		}

		// catPartner
		rowOrder = 1;
		for (CatPartnerDTO obj : catPartnerLst) {
			if (obj != null) {
				XSSFRow row = sheet.getRow(rowOrder);
				if (row == null) {
					row = sheet.createRow(rowOrder);
				}
				XSSFCell Cell6 = row.createCell(6);
				Cell6.setCellStyle(style);
				Cell6.setCellValue(obj.getCode());
				XSSFCell Cell7 = row.createCell(7);
				Cell7.setCellStyle(style);
				Cell7.setCellValue(obj.getName());
				rowOrder++;
			}
		}

		// String filePath = UFile.getFilePath(folderTemp,
		// defaultSubFolderUpload);
		FileOutputStream fileOut = new FileOutputStream(file);
		// write this workbook to an Outputstream.
		wb.write(fileOut);
		wb.close();
		fileOut.flush();
		fileOut.close();
		String fileName = file.getName();
		int lastIndex = fileName.lastIndexOf(File.separatorChar);
		String fileNameReturn = fileName.substring(lastIndex + 1);

		return Response.ok((Object) file)
				.header("Content-Disposition", "attachment; filename=\"" + fileNameReturn + "\"").build();
	}

	@Override
	public Response downloadFileForConstruction(HttpServletRequest request) throws Exception {
		String filePath = UEncrypt.decryptFileUploadPath(request.getQueryString());

		File file = new File(filePath);
		InputStream ExcelFileToRead = new FileInputStream(filePath);

		if (!file.exists()) {
			file = new File(filePath);
			if (!file.exists()) {
				// logger.warn("File {} is not found", fileName);
				return Response.status(Response.Status.BAD_REQUEST).build();
			}

		}

		XSSFWorkbook wb = new XSSFWorkbook(ExcelFileToRead);
		XSSFSheet sheet = wb.getSheetAt(1);

		CellStyle style = wb.createCellStyle(); // Create new style
		style.setWrapText(true); // Set wordwrap
		style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		style.setBorderTop(HSSFCellStyle.BORDER_THIN);
		style.setBorderRight(HSSFCellStyle.BORDER_THIN);
		style.setBorderLeft(HSSFCellStyle.BORDER_THIN);

		// get data for sheet 1
		List<ConstructionDetailDTO> constructionTypeLst = constructionBusinessImpl.getCatConstructionTypeForImport();

		// write susGroup data to excel file
		int rowOrder = 1;
		for (ConstructionDetailDTO obj : constructionTypeLst) {
			if (obj != null) {
				XSSFRow row = sheet.createRow(rowOrder);
				XSSFCell Cell0 = row.createCell(0);
				Cell0.setCellStyle(style);
				Cell0.setCellValue(obj.getName());
				rowOrder++;
			}
		}

		List<CatStationDTO> catStationLst = constructionBusinessImpl.getCatStationForImport(request);
		rowOrder = 1;
		int rowOrder1 = 1;
		for (CatStationDTO obj : catStationLst) {
			if (obj != null) {
				if (obj.getType().equals("1")) {
					XSSFRow row = sheet.getRow(rowOrder);
					if (row == null) {
						row = sheet.createRow(rowOrder);
					}
					XSSFCell Cell2 = row.createCell(2);
					Cell2.setCellStyle(style);
					Cell2.setCellValue(obj.getCode());
					rowOrder++;
				} else {
					XSSFRow row = sheet.getRow(rowOrder1);
					if (row == null) {
						row = sheet.createRow(rowOrder1);
					}
					XSSFCell Cell3 = row.createCell(3);
					Cell3.setCellStyle(style);
					Cell3.setCellValue(obj.getCode());
					rowOrder1++;
				}
			}
		}

		List<SysGroupDto> sysGroupLst = constructionBusinessImpl.getSysGroupForImport();
		rowOrder = 1;
		for (SysGroupDto obj : sysGroupLst) {
			if (obj != null) {
				XSSFRow row = sheet.getRow(rowOrder);
				if (row == null) {
					row = sheet.createRow(rowOrder);
				}
				XSSFCell Cell5 = row.createCell(5);
				Cell5.setCellStyle(style);
				Cell5.setCellValue(obj.getGroupCode());
				XSSFCell Cell6 = row.createCell(6);
				Cell6.setCellStyle(style);
				Cell6.setCellValue(obj.getName());
				rowOrder++;
			}
		}

		// get data for sheet 2
		sheet = wb.getSheetAt(2);

		// vung mien
		rowOrder = 1;
		List<AppParamDTO> regionLst = constructionBusinessImpl.getAppParamByType("REGION");
		for (AppParamDTO obj : regionLst) {
			if (obj != null) {
				XSSFRow row = sheet.createRow(rowOrder);
				XSSFCell Cell0 = row.createCell(0);
				Cell0.setCellStyle(style);
				Cell0.setCellValue(obj.getName());
				rowOrder++;
			}
		}

		// loai tuyen
		rowOrder = 1;
		List<AppParamDTO> lineTypeLst = constructionBusinessImpl.getAppParamByType("CONSTRUCTION_LINE_TYPE");
		for (AppParamDTO obj : lineTypeLst) {
			if (obj != null) {
				XSSFRow row = sheet.getRow(rowOrder);
				if (row == null) {
					row = sheet.createRow(rowOrder);
				}
				XSSFCell Cell2 = row.createCell(2);
				Cell2.setCellStyle(style);
				Cell2.setCellValue(obj.getName());
				rowOrder++;
			}
		}

		// loai gpon
		rowOrder = 1;
		List<AppParamDTO> gponTypeLst = constructionBusinessImpl.getAppParamByType("CONSTRUCTION_GPON_TYPE");
		for (AppParamDTO obj : gponTypeLst) {
			if (obj != null) {
				XSSFRow row = sheet.getRow(rowOrder);
				if (row == null) {
					row = sheet.createRow(rowOrder);
				}
				XSSFCell Cell4 = row.createCell(4);
				Cell4.setCellStyle(style);
				Cell4.setCellValue(obj.getName());
				rowOrder++;
			}
		}

		// le
		rowOrder = 1;
		List<AppParamDTO> leLst = constructionBusinessImpl.getAppParamByType("CONSTRUCTION_OTHER_TYPE");
		for (AppParamDTO obj : leLst) {
			if (obj != null) {
				XSSFRow row = sheet.getRow(rowOrder);
				if (row == null) {
					row = sheet.createRow(rowOrder);
				}
				XSSFCell Cell6 = row.createCell(6);
				Cell6.setCellStyle(style);
				Cell6.setCellValue(obj.getName());
				rowOrder++;
			}
		}

		rowOrder = 1;
		List<CatConstructionTypeDTO> catConstructionDeployLst = constructionBusinessImpl.getCatConstructionDeploy();
		for (CatConstructionTypeDTO obj : catConstructionDeployLst) {
			if (obj != null) {
				XSSFRow row = sheet.getRow(rowOrder);
				if (row == null) {
					row = sheet.createRow(rowOrder);
				}
				XSSFCell Cell8 = row.createCell(8);
				Cell8.setCellStyle(style);
				Cell8.setCellValue(obj.getName());
				rowOrder++;
			}
		}

		FileOutputStream fileOut = new FileOutputStream(file);
		// write this workbook to an Outputstream.
		wb.write(fileOut);
		wb.close();
		fileOut.flush();
		fileOut.close();
		String fileName = file.getName();
		int lastIndex = fileName.lastIndexOf(File.separatorChar);
		String fileNameReturn = fileName.substring(lastIndex + 1);

		return Response.ok((Object) file)
				.header("Content-Disposition", "attachment; filename=\"" + fileNameReturn + "\"").build();
	}

	// chinhpxn 20180608 end

	private String writeFileToServer(Attachment attachments, HttpServletRequest request2) {
		// TODO Auto-generated method stub
		String folderParam = UString.getSafeFileName(request.getParameter("folder"));
		if (UString.isNullOrWhitespace(folderParam)) {
			folderParam = defaultSubFolderUpload;
		} else {
			if (!isFolderAllowFolderSave(folderParam)) {
				throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
			}
		}

		DataHandler dataHandler = attachments.getDataHandler();

		// get filename to be uploaded
		MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
		String fileName = UFile.getFileName(multivaluedMap);
		fileName = "file_loi_" + fileName;
		if (!isExtendAllowSave(fileName)) {
			throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
		}
		// write & upload file to server
		try (InputStream inputStream = dataHandler.getInputStream();) {
			return UFile.writeToFileServerATTT2(inputStream, fileName, folderParam, folderUpload);
		} catch (Exception ex) {
			throw new BusinessException("Loi khi save file", ex);
		}
	}

	private boolean isFolderAllowFolderSave(String folderDir) {
		return UString.isFolderAllowFolderSave(folderDir, allowFolderDir);
	}

	private boolean isExtendAllowSave(String fileName) {
		return UString.isExtendAllowSave(fileName, allowFileExt);
	}

	// thauphu
	@Override
	public Response importFileThauPhu(Attachment attachments, HttpServletRequest request) throws Exception {
		String folderParam = UString.getSafeFileName(request.getParameter("folder"));
		String filePathReturn;
		String filePath;
		if (UString.isNullOrWhitespace(folderParam)) {
			folderParam = defaultSubFolderUpload;
		} else {
			if (!isFolderAllowFolderSave(folderParam)) {
				throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
			}
		}

		DataHandler dataHandler = attachments.getDataHandler();

		// get filename to be uploaded
		MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
		String fileName = UFile.getFileName(multivaluedMap);
		fileName = "file_loi_" + fileName;
		if (!isExtendAllowSave(fileName)) {
			throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
		}
		// write & upload file to server
		try (InputStream inputStream = dataHandler.getInputStream();) {
			filePath = UFile.writeToFileServerATTT2(inputStream, fileName, folderParam, folderUpload);
			filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
		} catch (Exception ex) {
			throw new BusinessException("Loi khi save file", ex);
		}

		try {

			try {

				return Response.ok(constructionBusinessImpl.importFileThauPhu(folderUpload + filePath, filePath))
						.build();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
			}

		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	public Response getconstructionStatus(Long id) throws Exception {
		// TODO Auto-generated method stub
		return Response.ok(constructionBusinessImpl.getconstructionStatus(id)).build();

	}

	@Override
	public Response saveThauPhu(ConstructionDetailDTO obj) throws Exception {
		try {
			Long ids = constructionBusinessImpl.saveThauPhu(obj);
			if (ids == 0l) {
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				return Response.ok(Response.Status.CREATED).build();
			}
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response getCatProvinCode(Long id) {
		List<Long> data = constructionBusinessImpl.getCatProvinCode(id);
		return Response.ok(data).build();
	}

	@Override
	public Response cancelThauPhu(ConstructionDetailDTO obj) throws Exception {
		try {
			Long ids = constructionBusinessImpl.cancelThauPhu(obj);
			if (ids == 0l) {
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				return Response.ok(Response.Status.CREATED).build();
			}
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response checkPermissionsApproved(ConstructionDetailDTO obj) {
		try {
			// TODO Auto-generated method stub
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
			return Response.ok(constructionBusinessImpl.checkPermissionsApproved(obj, sysGroupId, request)).build();
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response checkPermissionsCancel(ConstructionDetailDTO obj) {
		try {
			// TODO Auto-generated method stub
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
			return Response.ok(constructionBusinessImpl.checkPermissionsCancel(obj, sysGroupId, request)).build();
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response checkPermissions(ConstructionDetailDTO obj) {
		try {
			// TODO Auto-generated method stub
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
			return Response.ok(constructionBusinessImpl.checkPermissions(obj, sysGroupId, request)).build();
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response checkPermissionsUndo(ConstructionDetailDTO obj) {
		try {
			// TODO Auto-generated method stub
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
			return Response.ok(constructionBusinessImpl.checkPermissionsUndo(obj, sysGroupId, request)).build();
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response check(ConstructionDetailDTO obj) {
		try {
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setUpdatedDate(new Date());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			constructionBusinessImpl.check(obj, request);
			return Response.ok().build();
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response checkAdd(ConstructionDetailDTO obj) {
		try {
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			obj.setUpdatedDate(new Date());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			constructionBusinessImpl.checkAdd(obj, request);
			return Response.ok().build();
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	// chinhpxn 20180605 start
	@Override
	public Response getSysGroupInfo(Long id) {
		return Response.ok(constructionBusinessImpl.getSysGroupInfo(id)).build();
	}

	// chinhpxn 20180605 end

	// Hungnx_05062018_start
	@Override
	public Response reportConstruction(ConstructionDetailDTO obj) {
		//TANQN 20181113 start
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("REPORT_CONSTRUCTION");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Chi tiết thông tin công trình");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		DataListDTO data;
		try {
			data = constructionBusinessImpl.reportConstruction(obj);
			Date dEnd = new Date();
	        objKpiLog.setEndTime(dEnd);
	        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	        objKpiLog.setStatus("1");
	        yearPlanBusinessImpl.addKpiLog(objKpiLog);
			return Response.ok(data).build();
		} catch (IOException e) {
			e.printStackTrace();
			Date dEnd = new Date();
	        objKpiLog.setEndTime(dEnd);
	        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	        objKpiLog.setStatus("0");
	        objKpiLog.setReason(e.toString());
	        yearPlanBusinessImpl.addKpiLog(objKpiLog);
			return Response.status(Status.BAD_REQUEST).build();
		}
	}

	@Override
	public Response exportExcelConstructionReport(ConstructionDetailDTO obj) throws Exception {
		KttsUserSession objUsers = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_EXEL_REPORT_CONSTRUCTION");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setDescription("Chi tiết thông tin công trình");
        objKpiLog.setCreateUserId(objUsers.getVpsUserInfo().getSysUserId());
		try {
			UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
			String strReturn = constructionBusinessImpl.exportConstructionReport(obj, objUser.getUserName());
			Date dEnd = new Date();
	        objKpiLog.setEndTime(dEnd);
	        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	        objKpiLog.setStatus("1");
	        yearPlanBusinessImpl.addKpiLog(objKpiLog);
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

	@Override
	public Response exportPDFConstructionReport(ConstructionDetailDTO criteria) throws Exception {
		KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_PDF_CONSTRUCTION_REPORT");
        objKpiLog.setTransactionCode(criteria.getConstructionCode());
        objKpiLog.setDescription("EXPORT_PDF_CONSTRUCTION_REPORT");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		String strReturn = constructionBusinessImpl.exportPDFConstructionReport(criteria);
		if (strReturn == null) {
			Date dEnd = new Date();
	        objKpiLog.setEndTime(dEnd);
	        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	        objKpiLog.setStatus("0");
	        yearPlanBusinessImpl.addKpiLog(objKpiLog);
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			Date dEnd = new Date();
	        objKpiLog.setEndTime(dEnd);
	        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	        objKpiLog.setStatus("1");
	        yearPlanBusinessImpl.addKpiLog(objKpiLog);
			return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
	}
	}//TANQN 20181113 end

	@Override
	public Response readFileStationReport(Attachment attachments, HttpServletRequest request) {
		List<String> stationCodeLst = null;
		try {
			stationCodeLst = constructionBusinessImpl.readFileStation(attachments);
		} catch (Exception e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		return Response.ok(Collections.singletonMap("stationCodeLst", stationCodeLst)).build();
	}

	// Hungnx_05062018_end

	// chinhpxn 20180607 start

	@Override
	public Response importConstruction(Attachment attachments, HttpServletRequest request) throws Exception {
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		String folderParam = UString.getSafeFileName(request.getParameter("folder"));
		String filePathReturn;
		String filePath;

		if (UString.isNullOrWhitespace(folderParam)) {
			folderParam = defaultSubFolderUpload;
		} else {
			if (!isFolderAllowFolderSave(folderParam)) {
				throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
			}
		}

		DataHandler dataHandler = attachments.getDataHandler();

		// get filename to be uploaded
		MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
		String fileName = UFile.getFileName(multivaluedMap);

		if (!isExtendAllowSave(fileName)) {
			throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
		}

		// write & upload file to server
		try (InputStream inputStream = dataHandler.getInputStream();) {
			filePath = UFile.writeToFileServerATTT(inputStream, fileName, folderParam, folderUpload);
			filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
		} catch (Exception ex) {
			throw new BusinessException("Loi khi save file", ex);
		}

		try {

			try {
				java.util.List<ConstructionDetailDTO> result = constructionBusinessImpl.importConstruction(filePath,
						request);
				//tanqn 20181113 start
				KpiLogDTO objKpiLog = new KpiLogDTO();
		        Date dStart = new Date();
		        objKpiLog.setStartTime(dStart);
		        objKpiLog.setCreateDatetime(dStart);
		        objKpiLog.setFunctionCode("IMPORT_CONSTRUCTION");
		        objKpiLog.setDescription("Thông tin công trình");
		        //objKpiLog.setTransactionCode(obj.getCode());
		        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		        //end
				if (result != null && !result.isEmpty()
						&& (result.get(0).getErrorList() == null || result.get(0).getErrorList().size() == 0)) {
					Long sysUserId = objUser.getVpsUserInfo().getSysUserId();
					Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
					HashMap<String, String> catConstructionTypeMap = new HashMap<String, String>();
					List<ConstructionDetailDTO> catConstructionTypeLst = constructionBusinessImpl
							.getConstructionForImport();
					for (ConstructionDetailDTO obj : catConstructionTypeLst) {
						catConstructionTypeMap.put(obj.getCode().toUpperCase().trim(),
								obj.getConstructionId().toString());
					}
					for (ConstructionDetailDTO obj : result) {
						if (catConstructionTypeMap.get(obj.getCode().toUpperCase().trim()) != null) {
							continue;
						} else {
							obj.setCreatedUserId(sysUserId);
							obj.setCreatedGroupId(sysGroupId);
							obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
							obj.setStatus("1");
							obj.setIsObstructed("0");
							obj.setConstructionState("1");
							try {
								Long id = constructionBusinessImpl.addConstructionForImport(obj);
								catConstructionTypeMap.put(obj.getCode().toUpperCase().trim(), id.toString());

								// chinhpxn 20180605 start
								String constructionCode = obj.getCode().trim().substring(0, 2);
								if (constructionCode.equalsIgnoreCase("CB")
										|| constructionCode.equalsIgnoreCase("TC")) {
									List<WorkItemDetailDTO> workItemLst = workItemBusinessImpl
											.doSearchForAutoAdd(constructionCode, obj.getCatConstructionTypeId());
									for (WorkItemDetailDTO workItem : workItemLst) {
										workItem.setConstructionId(id);
										workItem.setConstructorId(Long.parseLong(obj.getSysGroupId()));
										workItem.setSupervisorId(Long.parseLong(obj.getSysGroupId()));
										workItem.setIsInternal("1");
										workItem.setStatus("1");
										workItem.setCreatedUserId(sysUserId);
										workItem.setCreatedDate(new Date());
										workItem.setCreatedGroupId(sysGroupId);
										workItem.setCode(obj.getCode().trim() + "_" + workItem.getCode());
									}
									constructionBusinessImpl.addWorkItemLst(workItemLst);
								}

								// chinhpxn 20180605 end

							} catch (Exception e) {
								e.printStackTrace();
							}
						}
					}

					return Response.ok(result).build();
				} else if (result == null || result.isEmpty()) {
					//tanqn 20181113 start
					Date dEnd = new Date();
	                objKpiLog.setEndTime(dEnd);
	                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	                objKpiLog.setStatus("0");
	                yearPlanBusinessImpl.addKpiLog(objKpiLog);
					return Response.ok().entity(Response.Status.NO_CONTENT).build();
				} else {
					Date dEnd = new Date();
	                objKpiLog.setEndTime(dEnd);
	                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	                objKpiLog.setStatus("1");
	                yearPlanBusinessImpl.addKpiLog(objKpiLog);
					return Response.ok(result).build();
					//tanqn 20181113 end
				}
			} catch (Exception e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
			}

		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response importWorkItem(Attachment attachments, HttpServletRequest request) throws Exception {
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		String folderParam = UString.getSafeFileName(request.getParameter("folder"));
		String filePathReturn;
		String filePath;

		if (UString.isNullOrWhitespace(folderParam)) {
			folderParam = defaultSubFolderUpload;
		} else {
			if (!isFolderAllowFolderSave(folderParam)) {
				throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
			}
		}

		DataHandler dataHandler = attachments.getDataHandler();

		// get filename to be uploaded
		MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
		String fileName = UFile.getFileName(multivaluedMap);

		if (!isExtendAllowSave(fileName)) {
			throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
		}

		// write & upload file to server
		try (InputStream inputStream = dataHandler.getInputStream();) {
			filePath = UFile.writeToFileServerATTT(inputStream, fileName, folderParam, folderUpload);
			filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
		} catch (Exception ex) {
			throw new BusinessException("Loi khi save file", ex);
		}

		try {

			try {
				java.util.List<WorkItemDetailDTO> result = constructionBusinessImpl.importWorkItemDetail(filePath);
				//tanqn 20181113 start
				KpiLogDTO objKpiLog = new KpiLogDTO();
		        Date dStart = new Date();
		        objKpiLog.setStartTime(dStart);
		        objKpiLog.setCreateDatetime(dStart);
		        objKpiLog.setFunctionCode("IMPORT_WORK_ITEM");
		        objKpiLog.setDescription("Thông tin công trình");
		        //objKpiLog.setTransactionCode(obj.getCode());
		        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
		        //end
				if (result != null && !result.isEmpty()
						&& (result.get(0).getErrorList() == null || result.get(0).getErrorList().size() == 0)) {
					List<WorkItemDetailDTO> workItemImportLst = new ArrayList<WorkItemDetailDTO>();
					// kiem tra hang muc ton tai trong cong trinh
					List<WorkItemDetailDTO> workItemLst = constructionBusinessImpl.getWorkItem();
					HashMap<String, Long> workItemMap = new HashMap<String, Long>();
					for (WorkItemDetailDTO obj : workItemLst) {
						workItemMap.put(obj.getCode() + "|" + obj.getConstructionId(), obj.getWorkItemId());
					}
					for (WorkItemDetailDTO obj : result) {
						if (workItemMap.get(obj.getCode() + "|" + obj.getConstructionId()) != null) {
							continue;
						} else {
							obj.setCreatedUserId(objUser.getVpsUserInfo().getSysUserId());
							obj.setCreatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
							obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
							obj.setStatus("1");
							workItemMap.put(obj.getCode() + "|" + obj.getConstructionId(), -1l);
							workItemImportLst.add(obj);
						}
					}
					try {
						if (!workItemImportLst.isEmpty()) {
							constructionBusinessImpl.addWorkItemLst(workItemImportLst);
						}
					} catch (Exception e) {
						e.printStackTrace();
					}

					return Response.ok(result).build();
				} else if (result == null || result.isEmpty()) {
					Date dEnd = new Date();
	                objKpiLog.setEndTime(dEnd);
	                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	                objKpiLog.setStatus("0");
	                yearPlanBusinessImpl.addKpiLog(objKpiLog);
					return Response.ok().entity(Response.Status.NO_CONTENT).build();
				} else {
					Date dEnd = new Date();
	                objKpiLog.setEndTime(dEnd);
	                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	                objKpiLog.setStatus("1");
	                yearPlanBusinessImpl.addKpiLog(objKpiLog);
					return Response.ok(result).build();
				}
			} catch (Exception e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
			}

		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	// chinhpxn 20180607 end
	//---------Huypq_20181010-start----------
	@Override
	public Response readFileConstruction(Attachment attachments, HttpServletRequest request) {
		List<String> constructionCodeLst = null;
		try {
			constructionCodeLst = constructionBusinessImpl.readFileConstruction(attachments);
		} catch (Exception e) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		return Response.ok(Collections.singletonMap("constructionCodeLst", constructionCodeLst)).build();
	}

	@Override
	public Response downloadFileForConstructionGPXD(HttpServletRequest request) throws Exception {
		String filePath = UEncrypt.decryptFileUploadPath(request.getQueryString());

		File file = new File(filePath);
		if (!file.exists()) {
			file = new File(filePath);
			if (!file.exists()) {
				// logger.warn("File {} is not found", fileName);
				return Response.status(Response.Status.BAD_REQUEST).build();
			}

		}

		String fileName = file.getName();
		int lastIndex = fileName.lastIndexOf(File.separatorChar);
		String fileNameReturn = fileName.substring(lastIndex + 1);

		return Response.ok((Object) file)
				.header("Content-Disposition", "attachment; filename=\"" + fileNameReturn + "\"").build();
	}

	@Override
	public Response importConstructionGPXD(Attachment attachments, HttpServletRequest request) throws Exception {
		//tanqn 20181113 start
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		//end
		String folderParam = UString.getSafeFileName(request.getParameter("folder"));
		String filePathReturn;
		String filePath;

		if (UString.isNullOrWhitespace(folderParam)) {
			folderParam = defaultSubFolderUpload;
		} else {
			if (!isFolderAllowFolderSave(folderParam)) {
				throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
			}
		}

		DataHandler dataHandler = attachments.getDataHandler();

		// get filename to be uploaded
		MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
		String fileName = UFile.getFileName(multivaluedMap);

		if (!isExtendAllowSave(fileName)) {
			throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
		}

		// write & upload file to server
		try (InputStream inputStream = dataHandler.getInputStream();) {
			filePath = UFile.writeToFileServerATTT(inputStream, fileName, folderParam, folderUpload);
			filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
		} catch (Exception ex) {
			throw new BusinessException("Loi khi save file", ex);
		}

		try {

			try {
				java.util.List<ConstructionDetailDTO> result = constructionBusinessImpl
						.importConstructionGPXD(filePath);
				//tanqn 20181113 start
				KpiLogDTO objKpiLog = new KpiLogDTO();
		        Date dStart = new Date();
		        objKpiLog.setStartTime(dStart);
		        objKpiLog.setCreateDatetime(dStart);
		        objKpiLog.setFunctionCode("IMPORT_CONSTRUCTION_GPXD");
		        objKpiLog.setDescription("Thông tin công trình");
		        //objKpiLog.setTransactionCode(obj.getCode());
		        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
				if (result != null && !result.isEmpty()
						&& (result.get(0).getErrorList() == null || result.get(0).getErrorList().size() == 0)) {
					for (ConstructionDetailDTO obj : result) {
						if (obj.getCode() != null) {
							List<ConstructionDetailDTO> constructionCodeLst = constructionBusinessImpl
									.getCheckCodeList(obj);

							if (constructionCodeLst != null) {
								continue;
							}
						}
					}
					return Response.ok(result).build();
				} else if (result == null || result.isEmpty()) {
					Date dEnd = new Date();
	                objKpiLog.setEndTime(dEnd);
	                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	                objKpiLog.setStatus("0");
	                yearPlanBusinessImpl.addKpiLog(objKpiLog);
					return Response.ok().entity(Response.Status.NO_CONTENT).build();
				} else {
					Date dEnd = new Date();
	                objKpiLog.setEndTime(dEnd);
	                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
	                objKpiLog.setStatus("1");
	                yearPlanBusinessImpl.addKpiLog(objKpiLog);
					return Response.ok(result).build();
					//tanqn 20181113 end
				}
			} catch (Exception e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
			}

		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	public Response updateIsBuildingPermit(ConstructionDetailDTO obj) throws Exception {
		Long ids;
		try {
			ids = constructionBusinessImpl.updateIsBuildingPermit(obj);
			return Response.ok(Response.Status.CREATED).build();
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response getCheckCodeList(ConstructionDetailDTO obj) {
		try {
			List<ConstructionDetailDTO> lst = constructionBusinessImpl.getCheckCodeList(obj);
			return Response.ok(Response.Status.CREATED).build();
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}
	//---------Huypq_20181010-end----------
		//TungTT 24/1/2019 start
	@Override
	public Response getDataUpdate(ConstructionDTO obj) { 
			return Response.ok(constructionBusinessImpl.getDataUpdate(obj)).build();
			}
	//TungTT 24/1/2019 start
	@Override
	public Response getStationForAutoComplete(CatStationDTO cons) {
		DataListDTO results = constructionBusinessImpl.getStationForAutoComplete(cons);
		return Response.ok(results).build();
	}

	@Override
	public Response UpdateConstructionTask(ConstructionDTO obj) throws ParseException {
		Long id= constructionBusinessImpl.UpdateConstructionTask(obj);
		if (id == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			return Response.ok(Response.Status.CREATED).build();
		}
		
	}

	//VietNT_20181206_start
	@Override
	public Response getStationHouseForAutoComplete(CatStationDTO criteria) {
		DataListDTO results = constructionBusinessImpl.getStationHouseForAutoComplete(criteria);
		return Response.ok(results).build();
	}

	/**
	 * Filter catStation by catStationHouseId, if criteria don't have catStationHouseId return empty
	 * @param criteria	criteria to search
	 * @return Response
	 */
	@Override
	public Response getStationByStationHouseIdForAutoComplete(CatStationDTO criteria) {
		DataListDTO results;
		if (null != criteria.getCatStationHouseId()) {
			results = constructionBusinessImpl.getStationForAutoComplete(criteria);
			return Response.ok(results).build();
		}
		results = new DataListDTO();
		results.setData(new ArrayList());
		return Response.ok(results).build();
	}
	//VietNT_end
	//Huypq-start
	@Override
	public Response doSearchAcceptance(ConstructionDetailDTO obj) {
		DataListDTO results = constructionBusinessImpl.doSearchAcceptance(obj,request);
		return Response.ok(results).build();
	}
	
	@Override
	public Response listDataDSA(ConstructionDetailDTO obj) {
		return Response.ok(constructionBusinessImpl.listDataDSA(obj)).build();
	}
	@Override
	public Response getWorkItemByMerchandise(ConstructionDetailDTO obj) {
		DataListDTO results = constructionBusinessImpl.getWorkItemByMerchandise(obj);
		return Response.ok(results).build();
	}

	@Override
	public Response getWorkItemByMerchandiseB(ConstructionDetailDTO obj) {
		DataListDTO results = constructionBusinessImpl.getWorkItemByMerchandiseB(obj);
		return Response.ok(results).build();
	}
	
	@Override
	public Response getDataNotIn(ConstructionDetailDTO obj) {
		DataListDTO results = constructionBusinessImpl.getDataNotIn(obj);
		return Response.ok(results).build();
	}
	//Lưu hạng mục của VTA
	@Override
	public Response updateWorkItemMerchan(List<ConstructionMerchandiseDTO> obj) throws Exception {
		return Response.ok(constructionBusinessImpl.updateWorkItemMerchan(obj)).build();
	}

	@Override
	public Long updateConstructionAcceptance(ConstructionDetailDTO obj) {
		Long id = null;
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		Long sysUserId = objUser.getVpsUserInfo().getSysUserId();
		constructionBusinessImpl.updateConstructionAcceptance(obj,sysUserId);
		//Thiết bị B
		if(obj.getListDataMerchandiseTBB()!=null) {
			for(ConstructionDetailDTO objMer : obj.getListDataMerchandiseTBB()) {
				ConstructionMerchandiseDTO merchan = new ConstructionMerchandiseDTO();
				merchan.setConstructionId(obj.getConstructionId());
				merchan.setGoodsCode(objMer.getMaVttb());
				merchan.setGoodsUnitName(objMer.getDonViTinh());
				merchan.setGoodsName(objMer.getTenVttb());
				merchan.setGoodsId(objMer.getGoodsId());
	//			merchan.setWorkItemId(objMer.getWorkItemId());
				merchan.setGoodsIsSerial("1");
				merchan.setQuantity(1D);
				merchan.setType("2");
				merchan.setSerial(objMer.getSerial());
				merchan.setRemainCount((double) 0);
				merchan.setMerEntityId(objMer.getMerEntityId());
				if(null!=objMer.getListDataWorkItemTBB()) {
					for(WorkItemDTO objData : objMer.getListDataWorkItemTBB()) {
						merchan.setWorkItemId(objData.getWorkItemId());
						constructionBusinessImpl.updateMerchandise(merchan);
					}
				} else {
					constructionBusinessImpl.updateMerchandise(merchan);
				}
				
			}
		}
		
		//Thiết bị A
		if(obj.getListDataMerchandise()!=null) {
			for(ConstructionDetailDTO objMer : obj.getListDataMerchandise()) {
				ConstructionMerchandiseDTO merchan = new ConstructionMerchandiseDTO();
				merchan.setConstructionId(obj.getConstructionId());
				merchan.setGoodsCode(objMer.getMaVttb());
				merchan.setGoodsUnitName(objMer.getDonViTinh());
				merchan.setGoodsName(objMer.getTenVttb());
				merchan.setGoodsId(objMer.getGoodsId());
	//			merchan.setWorkItemId(objMer.getWorkItemId());
				merchan.setQuantity(1D);
				merchan.setType("1");
				merchan.setGoodsIsSerial("1");
				merchan.setSerial(objMer.getSerial());
				merchan.setRemainCount((double) 0);
				merchan.setMerEntityId(objMer.getMerEntityId());
				if(null!=objMer.getListDataWorkItem()) {
					for(WorkItemDTO objData : objMer.getListDataWorkItem()) {
						merchan.setWorkItemId(objData.getWorkItemId());
						id = constructionBusinessImpl.updateMerchandise(merchan);
					}
				} else {
					id = constructionBusinessImpl.updateMerchandise(merchan);
				}
				
			}
		}
		return id;
	}
	
	@Override
	public void deleteConstructionMerchanse(ConstructionDetailDTO obj){
		constructionBusinessImpl.deleteConstructionMerchanse(obj);
	}
	//Lưu hạng mục của VTB
	@Override
	public Response updateWorkItemMerchanB(List<ConstructionMerchandiseDTO> obj) throws Exception {
		return Response.ok(constructionBusinessImpl.updateWorkItemMerchanB(obj)).build();
	}
	@Override
	public Response getSynStockTransBySerial(ConstructionDetailDTO obj) {
		return Response.ok(constructionBusinessImpl.getSynStockTransBySerial(obj)).build();
	}
	
	@Override
	public Response getWorkItemByConsId(ConstructionDetailDTO obj) {
		DataListDTO results = constructionBusinessImpl.getWorkItemByConsId(obj);
		return Response.ok(results).build();
	}
	
	@Override
	public Response getConstructionAcceptanceByConsId(ConstructionDetailDTO obj){
		return Response.ok(constructionBusinessImpl.getConstructionAcceptanceByConsId(obj)).build();
	}
	
	@Override
	public Response getConstructionAcceptanceByConsIdCheck(ConstructionDetailDTO obj){
		return Response.ok(constructionBusinessImpl.getConstructionAcceptanceByConsIdCheck(obj)).build();
	}
	
	@Override
	public Response getConstructionAcceptanceByConsIdTBB(ConstructionDetailDTO obj){
		return Response.ok(constructionBusinessImpl.getConstructionAcceptanceByConsIdTBB(obj)).build();
	}
//	@Override
//	public Response getDataMerByGoodsId(ConstructionDetailDTO obj){
//		return Response.ok(constructionBusinessImpl.getDataMerByGoodsId(obj)).build();
//	}
	@Override
    public Response getSysGroupCheck(DepartmentDTO obj) {
        return Response.ok(constructionBusinessImpl.getSysGroupCheck(obj,request)).build();
    }
	//Huypq-end

}