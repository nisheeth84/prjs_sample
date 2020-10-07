package com.viettel.coms.business;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFCreationHelper;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import com.sun.org.omg.CORBA.ParDescriptionSeqHelper;
import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.bo.WorkItemBO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dao.WorkItemDAO;
import com.viettel.coms.dto.CNTContractDTO;
import com.viettel.coms.dto.CatCommonDTO;
import com.viettel.coms.dto.CommonDTO;
import com.viettel.coms.dto.ConstructionStationWorkItemDTO;
import com.viettel.coms.dto.ObstructedDetailDTO;
import com.viettel.coms.dto.SynStockTransDTO;
import com.viettel.coms.dto.SynStockTransDetailDTO;
import com.viettel.coms.dto.SynStockTransDetailSerialDTO;
import com.viettel.coms.dto.SysUserRequest;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.coms.dto.WorkItemDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.coms.dto.WorkItemDetailDTORequest;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.coms.utils.PermissionUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
import com.viettel.utils.DateTimeUtils;
import com.viettel.utils.ImageUtil;

import fr.opensagres.xdocreport.utils.StringUtils;

@Service("workItemBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class WorkItemBusinessImpl extends BaseFWBusinessImpl<WorkItemDAO, WorkItemDTO, WorkItemBO>
		implements WorkItemBusiness {

	@Autowired
	private WorkItemDAO workItemDAO;
	@Value("${folder_upload2}")
	private String folder2Upload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;
	@Autowired
	UtilAttachDocumentDAO utilAttachDocumentDAO;
	@Autowired
	ConstructionTaskBusinessImpl constructionBusiness;

	public WorkItemBusinessImpl() {
		tModel = new WorkItemBO();
		tDAO = workItemDAO;
	}

	@Override
	public WorkItemDAO gettDAO() {
		return workItemDAO;
	}

	@Override
	public long count() {
		return workItemDAO.count("WorkItemBO", null);
	}

	public DataListDTO doSearch(WorkItemDetailDTO obj) {
		List<WorkItemDetailDTO> ls = workItemDAO.doSearch(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public WorkItemDetailDTO getById(WorkItemDetailDTO obj) {
		WorkItemDetailDTO data = workItemDAO.getWorkItemById(obj);
		// List<WorkItemDetailDTO> listWorkItem =
		// workItemDAO.getListWorkItemByConsId(obj.getConstructionId());
		// data.setListWorkItem(listWorkItem);
		return data;
	}

	public DataListDTO doSearchComplete(WorkItemDetailDTO obj) {
		List<WorkItemDetailDTO> ls = workItemDAO.doSearchComplete(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public DataListDTO doSearchQuantity(WorkItemDetailDTO obj, HttpServletRequest request) {
		List<WorkItemDetailDTO> ls = new ArrayList<WorkItemDetailDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty()) {
			ls = workItemDAO.doSearchQuantity(obj, groupIdList);
		}
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public DataListDTO doSearchCompleteDate(WorkItemDetailDTO obj) {
		List<WorkItemDetailDTO> ls = workItemDAO.doSearchCompleteDate(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public List<WorkItemDetailDTO> doSearchForAutoAdd(String tab, Long catConstructionTypeId) {
		return workItemDAO.doSearchForAutoAdd(tab, catConstructionTypeId);
	}

	public Long addWorkItem(WorkItemDetailDTO obj) {
		Long id = 1L;
		if (obj.getWorkItemTypeList() != null) {
			for (CatCommonDTO dto : obj.getWorkItemTypeList()) {
				if (!checkCode(obj.getConstructionCode() + "_" + dto.getCode(), null)) {
					obj.setCode(obj.getConstructionCode() + "_" + dto.getCode());
					obj.setConstructionId(obj.getConstructionId());
					obj.setCatWorkItemTypeId(dto.getId());
					obj.setName(dto.getName());
					obj.setCatWorkItemGroupId(dto.getCatWorkItemGroupId());
					workItemDAO.saveObject(obj.toModel());
				}
			}
		}
		return id;
	}

	public boolean checkCode(String code, Long id) {
		return workItemDAO.checkCode(code, id);
	}

	public void remove(WorkItemDetailDTO obj) throws Exception {
		// TODO Auto-generated method stub
		Long id = workItemDAO.findSignState(obj.getWorkItemId());
		if ("1".equals(obj.getStatus()) && id == -1) {
			workItemDAO.delete(obj.toModel());
		} else if (id == 0) {
			throw new IllegalArgumentException("Không thể xóa do hạng mục đã tồn tại trong kế hoạch tháng!");
		} else
			throw new IllegalArgumentException("Không thể xóa do hạng mục đã tồn tại trong kế hoạch tháng!");
	}

	public DataListDTO doSearchCovenant(CNTContractDTO obj) {
		List<CNTContractDTO> ls = workItemDAO.doSearchCovenant(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public DataListDTO doSearchContractInput(CNTContractDTO obj) {
		List<CNTContractDTO> ls = workItemDAO.doSearchContractInput(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public void approveWorkItem(WorkItemDetailDTO obj, HttpServletRequest request) {
		// String statusConstruction=obj.getStatusConstruction();
		// int convertStatus=Integer.parseInt(statusConstruction);
		// if
		// (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
		// Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
		// throw new IllegalArgumentException(
		// "Bạn không có quyền xác nhận");
		// }
		// if (!VpsPermissionChecker.checkPermissionOnDomainData(
		// Constant.OperationKey.APPROVED,
		// Constant.AdResourceKey.CONSTRUCTION_PRICE,
		// obj.getCatProvinceId(), request)) {
		// throw new IllegalArgumentException(
		// "Bạn không có quyền xác nhận cho đơn vị này")
		// ;
		// }
		// chinhpxn20180719_start
		KttsUserSession user = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
//		hoanm1_20181113_comment_start
//		if (obj.getApproveCompleteDate() != null && obj.getApproveCompleteValue() != null) {
//			workItemDAO.approveQuantityWorkItem(obj);
//			workItemDAO.approveStatusWorkItem(obj);
//			if (obj.getOldQuantity() != null) {
//				if (obj.getOldQuantity() * 1000000 != obj.getQuantity()) {
//					workItemDAO.createSendSmsEmail(obj, user, 1l);
//					workItemDAO.createSendSmsEmailToOperator(obj, user, 1l);
//				}
//			}
//		} else {
			workItemDAO.approveQuantityWorkItem(obj);
			workItemDAO.approveWorkItem(obj);
			workItemDAO.approveRpQuantity(obj);
			if (obj.getOldQuantity() != null) {
				if (obj.getOldQuantity() * 1000000 != obj.getQuantity()) {
					workItemDAO.createSendSmsEmail(obj, user, 1l);
					workItemDAO.createSendSmsEmailToOperator(obj, user, 1l);
				}
			}
//		}
//			hoanm1_20181113_comment_end
	}

	public void approveCompleteWorkItem(WorkItemDetailDTO obj, HttpServletRequest request) {
		// String statusConstruction=obj.getStatusConstruction();
		// int convertStatus=Integer.parseInt(statusConstruction);
		// if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.UNDO,
		// Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
		// throw new IllegalArgumentException(
		// "Bạn không có quyền xác nhận");
		// }
		// if (!VpsPermissionChecker.checkPermissionOnDomainData(
		// Constant.OperationKey.UNDO,
		// Constant.AdResourceKey.CONSTRUCTION_PRICE,
		// obj.getCatProvinceId(), request)) {
		// throw new IllegalArgumentException(
		// "Bạn không có quyền xác nhận cho đơn vị này")
		// ;
		// }
		KttsUserSession user = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		if (obj.getApproveCompleteDate() != null && obj.getApproveCompleteValue() != null) {
			workItemDAO.approveQuantityWorkItem(obj);
			workItemDAO.approveStatusWorkItem(obj);
			if (obj.getOldQuantity() != null) {
				if (obj.getOldQuantity() * 1000000 != obj.getQuantity()) {
					workItemDAO.createSendSmsEmail(obj, user, 1l);
					workItemDAO.createSendSmsEmailToOperator(obj, user, 1l);
				}
			}
		} else {
			workItemDAO.approveQuantityWorkItem(obj);
			workItemDAO.approveWorkItem(obj);
			
			if (obj.getOldQuantity() != null) {
				if (obj.getOldQuantity() * 1000000 != obj.getQuantity()) {
					workItemDAO.createSendSmsEmail(obj, user, 1l);
					workItemDAO.createSendSmsEmailToOperator(obj, user, 1l);
				}
			}
		}
	}

	public Long checkPermissionsApproved(WorkItemDetailDTO obj, Long sysGroupId, HttpServletRequest request) {

		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
			throw new IllegalArgumentException("Bạn không có quyền xác nhận");
		}
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, obj.getCatProvinceId(), request)) {
			throw new IllegalArgumentException("Bạn không có quyền xác nhận cho trạm/tuyến này");
		}
		try {
			return 0l;
		} catch (Exception e) {
			return 1l;
		}
	}

	public Long checkPermissionsCancelConfirm(WorkItemDetailDTO obj, Long sysGroupId, HttpServletRequest request) {

		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.UNDO, Constant.AdResourceKey.CONSTRUCTION_PRICE,
				request)) {
			throw new IllegalArgumentException("Bạn không có quyền hủy xác nhận");
		}
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.UNDO,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, obj.getCatProvinceId(), request)) {
			throw new IllegalArgumentException("Bạn không có quyền hủy xác nhận cho trạm/tuyến này");
		}
		try {
			return 0l;
		} catch (Exception e) {
			return 1l;
		}
	}

	public void saveCancelConfirmPopup(WorkItemDetailDTO obj, HttpServletRequest request) {
		// if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.UNDO,
		// Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
		// throw new IllegalArgumentException(
		// "Bạn không có quyền xác nhận");
		// }
		// if (!VpsPermissionChecker.checkPermissionOnDomainData(
		// Constant.OperationKey.UNDO,
		// Constant.AdResourceKey.CONSTRUCTION_PRICE,
		// obj.getCatProvinceId(), request)) {
		// throw new IllegalArgumentException(
		// "Bạn không có quyền xác nhận cho đơn vị này")
		// ;
		// }

		// chinhpxn20180719_start
		KttsUserSession user = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		// chinhpxn20180719_end
		String statusConstruction = obj.getStatusConstruction();
		int convertStatus = Integer.parseInt(statusConstruction);
		if (convertStatus == 5) {
			workItemDAO.saveCancelConfirmStatusConstructionPopup(obj);
			workItemDAO.saveCancelConfirmPopup(obj);
			workItemDAO.rejectRpQuantity(obj);
			// chinhpxn20180719_start
			workItemDAO.createSendSmsEmail(obj, user, 0l);
			workItemDAO.createSendSmsEmailToOperator(obj, user, 0l);
			// chinhpxn20180719_end
		} else{
		workItemDAO.saveCancelConfirmPopup(obj);
		workItemDAO.rejectRpQuantity(obj);
		// chinhpxn20180719_start
		workItemDAO.createSendSmsEmail(obj, user, 0l);
		workItemDAO.createSendSmsEmailToOperator(obj, user, 0l);
		// chinhpxn20180719_end
		}
	}

	public DataListDTO doSearchDeliveryBill(SynStockTransDTO obj) {
		List<SynStockTransDTO> ls = workItemDAO.doSearchDeliveryBill(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public DataListDTO doSearchForReport(WorkItemDetailDTO obj) {
		List<WorkItemDetailDTO> ls = workItemDAO.doSearchForReport(obj);

		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public DataListDTO doSearchEntangled(ObstructedDetailDTO obj) {
		List<ObstructedDetailDTO> ls = workItemDAO.doSearchEntangled(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public DataListDTO doSearchDetailForReport(WorkItemDetailDTO obj) {
		List<WorkItemDetailDTO> ls = workItemDAO.doSearchDetailForReport(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public String exportCompleteProgress(WorkItemDetailDTO obj) throws Exception {
		// WorkItemDetailDTO obj = new WorkItemDetailDTO();
		obj.setPage(1L);
		obj.setPageSize(100);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Danhsachhoanthanh.xlsx"));
		XSSFWorkbook workbook = new XSSFWorkbook(file);
		file.close();
		Calendar cal = Calendar.getInstance();
		String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
				+ File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
				+ File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
				+ cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
				+ cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		File udir = new File(uploadPath);
		if (!udir.exists()) {
			udir.mkdirs();
		}
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "Danhsachhoanthanh.xlsx");
		List<WorkItemDetailDTO> data = workItemDAO.reportCompleteProgress(obj);
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
			// HuyPQ-22/08/2018-start
			XSSFCellStyle styleCenter = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleCenter.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			int i = 2;
			for (WorkItemDetailDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getCode() != null) ? dto.getCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getCatWorkItemTypeName() != null) ? dto.getCatWorkItemTypeName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getConstructorName() != null) ? dto.getConstructorName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getSupervisorName() != null) ? dto.getSupervisorName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue(getStatusForHoanThanh(dto.getStatus()));
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getCompleteDate() != null) ? dto.getCompleteDate() : null);
				cell.setCellStyle(styleCenter);

				// thiếu quantity

			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Danhsachhoanthanh.xlsx");
		return path;
	}

	private String getStatusForHoanThanh(String status) {
		// TODO Auto-generated method stub
		if (status != null) {
			if ("1".equals(status)) {
				return "Chưa thực hiện ";
			} else if ("2".equals(status)) {
				return "Đang thực hiện";
			} else if ("3".equals(status)) {
				return "Đã hoàn thành";
			}
		}
		return "";
	}

	// START SERVICE MOBILE
	public List<ConstructionStationWorkItemDTO> getNameWorkItem(ConstructionStationWorkItemDTO request) {
		List<ConstructionStationWorkItemDTO> lst = workItemDAO.getNameWorkItem(request);
		return lst;
	}

	public List<ConstructionStationWorkItemDTO> getNameCatTask(ConstructionStationWorkItemDTO request) {
		List<ConstructionStationWorkItemDTO> lst = workItemDAO.getNameCatTask(request);
		return lst;
	}

	public List<WorkItemDetailDTO> getListWorkItemByUser(SysUserRequest request) {

		return workItemDAO.getListWorkItemByUser(request);
	}

	public int updateWorkItem(WorkItemDetailDTORequest request) {
		// hoanm1_20181012_start
		Double statusWorkItem = workItemDAO.avgStatusWorkItem(request.getWorkItemDetailDto().getWorkItemId());
		if (statusWorkItem == 4.0) {
			if (workItemDAO.updateWorkItem(request) > 0) {
				Double res = workItemDAO.avgStatus(request.getWorkItemDetailDto().getConstructionId());
				if (res == 3.0) {
					workItemDAO.updateConstructionComplete(request.getWorkItemDetailDto().getConstructionId());
					return 1;
				}
				// chinhpxn20180720_start
				Long sysUserId = request.getSysUserRequest().getSysUserId();
				String sysGroupId = request.getSysUserRequest().getSysGroupId();
				workItemDAO.createSendSmsEmailForMobile(request.getWorkItemDetailDto(), sysUserId, sysGroupId);
				// chinhpxn20180720_end
				return 2;
			}
			return -1;
		} else {
			return 1;
		}

	}
	// hoanm1_20181012_end

	public List<ConstructionImageInfo> getListImageByWorkItem(WorkItemDetailDTORequest request) {
		return workItemDAO.getImageByWorkItem(request);
	}

	// END SERVICE MOBILE

	public DataListDTO GoodsListTable(SynStockTransDetailDTO obj) {
		List<SynStockTransDetailDTO> ls = workItemDAO.GoodsListTable(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public DataListDTO GoodsListDetail(SynStockTransDetailSerialDTO obj) {
		List<SynStockTransDetailSerialDTO> ls = workItemDAO.GoodsListDetail(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public Long updateInConstruction(WorkItemDetailDTO obj) {
		// TODO Auto-generated method stub
		return workItemDAO.updateInConstruction(obj);
	}

	public Long removeFillterWorkItem(List<String> workItemDetailList, String approveDescription,
			HttpServletRequest request) {
		// if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.UNDO,
		// Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
		// throw new IllegalArgumentException(
		// "Bạn không có quyền hủy xác nhận");
		// }

		// chinhpxn20180719_start
		KttsUserSession user = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
		// chinhpxn20180719_end

		try {
			workItemDAO.removeFillterWorkItemByListId(workItemDetailList, approveDescription);
//			hoanm1_20181116_start
			workItemDAO.rejectListRpQuantity(workItemDetailList);
//			hoanm1_20181116_end
			// chinhpxn20180719_start
			List<WorkItemDetailDTO> workItemLst = workItemDAO.getWorkItemLstFromIdLst(workItemDetailList);
			for (WorkItemDetailDTO obj : workItemLst) {
				workItemDAO.createSendSmsEmail(obj, user, 0l);
				workItemDAO.createSendSmsEmailToOperator(obj, user, 0l);
			}
			// chinhpxn20180719_end
			return 1l;
		} catch (Exception e) {
			return 0l;
		}
	}

	public String exportCovenantProgress(CNTContractDTO obj) throws Exception {
		// WorkItemDetailDTO obj = new WorkItemDetailDTO();
		obj.setPage(null);
		obj.setPageSize(null);
		InputStream file = null;
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		List<CNTContractDTO> data = null;
		if (obj.getType() == 1) {
			file = new BufferedInputStream(new FileInputStream(filePath + "export_hopdong_daura.xlsx"));
			data = workItemDAO.doSearchContractInput(obj);
		} else if (obj.getType() == 0) {
			file = new BufferedInputStream(new FileInputStream(filePath + "export_hopdong_dauvao.xlsx"));
			data = workItemDAO.doSearchCovenant(obj);
		}

		XSSFWorkbook workbook = new XSSFWorkbook(file);
		file.close();
		Calendar cal = Calendar.getInstance();
		String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
				+ File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
				+ File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
				+ cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
				+ cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		File udir = new File(uploadPath);
		if (!udir.exists()) {
			udir.mkdirs();
		}
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "export_hopdong.xlsx");
		// DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-17/08/2018-edit-start
			XSSFCellStyle styleCurrency = ExcelUtils.styleNumber(sheet);
			styleCurrency.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			// HuyPQ-17/08/2018-edit-end
			// HuyPQ-22/08/2018-edit-start
			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			int i = 2;
			for (CNTContractDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getCode() != null) ? dto.getCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getName() != null) ? dto.getName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getPartnerName() != null) ? dto.getPartnerName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getSignDate() != null) ? dto.getSignDate() : null);
				cell.setCellStyle(styleDate);
				if (obj.getType().intValue() == 0) {
					cell = row.createCell(6, CellType.NUMERIC);
					cell.setCellValue((dto.getPrice() != null) ? dto.getPrice() : 0);
					cell.setCellStyle(styleCurrency);
					cell = row.createCell(7, CellType.STRING);
					cell.setCellValue((dto.getOrderName() != null) ? dto.getOrderName() : "");
					cell.setCellStyle(style);
					cell = row.createCell(8, CellType.STRING);
					cell.setCellValue(getStatusForCovenant(dto.getStatus()));
					cell.setCellStyle(style);
				}
				if (obj.getType().intValue() == 1) {
					cell = row.createCell(6, CellType.STRING);
					cell.setCellValue((dto.getOutContract() != null) ? dto.getOutContract() : " ");
					cell.setCellStyle(style);
					cell = row.createCell(7, CellType.NUMERIC);
					cell.setCellValue((dto.getPrice() != null) ? dto.getPrice() : 0);
					cell.setCellStyle(styleCurrency);
					cell = row.createCell(8, CellType.STRING);
					cell.setCellValue(getStatusForCovenant(dto.getStatus()));
					cell.setCellStyle(style);
				}

				// thiếu quantity

			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "export_hopdong.xlsx");
		return path;
	}

	private String getStatusForCovenant(Long status) {
		// TODO Auto-generated method stub
		if (status != null) {
			if ("1".equals(status.toString())) {
				return "Đang thực hiện ";
			} else if ("2".equals(status.toString())) {
				return "Đã nghiệm thu";
			} else if ("3".equals(status.toString())) {
				return "Đã thanh toán";
			} else if ("4".equals(status.toString())) {
				return "Đã thanh lý";
			} else if ("0".equals(status.toString())) {
				return "Đã hủy";
			}
		}
		return "";
	}

	public WorkItemDetailDTO getListImageById(CommonDTO obj) throws Exception {
		// TODO Auto-generated method stub
		WorkItemDetailDTO data = new WorkItemDetailDTO();
		List<Long> listConstructionTaskId = new ArrayList<Long>();
		if (obj.getTableName() == "KPI_LOG_MOBILE") {
			listConstructionTaskId = workItemDAO.getListConstructionTask(obj.getTableId(), obj.getTableName());
		} else {
			listConstructionTaskId = workItemDAO.getListConstructionTask(obj.getTableId(), obj.getTableName());
		}
		if (listConstructionTaskId != null) {
			List<UtilAttachDocumentDTO> listImage = utilAttachDocumentDAO.getListImageWorkItemId(listConstructionTaskId,
					44L);
			if (listImage != null && !listImage.isEmpty()) {
				for (UtilAttachDocumentDTO dto : listImage) {
					dto.setBase64String(ImageUtil
							.convertImageToBase64(folder2Upload + UEncrypt.decryptFileUploadPath(dto.getFilePath())));
				}
			}
			data.setListImage(listImage);
		}
		return data;
	}

	public WorkItemDetailDTO getListImageWorkItemId(Long id) throws Exception {
		WorkItemDetailDTO data = new WorkItemDetailDTO();
		List<Long> listConstructionTaskId = new ArrayList<Long>();
		listConstructionTaskId.add(id);
		if (listConstructionTaskId != null) {
			List<UtilAttachDocumentDTO> listImage = utilAttachDocumentDAO.getListImageWorkItemId(listConstructionTaskId,
					44L);
			if (listImage != null && !listImage.isEmpty()) {
				for (UtilAttachDocumentDTO dto : listImage) {
					dto.setBase64String(ImageUtil
							.convertImageToBase64(folder2Upload + UEncrypt.decryptFileUploadPath(dto.getFilePath())));
				}
			}
			data.setListImage(listImage);
		}
		return data;
	}

	public String exportWorkItemServiceTask(WorkItemDetailDTO obj, HttpServletRequest request) throws Exception {
		obj.setPage(1L);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Export_sanluong.xlsx"));
		XSSFWorkbook workbook = new XSSFWorkbook(file);
		file.close();
		Calendar cal = Calendar.getInstance();
		String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
				+ File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
				+ File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
				+ cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
				+ cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		File udir = new File(uploadPath);
		if (!udir.exists()) {
			udir.mkdirs();
		}
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "Export_sanluong.xlsx");
		List provinceListId = PermissionUtils.getListIdInDomainData(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<WorkItemDetailDTO> data = new ArrayList<WorkItemDetailDTO>();
		if (provinceListId != null && !provinceListId.isEmpty()) {
			data = workItemDAO.doSearchQuantity(obj, provinceListId);
		}
		//
		List<WorkItemDetailDTO> dataSheet2 = workItemDAO.getDataSheetTwoExcel(obj,provinceListId);
		//
		XSSFSheet sheet = workbook.getSheetAt(0);
		if ((data != null && !data.isEmpty()) || (dataSheet2 != null && !dataSheet2.isEmpty())) { // huy-edit
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-17/08/2018-edit-start
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.00"));
			XSSFCellStyle styleNumber2 = ExcelUtils.styleNumber(sheet);
			styleNumber2.setDataFormat(workbook.createDataFormat().getFormat("0"));
			// HuyPQ-17/08/2018-edit-end
			// HuyPQ-22/08/2018-edit-start
			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			styleDate.setAlignment(HorizontalAlignment.CENTER);
			int i = 2;
			int j = 5;
			int m = 3;
			WorkItemDetailDTO objCount = null;
			for (WorkItemDetailDTO dto : data) {
				if (i == 2) {
					objCount = dto;
				}
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getDateComplete() != null) ? dto.getDateComplete() : "");
				cell.setCellStyle(styleDate);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getConstructorName() != null) ? dto.getConstructorName() : "");
				cell.setCellStyle(style);
				// hoanm1_20181011_start
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getConstructorName1() != null) ? dto.getConstructorName1() : "");
				cell.setCellStyle(style);
				// hoanm1_20181011_end
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getCatstationCode() != null) ? dto.getCatstationCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getName() != null) ? dto.getName() : "");
				cell.setCellStyle(style);
				// HuyPQ-17/08/2018-edit-start
				cell = row.createCell(7, CellType.NUMERIC);
				cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
				cell.setCellStyle(styleNumber);
				// HuyPQ-17/08/2018-edit-end
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue(getStringForStatus(dto.getStatus()));
				cell.setCellStyle(style);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue((dto.getCatProvinceCode() != null) ? dto.getCatProvinceCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getPerformerName() != null) ? dto.getPerformerName() : "");
				cell.setCellStyle(style);
				// HuyPQ-22/08/2018-edit-start
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue((dto.getCompleteDate() != null) ? dto.getCompleteDate() : null);
				cell.setCellStyle(styleDate);
				// HuyPQ-end
			}
			//

			//
			Row row = sheet.createRow(i++);
			Cell cell = row.createCell(1, CellType.STRING);
			cell.setCellValue(objCount == null ? 0 : objCount.getCountDateComplete());
			cell.setCellStyle(styleNumber);
			Cell cellCat = row.createCell(4, CellType.STRING);
			cellCat.setCellValue(objCount == null ? 0 : objCount.getCountCatstationCode());
			cellCat.setCellStyle(styleNumber);
			Cell cellConstr = row.createCell(5, CellType.STRING);
			cellConstr.setCellValue(objCount == null ? 0 : objCount.getCountConstructionCode());
			cellConstr.setCellStyle(styleNumber);
			Cell cellWI = row.createCell(6, CellType.STRING);
			cellWI.setCellValue(objCount == null ? 0 : objCount.getCountWorkItemName());
			cellWI.setCellStyle(styleNumber);
			Cell cellQ = row.createCell(7, CellType.STRING);
			cellQ.setCellValue(objCount == null ? "0" : numberFormat(objCount.getTotalQuantity()));
			cellQ.setCellStyle(styleNumber);
			// Huypq-20181105-start
			for (int k = 0; k < 1; k++) {

				XSSFSheet createSheet = workbook.getSheetAt(1);

				for (WorkItemDetailDTO dto : dataSheet2) {
					if (dto.getDeployType().equals("0")) {
						Row row2 = createSheet.createRow(m++);
						Cell cell2 = row2.createCell(0, CellType.STRING);
						cell2 = row2.createCell(1, CellType.STRING);
						cell2.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
						cell2.setCellStyle(style);
						cell2 = row2.createCell(2, CellType.STRING);
						cell2.setCellValue((dto.getFillCatProvince() != null) ? dto.getFillCatProvince() : "");
						cell2.setCellStyle(style);
						cell2 = row2.createCell(3, CellType.STRING);
						cell2.setCellValue((dto.getCatProvinceCode() != null) ? dto.getCatProvinceCode() : "");
						cell2.setCellStyle(style);
						cell2 = row2.createCell(4, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemName() != null) ? dto.getWorkItemName() : "");
						cell2.setCellStyle(style);
						cell2 = row2.createCell(5, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemPartDay() != null) ? dto.getWorkItemPartDay() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(6, CellType.STRING);
						cell2.setCellValue((dto.getQuantityPartDay() != null) ? dto.getQuantityPartDay() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(7, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemConsDay() != null) ? dto.getWorkItemConsDay() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(8, CellType.STRING);
						cell2.setCellValue((dto.getQuantityConsDay() != null) ? dto.getQuantityConsDay() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(9, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemSumDay() != null) ? dto.getWorkItemSumDay() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(10, CellType.STRING);
						cell2.setCellValue((dto.getQuantitySumDay() != null) ? dto.getQuantitySumDay() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(11, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemPartMonth() != null) ? dto.getWorkItemPartMonth() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(12, CellType.STRING);
						cell2.setCellValue((dto.getQuantityPartMonth() != null) ? dto.getQuantityPartMonth() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(13, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemConsMonth() != null) ? dto.getWorkItemConsMonth() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(14, CellType.STRING);
						cell2.setCellValue((dto.getQuantityConsMonth() != null) ? dto.getQuantityConsMonth() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(15, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemSumMonth() != null) ? dto.getWorkItemSumMonth() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(16, CellType.STRING);
						cell2.setCellValue((dto.getQuantitySumMonth() != null) ? dto.getQuantitySumMonth() : 0);
						cell2.setCellStyle(styleNumber);
					} else {
						Row row2 = createSheet.createRow(j++);
						Cell cell2 = row2.createCell(0, CellType.STRING);
						cell2.setCellValue("" + (j - 5));
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(1, CellType.STRING);
						cell2.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
						cell2.setCellStyle(style);
						cell2 = row2.createCell(2, CellType.STRING);
						cell2.setCellValue((dto.getFillCatProvince() != null) ? dto.getFillCatProvince() : "");
						cell2.setCellStyle(style);
						cell2 = row2.createCell(3, CellType.STRING);
						cell2.setCellValue((dto.getCatProvinceCode() != null) ? dto.getCatProvinceCode() : "");
						cell2.setCellStyle(style);
						cell2 = row2.createCell(4, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemName() != null) ? dto.getWorkItemName() : "");
						cell2.setCellStyle(style);
						cell2 = row2.createCell(5, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemPartDay() != null) ? dto.getWorkItemPartDay() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(6, CellType.STRING);
						cell2.setCellValue((dto.getQuantityPartDay() != null) ? dto.getQuantityPartDay() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(7, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemConsDay() != null) ? dto.getWorkItemConsDay() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(8, CellType.STRING);
						cell2.setCellValue((dto.getQuantityConsDay() != null) ? dto.getQuantityConsDay() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(9, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemSumDay() != null) ? dto.getWorkItemSumDay() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(10, CellType.STRING);
						cell2.setCellValue((dto.getQuantitySumDay() != null) ? dto.getQuantitySumDay() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(11, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemPartMonth() != null) ? dto.getWorkItemPartMonth() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(12, CellType.STRING);
						cell2.setCellValue((dto.getQuantityPartMonth() != null) ? dto.getQuantityPartMonth() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(13, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemConsMonth() != null) ? dto.getWorkItemConsMonth() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(14, CellType.STRING);
						cell2.setCellValue((dto.getQuantityConsMonth() != null) ? dto.getQuantityConsMonth() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(15, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemSumMonth() != null) ? dto.getWorkItemSumMonth() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(16, CellType.STRING);
						cell2.setCellValue((dto.getQuantitySumMonth() != null) ? dto.getQuantitySumMonth() : 0);
						cell2.setCellStyle(styleNumber);
					}
				}
			}
			// Huypq-20181105-end
		}

		workbook.write(outFile);
		workbook.close();
		outFile.close();
		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Export_sanluong.xlsx");
		return path;
	}

	// private String numberFormat(double value) {
	// DecimalFormat myFormatter = new DecimalFormat("###.###");
	// String output = myFormatter.format(value);
	// return output;
	// }
	private String numberFormat(double value) {
		DecimalFormat myFormatter = new DecimalFormat("###,###.####");
		// NumberFormat numEN = NumberFormat.getPercentInstance();
		String percentageEN = myFormatter.format(value);

		return percentageEN;
	}

	private String getStringForStatus(String status) {
		// TODO Auto-generated method stub
		if ("1".equals(status)) {
			return "Chưa thực hiện";
		} else if ("2".equals(status)) {
			return "Đang thực hiện";
		} else if ("3".equals(status)) {
			return "Đã hoàn thành";
		}
		return null;
	}

	public String exportSLTN(WorkItemDetailDTO obj) throws Exception {
		obj.setPage(null);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "San_luong_theo_ngay.xlsx"));
		XSSFWorkbook workbook = new XSSFWorkbook(file);
		file.close();
		Calendar cal = Calendar.getInstance();
		String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
				+ File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
				+ File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
				+ cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
				+ cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		File udir = new File(uploadPath);
		if (!udir.exists()) {
			udir.mkdirs();
		}
		OutputStream outFile = new FileOutputStream(
				udir.getAbsolutePath() + File.separator + "San_Luong_Theo_Ngay.xlsx");
		List<WorkItemDetailDTO> data = workItemDAO.doSearchForReport(obj);
		List<WorkItemDetailDTO> dataDetaill = workItemDAO.doSearchDetailForReport(obj);
		String sysGroupName = workItemDAO.getSysGroupNameByUserName(obj.getUserName());
		XSSFSheet sheet = workbook.getSheetAt(0);
		Date date1 = new Date();
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			XSSFCellStyle styleBold = ExcelUtils.styleBold(sheet);
			// HuyPQ-24/8/2018-edit-start
			XSSFCellStyle styleCurrency = ExcelUtils.styleNumber(sheet);
			styleCurrency.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			// HuyPQ-24/8/2018-edit-end
			styleCurrency.setAlignment(HorizontalAlignment.RIGHT);

			XSSFCellStyle stt = ExcelUtils.styleText1(sheet);
			stt.setAlignment(HorizontalAlignment.CENTER);
			int i = 8;
			Row rowS10 = sheet.createRow(1);
			Cell cellS10 = rowS10.createCell(0, CellType.STRING);
			cellS10.setCellValue((sysGroupName != null) ? sysGroupName : "");
			cellS10.setCellStyle(style);
			cellS10 = rowS10.createCell(2, CellType.STRING);
			cellS10.setCellValue("Độc lập - Tự do - Hạnh phúc");
			cellS10.setCellStyle(styleBold);
			Row rowS11 = sheet.createRow(4);
			Cell cellS1 = rowS11.createCell(0, CellType.STRING);
			cellS1.setCellValue(
					"Sản lượng từ  ngày:  " + (DateTimeUtils.convertDateToString(obj.getDateBD(), "dd/MM/yyyy"))
							+ "  đến ngày:  " + (DateTimeUtils.convertDateToString(obj.getDateKT(), "dd/MM/yyyy")));
			cellS1.setCellStyle(stt);
			Row rowS12 = sheet.createRow(5);
			Cell cellS12 = rowS12.createCell(0, CellType.STRING);
			cellS12.setCellValue("Ngày lập báo cáo:  " + (DateTimeUtils.convertDateToString(date1, "dd/MM/yyyy")));
			cellS12.setCellStyle(stt);

			for (WorkItemDetailDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 8));
				cell.setCellStyle(style);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.NUMERIC);
				cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
				cell.setCellStyle(styleCurrency);
			}
		}
		XSSFSheet sheet1 = workbook.getSheetAt(1);
		if (dataDetaill != null && !dataDetaill.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet1);
			// HuyPQ-20/8/2018-edit-start
			XSSFCellStyle styleCurrency = ExcelUtils.styleNumber(sheet1);
			styleCurrency.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			// HuyPQ-20/8/2018-edit-end
			styleCurrency.setAlignment(HorizontalAlignment.RIGHT);

			XSSFCellStyle st = ExcelUtils.styleText1(sheet1);
			st.setAlignment(HorizontalAlignment.CENTER);
			XSSFCellStyle stBold = ExcelUtils.styleBold(sheet1);

			int i = 8;

			Row rowS20 = sheet1.createRow(1);
			Cell cellS20 = rowS20.createCell(0, CellType.STRING);
			cellS20.setCellValue((sysGroupName != null) ? sysGroupName : "fgd");
			cellS20.setCellStyle(st);
			cellS20 = rowS20.createCell(5, CellType.STRING);
			cellS20.setCellValue("Độc lập - Tự do - Hạnh phúc");
			cellS20.setCellStyle(stBold);

			Row rowS21 = sheet1.createRow(4);
			Cell cellS21 = rowS21.createCell(0, CellType.STRING);
			cellS21.setCellValue(
					"Sản lượng từ  ngày:  " + (DateTimeUtils.convertDateToString(obj.getDateBD(), "dd/MM/yyyy"))
							+ "  đến ngày:  " + (DateTimeUtils.convertDateToString(obj.getDateKT(), "dd/MM/yyyy")));
			cellS21.setCellStyle(st);
			Row rowS22 = sheet1.createRow(5);
			Cell cellS22 = rowS22.createCell(0, CellType.STRING);
			cellS22.setCellValue("Ngày lập báo cáo:  " + (DateTimeUtils.convertDateToString(date1, "dd/MM/yyyy")));
			cellS22.setCellStyle(st);

			for (WorkItemDetailDTO dd : dataDetaill) {
				Row row = sheet1.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 8));
				cell.setCellStyle(style);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dd.getSysGroupName() != null) ? dd.getSysGroupName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dd.getProvinceCode() != null) ? dd.getProvinceCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dd.getCatStationCode() != null) ? dd.getCatStationCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dd.getConstructionCode() != null) ? dd.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dd.getName() != null) ? dd.getName() : "");
				cell.setCellStyle(style);
				// HuyPQ-20/8/2018-edit-start
				cell = row.createCell(6, CellType.NUMERIC);
				cell.setCellValue((dd.getApproveQuantity() != null) ? dd.getApproveQuantity() : 0);
				cell.setCellStyle(styleCurrency);
				// HuyPQ-20/8/2018-edit-end
			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "San_Luong_Theo_Ngay.xlsx");
		return path;
	}

	public List<WorkItemDetailDTO> getDataForExport(WorkItemDetailDTO obj) {
		return workItemDAO.doSearchForReport(obj);
	}

	public String exportVuongFile(ObstructedDetailDTO obj) throws Exception {
		// TODO Auto-generated method stub
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Danh_sach_vuong.xlsx"));
		XSSFWorkbook workbook = new XSSFWorkbook(file);
		file.close();
		Calendar cal = Calendar.getInstance();
		String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
				+ File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
				+ File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
				+ cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
				+ cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		File udir = new File(uploadPath);
		if (!udir.exists()) {
			udir.mkdirs();
		}
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "Danh_sach_vuong.xlsx");
		List<ObstructedDetailDTO> data = workItemDAO.doSearchEntangled(obj);
		XSSFSheet sheet = workbook.getSheetAt(0);
		Date date1 = new Date();
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-22/08/2018-start
			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			XSSFCellStyle stt = ExcelUtils.styleText1(sheet);
			stt.setAlignment(HorizontalAlignment.CENTER);
			int i = 2;
			for (ObstructedDetailDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(stt);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue(dto.getConstructionCode() != null ? dto.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue(dto.getObstructedContent() != null ? dto.getObstructedContent() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue(dto.getCreatedUserName() != null ? dto.getCreatedUserName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue(dto.getCreatedDate());
				cell.setCellStyle(styleDate);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue(dto.getClosedDate());
				cell.setCellStyle(styleDate);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue(getObstructedState(dto.getObstructedState()));
				cell.setCellStyle(style);
			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();
		return UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Danh_sach_vuong.xlsx");
	}

	private String getObstructedState(String obstructedState) {
		// TODO Auto-generated method stub
		if (StringUtils.isNotEmpty(obstructedState)) {
			if ("0".equalsIgnoreCase(obstructedState))
				return "Đóng";
			else if ("1".equalsIgnoreCase(obstructedState))
				return "Chưa có xác nhận của CNT";
			else if ("2".equalsIgnoreCase(obstructedState))
				return "Có xác nhận của CNT";
		}
		return "";
	}

	public DataListDTO doSearchForTask(WorkItemDetailDTO obj) {
		List<WorkItemDetailDTO> ls = workItemDAO.doSearchForTask(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public List<WorkItemDetailDTO> getDataForExportDetail(WorkItemDetailDTO obj) {
		// TODO Auto-generated method stub
		return workItemDAO.doSearchDetailForReport(obj);
	}

	public String exportDeliveryBill(SynStockTransDTO obj) throws Exception {
		obj.setPage(null);
		obj.setPageSize(null);
		InputStream file = null;
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		file = new BufferedInputStream(new FileInputStream(filePath + "export_phieu-xuat_kho.xlsx"));
		List<SynStockTransDTO> data = workItemDAO.doSearchDeliveryBill(obj);

		XSSFWorkbook workbook = new XSSFWorkbook(file);
		file.close();
		Calendar cal = Calendar.getInstance();
		String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
				+ File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
				+ File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
				+ cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
				+ cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		File udir = new File(uploadPath);
		if (!udir.exists()) {
			udir.mkdirs();
		}
		OutputStream outFile = new FileOutputStream(
				udir.getAbsolutePath() + File.separator + "export_phieu_xuat_kho.xlsx");
		// DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
			// HuyPQ-22/08/2018-start
			XSSFCellStyle styleCenter = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleCenter.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			XSSFCellStyle styleCurrency = ExcelUtils.styleCurrency(sheet);
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			int i = 2;
			for (SynStockTransDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getOrderCode() != null) ? dto.getOrderCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getCode() != null) ? dto.getCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getStockName() != null) ? dto.getStockName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getCreatedByName() != null) ? dto.getCreatedByName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getRealIeTransDate() != null) ? dto.getRealIeTransDate() : null);
				cell.setCellStyle(styleCenter);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue(getStatusPxk(dto.getStatus()));
				cell.setCellStyle(style);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue(getTinhTrangXn(dto.getConfirm()));
				cell.setCellStyle(style);
			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "export_phieu_xuat_kho.xlsx");
		return path;
	}

	private String getStatusPxk(String status) {
		// TODO Auto-generated method stub
		if (status != null) {
			if ("1".equals(status.toString())) {
				return "Chưa nhập/xuất ";
			} else if ("2".equals(status.toString())) {
				return "Đã nhập/xuất";
			} else if ("3".equals(status.toString())) {
				return "Đã Hủy";
			}
		}
		return "";
	}

	private String getTinhTrangXn(String conf) {
		// TODO Auto-generated method stub
		if (conf != null) {
			if ("1".equals(conf.trim())) {
				return "Đã xác nhận ";
			} else if ("0".equals(conf.trim()) || conf == null) {
				return "Chưa xác nhận";
			}
		}
		return "";
	}

	// chinhpxn20180716_start
	public List<WorkItemDTO> GetListData() {
		return workItemDAO.GetListData();
	}

	// chinhpxn20180716_end

	// chinhpxn20180718_start
	public int createSendSmsEmail(WorkItemDetailDTO request, KttsUserSession user, Long isApprove) {
		return workItemDAO.createSendSmsEmail(request, user, isApprove);
	}

	// chinhpxn20180718_end

}
