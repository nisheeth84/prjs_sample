package com.viettel.aio.rest;

import com.viettel.aio.bo.CntContractBO;
import com.viettel.aio.business.CntContractBusinessImpl;
import com.viettel.aio.business.CntContractOrderBusinessImpl;
import com.viettel.aio.dao.CntConstrWorkItemTaskDAO;
import com.viettel.aio.dto.*;
import com.viettel.cat.constant.Constants;
import com.viettel.coms.business.KpiLogBusinessImpl;
import com.viettel.coms.business.UtilAttachDocumentBusinessImpl;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.util.ParamUtils;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @author hailh10
 */

public class CntContractRsServiceImpl implements CntContractRsService {

	@Context
	HttpServletRequest request;
	protected final Logger log = Logger.getLogger(CntContractRsService.class);
	@Autowired
	CntContractBusinessImpl cntContractBusinessImpl;
	@Autowired
	CntContractOrderBusinessImpl CntContractOrderBusinessImpl;
		
	@Autowired
	UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl;
	@Autowired
	private UserRoleBusinessImpl userRoleBusinessImpl;
	@Autowired
	private CntConstrWorkItemTaskDAO cntConstrWorkItemTaskDAO;

	@Autowired
	private KpiLogBusinessImpl kpiLogBusinessImpl;
	@Value("${folder_upload2}")
	private String folderUpload;

	@Value("${folder_upload}")
	private String folderTemp;
	
	@Override
	public Response doSearch(CntContractDTO obj) {
		
		// HuyPq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_CONTRACT);
//		if(obj.getContractType() == 0)
//			kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT.toString()));
//		else
//			kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end
		
		List<CntContractDTO> ls = cntContractBusinessImpl.doSearch(obj);
		if (ls == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			DataListDTO data = new DataListDTO();
			data.setData(ls);
			data.setTotal(obj.getTotalRecord());
			data.setSize(ls.size());
			data.setStart(1);
			//huypq-start
//			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//			kpiLogDTO.setTransactionCode(obj.getKeySearch());
//			kpiLogDTO.setStatus("1");
//			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.ok(data).build();
			//huy-end
		}
	}
	
	@Override
	public Response doSearchForReport(CntContractReportDTO obj) {
		
		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_RP_SUM_CONTRACT_OUT);
		kpiLogDTO.setDescription(
				Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.RP_SUM_CONTRACT_OUT.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end
		
		List<CntContractReportDTO> ls = cntContractBusinessImpl.doSearchForReport(obj);
		if (ls == null) {
			kpiLogDTO.setStatus("0");
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			DataListDTO data = new DataListDTO();
			data.setData(ls);
			data.setTotal(obj.getTotalRecord());
			data.setSize(ls.size());
			data.setStart(1);
			//huypq-start
			Long id=0l;
			try {
				id=(long)ls.size();
				} catch(Exception e) {
					kpiLogDTO.setReason(e.toString());
				}
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			kpiLogDTO.setTransactionCode(obj.getKeySearch());
			if (id == 0l) {
				kpiLogDTO.setStatus("0");
				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				kpiLogDTO.setStatus("1");
				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.ok(data).build();
			}
			//huy-end
		}
	}

	@Override
	public Response getById(Long id) {
		CntContractDTO obj = (CntContractDTO) cntContractBusinessImpl
				.getById(id);
		if (obj == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			return Response.ok(obj).build();
		}
	}
//hienvd: COMMENT 7/9/2019
	@Override
	public Response update(CntContractDTO obj) {
		
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_CONTRACT);
		if(obj.getContractType() == 0)
			kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT.toString()));
		else
			kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN.toString()));	
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		//hienvd: COMMENT UPDATE CONTRACTION
		CntContractDTO originObj = (CntContractDTO) cntContractBusinessImpl
				.getOneById(obj.getCntContractId());
		obj.setUpdatedUserId(objUser.getSysUserId());
		obj.setUpdatedGroupId(Long.parseLong(objUser.getVpsUserInfo().getPath().split("/")[1]));
		if (originObj == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			Long id = 0l;
			try {
				if (!obj.getCode().equalsIgnoreCase(originObj.getCode())) {
					CntContractDTO check = cntContractBusinessImpl.findByCode(obj);
					if (check != null) {
						return Response.status(Response.Status.CONFLICT).build();
					} else {
						id = doUpdate(obj, originObj);
					}
				} else {
					id = doUpdate(obj, originObj);
				}
			} catch(Exception e) {
				kpiLogDTO.setReason(e.toString());
			}
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			kpiLogDTO.setTransactionCode(obj.getCode());
			if (id == 0l) {
				kpiLogDTO.setStatus("0");
				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				kpiLogDTO.setStatus("1");
				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.ok(obj).build();
			}
		}
	}

	private Long doUpdate(CntContractDTO obj, CntContractDTO oldObj) {
		obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
		CntContractOrderDTO criteria = new CntContractOrderDTO();
		criteria.setCntContractId(obj.getCntContractId());
		List<CntContractOrderDTO> oldLst = CntContractOrderBusinessImpl.doSearch(criteria);
		if(oldLst != null)
			for(CntContractOrderDTO po : oldLst){
				if(po!=null){
					CntContractOrderBusinessImpl.delete(po);
				}
			}
		
		List<PurchaseOrderDTO> order = obj.getPurchaseOrderLst();
		if(order != null)
			for(PurchaseOrderDTO po : order){
				if(po!=null){
					CntContractOrderDTO cntOrd = new CntContractOrderDTO();
					cntOrd.setCntContractId(obj.getCntContractId());
					cntOrd.setPurchaseOrderId(po.getPurchaseOrderId());
					CntContractOrderBusinessImpl.save(cntOrd);
				}
			}
			
		UtilAttachDocumentDTO fileSearch = new UtilAttachDocumentDTO();
		fileSearch.setObjectId(obj.getCntContractId());
		if(obj.getContractType() == 0)
			fileSearch.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_OUT);
		else if(obj.getContractType() == 1)
			fileSearch.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_IN);
		else if(obj.getContractType() == 7)
			fileSearch.setType("HTCT_DR");
		else if(obj.getContractType() == 8)
			fileSearch.setType("HTCT_DV");
		List <UtilAttachDocumentDTO> fileLst =utilAttachDocumentBusinessImpl.doSearch(fileSearch);
		if(fileLst != null)
			for(UtilAttachDocumentDTO file : fileLst){
				if(file != null){
					utilAttachDocumentBusinessImpl.delete(file);
				}
			}
		
		if(obj.getFileLst() != null)
			for(UtilAttachDocumentDTO file : obj.getFileLst()){
				file.setObjectId(obj.getCntContractId());
				
				if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_OUT);
				else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_IN);
				else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT);
				else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN);
				else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
					file.setType(Constants.FILETYPE.CONTRACT_MATERIAL);
				else if(obj.getContractType()==7l)
					file.setType("HTCT_DR");
				else if(obj.getContractType()==8l)
					file.setType("HTCT_DV");
				file.setDescription(Constants.FileDescription.get(file.getType()));
				file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
				file.setCreatedUserId(obj.getUpdatedUserId());
				file.setStatus("1");
				utilAttachDocumentBusinessImpl.save(file);
			}
		return cntContractBusinessImpl.update(obj);
//		if (id == 0l) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(obj).build();
//		}
	}

	@Override
	public Response add(CntContractDTO obj) {
		
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_CONTRACT);
		if(obj.getContractType() == 0) {
			kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT.toString()));
			obj.setSynState(1L);
		} else
			kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Date());
		
		CntContractDTO existing = (CntContractDTO) cntContractBusinessImpl
				.findByCode(obj);
		Long id = 0l;
		if (existing != null) {
			return Response.status(Response.Status.CONFLICT).build();
		} else {
			try{
				HttpServletRequest test = request;
			boolean check = test == null;
			System.out.println(check);
			obj.setCreatedUserId(objUser.getSysUserId());
			obj.setCreatedGroupId(Long.parseLong(objUser.getVpsUserInfo().getPath().split("/")[1]));
			obj.setStatus(1L);
			obj.setState(1L);
			obj.setContractType(10L);
			obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
			id = cntContractBusinessImpl.save(obj);
			obj.setCntContractId(id);
			List<PurchaseOrderDTO> order = obj.getPurchaseOrderLst();
			for(PurchaseOrderDTO po : order){
				if(po!=null){
					CntContractOrderDTO cntOrd = new CntContractOrderDTO();
					cntOrd.setCntContractId(obj.getCntContractId());
					cntOrd.setPurchaseOrderId(po.getPurchaseOrderId());
					CntContractOrderBusinessImpl.save(cntOrd);
				}
			}

			for(UtilAttachDocumentDTO file : obj.getFileLst()){
				file.setObjectId(id);
				if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_OUT);
				else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_IN);
				else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT);
				else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN);
				else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
					file.setType(Constants.FILETYPE.CONTRACT_MATERIAL);
				else if(obj.getContractType()==7l)
					file.setType("HTCT_DR");
				else if(obj.getContractType()==8l)
					file.setType("HTCT_DV");
				file.setDescription(Constants.FileDescription.get(file.getType()));
				file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
				file.setStatus("1");
				utilAttachDocumentBusinessImpl.save(file);
			}
			obj.setCntContractId(id);
			}catch(Exception e){
				kpiLogDTO.setReason(e.toString());
				e.printStackTrace();
			}
			
			kpiLogDTO.setEndTime(new Date());
			kpiLogDTO.setTransactionCode(obj.getCode());
			
			if (id == 0l) {
				kpiLogDTO.setStatus("0");
				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				kpiLogDTO.setStatus("1");
				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.ok(obj).build();
			}
			
		}
	}

	@Override
	public Response delete(CntContractDTO cnt) {
		
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_CONTRACT);
		if(cnt.getContractType() == 0)
			kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT.toString()));
		else
			kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		
		CntContractDTO obj = (CntContractDTO) cntContractBusinessImpl
				.getOneById(cnt.getCntContractId());

		if (obj == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			obj.setUpdatedUserId(objUser.getSysUserId());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
			obj.setStatus(0L);
			obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
			Long id = 0l;
			try {
				id = cntContractBusinessImpl.update(obj);
			} catch(Exception e) {
				kpiLogDTO.setReason(e.toString());
			}
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			kpiLogDTO.setTransactionCode(obj.getCode());
			if (id == 0l) {
				kpiLogDTO.setStatus("0");
			} else {
				kpiLogDTO.setStatus("1");
			}
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.ok(Response.Status.NO_CONTENT).build();
		}
	}

	@Override
	public Response deleteList(List<Long> ids) {
		String result = cntContractBusinessImpl.delete(ids,
				CntContractBO.class.getName(), "CNT_CONTRACT_ID");

		if (result == ParamUtils.SUCCESS) {
			return Response.ok().build();
		} else {
			return Response.status(Response.Status.EXPECTATION_FAILED).build();
		}
	}

	@Override
	public Response findByAutoComplete(CntContractDTO obj) {
		List<CntContractDTO> results = cntContractBusinessImpl
				.getForAutoComplete(obj);
		if (obj.getIsSize()) {
			CntContractDTO moreObject = new CntContractDTO();
			moreObject.setCntContractId(0l);
			;
			results.add(moreObject);
		}
		return Response.ok(results).build();
	}
//	hoanm1_20180303_start
	@Override
	public Response getForAutoComplete(CntContractDTO obj) {
		List<CntContractDTO> results = cntContractBusinessImpl.getForAutoCompleteMap(obj);
		return Response.ok(results).build();
	}
	
	@Override
	public Response getForAutoCompleteKTTS(CntContractDTO obj) {
		List<CntContractDTO> results = cntContractBusinessImpl.getForAutoCompleteKTTS(obj);
		return Response.ok(results).build();
	}
	
	@Override
	public Response mapContract(CntContractDTO obj) {
		//Huypq-20190927-start
		Boolean checkRoleMap = cntContractBusinessImpl.checkMapContract(request);
		if(!checkRoleMap) {
			return Response.status(Response.Status.CONFLICT).build();
		}
		//Huy-end
		// Huypq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.MAP_CONTRACT);
		kpiLogDTO.setDescription(
				Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// Huypq-end
		
		/**hoangnh start 03012019 start**/
		String result =null;
		CntContractDTO constract = cntContractBusinessImpl.getIdConstract(obj.getCode());
		//nếu công trình đã map, xóa các bản ghi trong bảng CNT_CONSTR_WORK_ITEM_TASK
		cntContractBusinessImpl.removeTask(constract.getCntContractId());
		//list tạo mới trên pm xây lắp
		List<CntConstrWorkItemTaskDTO> lstTaskA = cntContractBusinessImpl.getDetailById(constract.getCntContractId());
		//list đồng bộ từ chủ đầu tư
		List<CntConstrWorkItemTaskDTO> lstTaskB = cntContractBusinessImpl.getDetailById(obj.getCntContractMapId());
		Map<Long,Long> map = new HashMap<Long,Long>();
		for(CntConstrWorkItemTaskDTO dto : lstTaskA){
			map.put(dto.getConstructionId(), dto.getCntContractId());
		}
		for(CntConstrWorkItemTaskDTO dto : lstTaskB){
			if(!map.containsKey(dto.getConstructionId())){
				dto.setSynStatus("1");
				dto.setCntContractId(constract.getCntContractId());
				dto.setUpdatedDate(null);
				dto.setCreatedDate(new Date());
				cntConstrWorkItemTaskDAO.saveObject(dto.toModel());
			}
		}
		try{
			cntContractBusinessImpl.updateCodeCnt(obj);
			result = cntContractBusinessImpl.updateCodeKtts(obj);
			if(result.equals("Success")){
				if(StringUtils.isNotEmpty(constract.getContractCodeKtts())){
					cntContractBusinessImpl.updateStatusKtts(constract.getContractCodeKtts());
				}
			}
		} catch(Exception e) {
			kpiLogDTO.setReason(e.toString());
		}
		kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
		kpiLogDTO.setTransactionCode(obj.getCntContractParentCode());
		if (!result.equals("Success")) {
			kpiLogDTO.setStatus("0");
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			kpiLogDTO.setStatus("1");
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.ok(obj).build();
		}
		/**hoangnh start 03012019 end**/
	}
	
	@Override
	public Response getListContract(CntContractDTO obj) {
		List<CntContractDTO> ls = cntContractBusinessImpl.getListContract(obj);
		if (ls == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			DataListDTO data = new DataListDTO();
			data.setData(ls);
			data.setTotal(ls.size());
			data.setSize(ls.size());
			data.setStart(1);
			return Response.ok(data).build();
		}
	}
	
	@Override
	public Response getListContractKTTS(CntContractDTO obj) {
		List<CntContractDTO> ls = cntContractBusinessImpl.getListContractKTTS(obj);
		if (ls == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			DataListDTO data = new DataListDTO();
			data.setData(ls);
			data.setTotal(ls.size());
			data.setSize(ls.size());
			data.setStart(1);
			return Response.ok(data).build();
		}
	}
//	hoanm1_20180303_end

	@SuppressWarnings("rawtypes")
	@Override
	public ContractInformationDTO getCntInformation(CntContractDTO contractId) {
		return cntContractBusinessImpl.getCntInformation(contractId.getCntContractId());
	}
	
//	chinhpxn_20180712_start
	@Override
	public Response exportContractProgress(CntContractReportDTO criteria) throws Exception {
		
		// HuyPQ-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.EXPORT_RP_SUM_CONTRACT_OUT);
		kpiLogDTO.setDescription(
				Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.RP_SUM_CONTRACT_OUT.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end
		
		criteria.setPage(null);
		criteria.setPageSize(null);
		List<CntContractReportDTO> ls = cntContractBusinessImpl.doSearchForReport(criteria);
		if (ls == null) {
			kpiLogDTO.setStatus("0");
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {

			String fileNameEncrypt = cntContractBusinessImpl.exportExcelTemplate(criteria.getFileNameCntProgress());
			String fileName = UEncrypt.decryptFileUploadPath(fileNameEncrypt);
			File file = new File(folderTemp + File.separatorChar + fileName);
			if (!file.exists()) {
				file = new File(folderUpload + File.separatorChar + fileName);
				if (!file.exists()) {
					kpiLogDTO.setStatus("0");
					return Response.status(Response.Status.BAD_REQUEST).build();
				}
			}
			XSSFWorkbook  wb = new XSSFWorkbook (new FileInputStream(file));
//			fill sheet general
			XSSFSheet sheet = wb.getSheetAt(0);
			int begin = 11;
			XSSFRow rowDate = sheet.getRow(4);
			XSSFCell cellDate = rowDate.createCell(0);
			SimpleDateFormat formater = new SimpleDateFormat("dd/MM/yyyy");
			String curDate = formater.format(new Date());
			XSSFCellStyle style = wb.createCellStyle();
			cellDate.setCellStyle(style);
			style.setAlignment(HorizontalAlignment.CENTER);
			cellDate.setCellValue("Ngày lập báo cáo: "+ curDate);
			for (int i = 0; i < ls.size(); i++) {
				XSSFRow row = sheet.createRow(begin);
				XSSFCell cellSTT = row.createCell(0);
				cellSTT.setCellStyle(style);
				cellSTT.setCellValue(begin - 10);
				XSSFCell cellCode = row.createCell(1);
				cellCode.setCellValue(ls.get(i).getCode());
				XSSFCell cellPrice = row.createCell(2);
				cellPrice.setCellValue(ls.get(i).getPrice());
				XSSFCell cellSignDate = row.createCell(3);
				if(ls.get(i).getSignDate()!=null) {
					cellSignDate.setCellValue(formater.format(ls.get(i).getSignDate()));
				}
				XSSFCell cellNumDay = row.createCell(4);
				cellNumDay.setCellValue(ls.get(i).getNumDay()!=null?ls.get(i).getNumDay():0);
				XSSFCell cellStartTime = row.createCell(5);
				if(ls.get(i).getStartTime() != null) {
					cellStartTime.setCellValue(formater.format(ls.get(i).getStartTime()));
				}
				XSSFCell cellEndTime = row.createCell(6);
				if(ls.get(i).getEndTime() != null) {
					cellEndTime.setCellValue(formater.format(ls.get(i).getEndTime()));
				}
				XSSFCell cellState = row.createCell(7);
				Long state = ls.get(i).getState();
				if(state != null) {
					if(state == 1) {
						cellState.setCellValue("Đúng tiến độ");
					} else {
						cellState.setCellValue("Chậm tiến độ");
					}
				}
				
				XSSFCell cellStatus = row.createCell(8);
				Long status = ls.get(i).getStatus();
				if(status != null) {
					if(status == 0 ) {
						cellStatus.setCellValue("Đã hủy");
					} else if (status == 1) {
						cellStatus.setCellValue("Đang thực hiện");
					} else {
						cellStatus.setCellValue("Đã thanh lý");
					}
				}
				
				XSSFCell cellStatusTC = row.createCell(9);
				Long statusTC = ls.get(i).getStatusTC();
				if(statusTC != null) {
					if(statusTC == 0) {
						cellStatusTC.setCellValue("Đang thực hiện");
					} else {
						cellStatusTC.setCellValue("Hoàn thành");
					}
				}
				
				XSSFCell cellStatusHSHC = row.createCell(10);
				Long statusHSHC = ls.get(i).getStatusHSHC();
				if(statusHSHC != null) {
					if(statusHSHC == 0) {
						cellStatusHSHC.setCellValue("Thiếu HSHC");
					} else {
						cellStatusHSHC.setCellValue("Đủ HSHC");
					}
				}
				
				XSSFCell cellStatusDT = row.createCell(11);
				Long statusDT = ls.get(i).getStatusDT();
				if(statusDT != null) {
					if(statusDT == 0) {
						cellStatusDT.setCellValue("Tồn doanh thu");
					} else {
						cellStatusDT.setCellValue("Đã lên doanh thu");
					}
				}
				
				XSSFCell cellNumStation = row.createCell(12);
				cellNumStation.setCellValue(ls.get(i).getNumStation()!=null?ls.get(i).getNumStation():0);
				XSSFCell cellQuantityChuaTC = row.createCell(13);
				cellQuantityChuaTC.setCellValue(ls.get(i).getQuantityChuaTC());
				XSSFCell cellPriceChuaTC = row.createCell(14);
				cellPriceChuaTC.setCellValue(ls.get(i).getPriceChuaTC());
				XSSFCell cellQuantityTCdodang = row.createCell(15);
				cellQuantityTCdodang.setCellValue(ls.get(i).getQuantityTCdodang());
				XSSFCell cellPriceTCdodang = row.createCell(16);
				cellPriceTCdodang.setCellValue(ls.get(i).getPriceTCdodang());
				XSSFCell cellQuantityTCxong = row.createCell(17);
				cellQuantityTCxong.setCellValue(ls.get(i).getQuantityTCxong());
				XSSFCell cellPriceTCxong = row.createCell(18);
				cellPriceTCxong.setCellValue(ls.get(i).getPriceTCxong());
				XSSFCell cellQuantityTCHuy = row.createCell(19);
				cellQuantityTCHuy.setCellValue(ls.get(i).getQuantityHuy());
				XSSFCell cellPriceTCHuy = row.createCell(20);
				cellPriceTCHuy.setCellValue(ls.get(i).getPriceHuy());
				XSSFCell cellTotalPriceSL = row.createCell(21);
				cellTotalPriceSL.setCellValue(ls.get(i).getTotalPriceSL());
				XSSFCell cellPriceSLdieuchinh = row.createCell(22);
				cellPriceSLdieuchinh.setCellValue(ls.get(i).getPriceSLdieuchinh());
				XSSFCell cellQuantityCoHSHC = row.createCell(23);
				cellQuantityCoHSHC.setCellValue(ls.get(i).getQuantityCoHSHC());
				XSSFCell cellPriceCoHSHC = row.createCell(24);
				cellPriceCoHSHC.setCellValue(ls.get(i).getPriceCoHSHC());
				XSSFCell cellQuantityChuaCoHSHC = row.createCell(25);
				cellQuantityChuaCoHSHC.setCellValue(ls.get(i).getQuantityChuaCoHSHC());
				XSSFCell cellPriceChuaCoHSHC = row.createCell(26);
				cellPriceChuaCoHSHC.setCellValue(ls.get(i).getPriceChuaCoHSHC());
				XSSFCell cellQuantityDaQT = row.createCell(27);
				cellQuantityDaQT.setCellValue(ls.get(i).getQuantityDaQT());
				XSSFCell cellPriceDaQT = row.createCell(28);
				cellPriceDaQT.setCellValue(ls.get(i).getPriceDaQT());
				XSSFCell cellQuantityChuaQT = row.createCell(29);
				cellQuantityChuaQT.setCellValue(ls.get(i).getQuantityChuaQT());
				XSSFCell cellPriceChuaQT = row.createCell(30);
				cellPriceChuaQT.setCellValue(ls.get(i).getPriceChuaQT());
				XSSFCell cellQuantityLDT = row.createCell(31);
				cellQuantityLDT.setCellValue(ls.get(i).getQuantityLDT());
				XSSFCell cellPriceLDT = row.createCell(32);
				cellPriceLDT.setCellValue(ls.get(i).getPriceLDT());
				XSSFCell cellQuantityChuaLDT = row.createCell(33);
				cellQuantityChuaLDT.setCellValue(ls.get(i).getQuantityChuaLDT());
				XSSFCell cellPriceChuaLDT = row.createCell(34);
				cellPriceChuaLDT.setCellValue(ls.get(i).getPriceChuaLDT());
				XSSFCell cellSLdodang = row.createCell(35);
				cellSLdodang.setCellValue(ls.get(i).getSlDoDang());
				begin++;
			}
			FileOutputStream fileOut = new FileOutputStream(file);
			wb.write(fileOut);
			wb.close();
			fileOut.flush();
			fileOut.close();
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			kpiLogDTO.setTransactionCode(null);
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.ok(Collections.singletonMap("fileName", fileNameEncrypt)).build();
		}
	}
//	chinhpxn20180712_end
	
	//Huypq-20181114-start
		@Override
		public Response getForAutoCompleteContract(CntContractDTO obj) {	
			DataListDTO results = cntContractBusinessImpl.getForAutoCompleteContract(obj);
			return Response.ok(results).build();
		}

		@Override
		public Response doSearchContractOut(CntContractDTO obj) {
			DataListDTO results = cntContractBusinessImpl.doSearchContractOut(obj);
			return Response.ok(results).build();
		}
		//Huypq-20181114-end

		//Huypq-20190612-start
		@Override
		public Response checkDeleteContractOS() {
			if (!cntContractBusinessImpl.checkDeleteContractOS(request)) {
				return Response.ok().entity(Collections.singletonMap("error", "error")).build();
			} else {
				return Response.ok(Response.Status.OK).build();
			}
		}
		
		@Override
		public Response doSearchContractXNXD(ManageQuantityConsXnxdDTO obj) {
			DataListDTO results = cntContractBusinessImpl.doSearchContractXNXD(obj);
			return Response.ok(results).build();
		}

		@Override
		public Response getDataContractTaskXNXD(ManageQuantityConsXnxdDTO obj) {
			DataListDTO results = cntContractBusinessImpl.getDataContractTaskXNXD(obj);
			return Response.ok(results).build();
		}

		@Override
		public Response getDataQuantityByDate(ManageQuantityConsXnxdDTO obj) {
			// TODO Auto-generated method stub
			return Response.ok(cntContractBusinessImpl.getDataQuantityByDate(obj)).build();
		}

		@Override
		public Response updateQuantityCons(ManageQuantityConsXnxdDTO obj) {
			Long id = cntContractBusinessImpl.updateQuantityCons(obj);
			if(id==null) {
				return Response.ok(Response.Status.BAD_REQUEST).build();
			} else {
				return Response.ok(id).build();
			}
		}
		
		@Override
		public Response doSearchRevenueXnxd(ManageRevenueConsXnxdDTO obj) {
			DataListDTO results = cntContractBusinessImpl.doSearchRevenueXnxd(obj);
			return Response.ok(results).build();
		}
		
		@Override
		public Response updateRevenueCons(ManageRevenueConsXnxdDTO obj) {
			try {
				Long id = cntContractBusinessImpl.updateRevenueCons(obj);
				if(id==null) {
					return Response.ok(Response.Status.BAD_REQUEST).build();
				} else {
					return Response.ok(id).build();
				}
			} catch (BusinessException e) {
				return Response.ok().entity(Collections.singletonMap("error", e)).build();
			}
		}
		
		@Override
		public Response saveRevenueCons(ManageRevenueConsXnxdDTO obj) {
			try {
				Long id = cntContractBusinessImpl.saveRevenueCons(obj);
				if(id==null) {
					return Response.ok(Response.Status.BAD_REQUEST).build();
				} else {
					return Response.ok(id).build();
				}
			} catch (BusinessException e) {
				return Response.ok().entity(Collections.singletonMap("error", e)).build();
			}
		}
		
		@Override
		public Response exportQuantityConsXnxd(ManageQuantityConsXnxdDTO obj) {
			try {
	            String strReturn = cntContractBusinessImpl.exportQuantityConsXnxd(obj);
	            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
	        } catch (Exception e) {
	            log.error(e);
	        }
	        return null;
		}
		
		@Override
		public Response exportRevenueConsXnxd(ManageRevenueConsXnxdDTO obj) {
			try {
	            String strReturn = cntContractBusinessImpl.exportRevenueConsXnxd(obj);
	            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
	        } catch (Exception e) {
	            log.error(e);
	        }
	        return null;
		}
		
		@Override
		public Response doSearchReportQuantity(ManageQuantityConsXnxdDTO obj) {
			DataListDTO results = cntContractBusinessImpl.doSearchReportQuantity(obj);
			return Response.ok(results).build();
		}
		
		@Override
		public Response doSearchReportRevenue(ManageRevenueConsXnxdDTO obj) {
			DataListDTO results = cntContractBusinessImpl.doSearchReportRevenue(obj);
			return Response.ok(results).build();
		}
		
		@Override
		public Response doSearchQuantityRevenue(ManageQuantityConsXnxdDTO obj) {
			DataListDTO results = cntContractBusinessImpl.doSearchQuantityRevenue(obj);
			return Response.ok(results).build();
		}
		
		@Override
		public Response exportQuantityRevenueConsXnxd(ManageQuantityConsXnxdDTO obj) {
			try {
	            String strReturn = cntContractBusinessImpl.exportQuantityRevenueConsXnxd(obj);
	            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
	        } catch (Exception e) {
	            log.error(e);
	        }
	        return null;
		}
		//Huy-end

}
