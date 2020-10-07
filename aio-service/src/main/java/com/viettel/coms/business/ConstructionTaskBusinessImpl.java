package com.viettel.coms.business;

import com.google.common.collect.Lists;
import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.ConstructionProgressDTO;
import com.viettel.coms.bo.ConstructionTaskBO;
import com.viettel.coms.config.JasperReportConfig;
import com.viettel.coms.dao.*;
import com.viettel.coms.dto.*;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.coms.utils.PermissionUtils;
import com.viettel.erp.dao.SysUserDAO;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.service.base.utils.StringUtils;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
import com.viettel.utils.DateTimeUtils;
import com.viettel.utils.ImageUtil;
import com.viettel.wms.utils.ValidateUtils;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;

import org.apache.commons.lang3.math.NumberUtils;
import org.apache.poi.openxml4j.util.ZipSecureFile;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFCreationHelper;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.joda.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import java.io.*;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service("constructionTaskBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ConstructionTaskBusinessImpl
		extends BaseFWBusinessImpl<ConstructionTaskDAO, ConstructionTaskDTO, ConstructionTaskBO>
		implements ConstructionTaskBusiness {

	private static final String CREATE_TASK = "CREATE_TASK";

	@Autowired
	private UtilAttachDocumentDAO utilAttrachDocumentDao;

	@Autowired
	private ConstructionTaskDAO constructionTaskDAO;
	@Autowired
	private ConstructionTaskDailyDAO constructionTaskDailyDAO;
	@Autowired
	private ConstructionDAO constructionDAO;
	@Autowired
	private SysUserDAO sysUserDAO;
	@Autowired
	private WorkItemDAO workItemDAO;

	@Autowired
	private RpConstructionHSHCDAO rpConstructionHSHCDAO;
	@Value("${folder_upload2}")
	private String folder2Upload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;

	@Context
	HttpServletResponse response;
	@Value("${folder_upload2}")
	private String folderUpload;

	@Value("${input_image_sub_folder_upload}")
	private String input_image_sub_folder_upload;

	@Autowired
	UtilAttachDocumentDAO utilAttachDocumentDAO;

	public ConstructionTaskBusinessImpl() {
		tModel = new ConstructionTaskBO();
		tDAO = constructionTaskDAO;
	}

	@Override
	public ConstructionTaskDAO gettDAO() {
		return constructionTaskDAO;
	}

	@Override
	public long count() {
		return constructionTaskDAO.count("ConstructionTaskBO", null);
	}

	// chinhpxn20180716_start
	@Context
	HttpServletRequest request;

	@Autowired
	private DetailMonthPlanDAO detailMonthPlanDAO;

	static Logger LOGGER = LoggerFactory.getLogger(ConstructionTaskBusinessImpl.class);

	int[] validateCol = { 1, 2, 3, 4, 5 };
	int[] validateColForAddTask = { 1, 2, 3, 4, 5, 6 };
	HashMap<Integer, String> colName = new HashMap();

	{
		colName.put(1, "Mã công trình");
		colName.put(2, "Tên hạng mục");
		colName.put(3, "Người thực hiện");
		colName.put(4, "Thời gian bắt đầu");
		colName.put(5, "Thời gian kết thúc");
		colName.put(6, "Giá trị");
	}

	HashMap<Integer, String> colAlias = new HashMap();

	{
		colAlias.put(1, "B");
		colAlias.put(2, "C");
		colAlias.put(3, "D");
		colAlias.put(4, "E");
		colAlias.put(5, "F");
		colAlias.put(6, "G");
		colAlias.put(7, "H");
		colAlias.put(8, "I");
		colAlias.put(9, "J");
		colAlias.put(10, "K");
		colAlias.put(11, "L");
//		hoanm1_20181219_start
		colAlias.put(12, "M");
		colAlias.put(13, "N");
//		hoanm1_20181219_end
	}
//	hoanm1_20181219_start
	private final int[] requiredColHSHC = new int[] {1, 6, 11,13};
	private HashMap<Integer, String> colNameHSHC = new HashMap<>();
	{
		colNameHSHC.put(1,"Ngày hoàn thành");
		colNameHSHC.put(2,"Đơn vị thực hiện");
		colNameHSHC.put(3,"Mã tỉnh");
		colNameHSHC.put(4,"Mã nhà trạm");
		colNameHSHC.put(5,"Mã trạm");
		colNameHSHC.put(6,"Mã công trình");
		colNameHSHC.put(7,"Hợp đồng");
		colNameHSHC.put(8,"HSHC kế hoạch");
		colNameHSHC.put(9,"HSHC phê duyệt");
		colNameHSHC.put(10,"Hạng mục thực hiện");
		colNameHSHC.put(11,"Phê duyệt/Từ chối");
		colNameHSHC.put(12,"Lý do từ chối");
		colNameHSHC.put(13,"Ngày thi công xong");
	}
//	hoanm1_20181219_end
	public boolean validateString(String str) {
		return (str != null && str.length() > 0);
	}

	// chinhpxn20180716_end

	public DataListDTO doSearch(ConstructionTaskDetailDTO obj) {
		List<ConstructionTaskDetailDTO> ls;
		if ("5".equals(obj.getType())) {
			ls = constructionTaskDAO.doSearchForDT(obj);
		} else {
			ls = constructionTaskDAO.doSearch(obj);
		}
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		// data.setTotal(obj.getTotalRecord());
		// chinhpxn20180705_start
		data.setTotal(obj.getTotalRecord());
		// chinhpxn20180705_end
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	// START SERVICE MOBILE
	public CountConstructionTaskDTO getCountRecordfromUserRequest(SysUserRequest request) {
		CountConstructionTaskDTO dto = constructionTaskDAO.getCount(request);
		return dto;
	}

	public List<ConstructionTaskDTO> getAllConstructionTask(SysUserRequest request) {
		List<ConstructionTaskDTO> ls = constructionTaskDAO.getAllConstrucionTaskDTO(request);

		return ls;
	}

	public int updateStopReasonConstructionTask(ConstructionTaskDTOUpdateRequest request) {

		return constructionTaskDAO.updateStopConstruction(request);

	}

	public int updatePercentConstructionTask(ConstructionTaskDTOUpdateRequest request) {
		// phucvx start
		if ("1".equals(request.getConstructionTaskDTO().getQuantityByDate())) {
			constructionTaskDailyDAO.deleteTaskDaily(request.getConstructionTaskDTO().getConstructionTaskId());
			constructionTaskDailyDAO.getSession().flush();
			if (request.getListParamDto().size() > 0) {
				for (AppParamDTO dto : request.getListParamDto()) {
					if (("0").equals(dto.getConfirm())) {
						ConstructionTaskDailyDTO daily = new ConstructionTaskDailyDTO();
						daily.setAmount(dto.getAmount());
						daily.setType(dto.getCode());
						daily.setConfirm("0");
						Double quantity = request.getConstructionTaskDTO().getPrice() * dto.getAmount();
						daily.setQuantity(quantity);
						daily.setSysGroupId(request.getConstructionTaskDTO().getSysGroupId());
						daily.setConstructionTaskId(request.getConstructionTaskDTO().getConstructionTaskId());
						daily.setWorkItemId(request.getConstructionTaskDTO().getWorkItemId());
						// hoanm1_20180710_start
						daily.setCatTaskId(request.getConstructionTaskDTO().getCatTaskId());
						// hoanm1_20180710_end
						daily.setCreatedUserId(request.getSysUserRequest().getSysUserId());
						daily.setCreatedGroupId(Long.parseLong(request.getSysUserRequest().getSysGroupId()));
						daily.setCreatedDate(new Date());
						constructionTaskDailyDAO.saveObject(daily.toModel());
						constructionTaskDailyDAO.getSession().flush();
					}
				}
			}

		}
		// end
		if (request.getListConstructionImageInfo() != null) {
			// luu anh va tra ve mot list path
			List<ConstructionImageInfo> lstConstructionImages = saveConstructionImages(
					request.getListConstructionImageInfo());

			constructionTaskDAO.saveImagePathsDao(lstConstructionImages,
					request.getConstructionTaskDTO().getConstructionTaskId(), request.getSysUserRequest());
		}
		return constructionTaskDAO.updatePercentConstruction(request);
	}

	public CountConstructionTaskDTO getCountPerformerSupvisor(SysUserRequest request) {
		return constructionTaskDAO.getCountPermissionSupervisior(request);
	}

	public Long insertCompleteRevenueTaskOther(ConstructionTaskDetailDTO dto, SysUserRequest sysRequest,
			Long sysGroupId) {
		// chinhpxn_20180711_start
		return constructionTaskDAO.insertCompleteRevenueTaskOther(dto, sysRequest, sysGroupId);
		// chinhpxn_20180711_end
	}

	public Long insertCompleteRevenueTaskOtherTC(ConstructionTaskDetailDTO dto, SysUserRequest request, Long sysGroupId,
			KttsUserSession objUser) {
		if (dto.getType().equals("1")) {
			for (ConstructionTaskDetailDTO childDto : dto.getChildDTOList()) {
				//VietNT_20190117_start
				if(dto.getReceivedStatus() !=null){
					if (dto.getReceivedStatus() == 3) {
						childDto.setReceivedStatus(3L);
					}
				}
				//VietNT_end
				Long result = constructionTaskDAO.insertCompleteRevenueTaskOtherTC(childDto, request, sysGroupId,
						objUser);
				if (result < 0)
					return result;
			}
			return 1L;
		}
		return constructionTaskDAO.insertCompleteRevenueTaskOtherTC(dto, request, sysGroupId, objUser);
	}

	// nhantv 20102018 import danh sách công việc làm hshc/lên doanh thu
	public Long saveListTaskFromImport(ConstructionTaskDetailDTO dto, SysUserRequest request, Long sysGroupId,
			KttsUserSession objUser) {
		try {
			for (ConstructionTaskDetailDTO childDto : dto.getChildDTOList()) {
				Long month = getCurrentTimeStampMonth(childDto.getStartDate());
				Long year = getCurrentTimeStampYear(childDto.getStartDate());
				Long detailMonthPlanId = constructionTaskDAO.getDetailMonthPlan(month, year, sysGroupId);
				constructionTaskDAO.getParentTask(childDto, childDto.getType(), detailMonthPlanId, request, sysGroupId);
				constructionTaskDAO.insertConstructionExcute(childDto, childDto.getType(), detailMonthPlanId, request,
						sysGroupId, objUser);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return 0L;
		}
		return 1L;
	}

	public List<ConstructionTaskDTO> getListConstructionTaskOnDay(SysUserRequest request) {
		return constructionTaskDAO.getListConstructionTaskOnDay(request);
	}

	// END SERVICE MOBILE

	public DataListDTO doSearchForReport(ConstructionTaskDetailDTO obj) {
		List<ConstructionTaskDetailDTO> ls = constructionTaskDAO.doSearchForReport(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	@Override
	public List<ConstructionProgressDTO> getConstructionTaskData() {
		List<ConstructionProgressDTO> result = constructionTaskDAO.getConstructionTaskData();
		populateDateToReturn(result);
		return result;
	}

	private void populateDateToReturn(List<ConstructionProgressDTO> result) {
		for (int i = 0; i < result.size(); i++) {
			result.get(i).setOrderId("" + i);
			result.get(i).setSummary("false");
			result.get(i).setExpanded("true");
			// float percent = (float)result.get(i).getPercentComplete()/100;
			result.get(i).setPercentCompleteStr("0.5");
		}
	}

	public String exportConstructionTask(ConstructionTaskDetailDTO obj, String userName) throws Exception {
		obj.setPage(null);
		obj.setPageSize(null);
		obj.setUserName(userName);
		String sysGroupName = constructionTaskDAO.getDataSysGroupNameByUserName(obj.getUserName());
		obj.setPage(null);
		obj.setPageSize(null);
		Date dateNow = new Date();
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Bao_cao_danh_sach_cong_viec.xlsx"));
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
				udir.getAbsolutePath() + File.separator + "Bao_cao_danh_sach_cong_viec.xlsx");
		List<ConstructionTaskDetailDTO> data = constructionTaskDAO.doSearchForReport(obj);
		// DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		XSSFSheet sheet = workbook.getSheetAt(0);
		XSSFCellStyle stt = ExcelUtils.styleText(sheet);
		stt.setAlignment(HorizontalAlignment.CENTER);
		XSSFCellStyle sttbold = ExcelUtils.styleBold(sheet);

		Row rowS2 = sheet.createRow(1);
		Cell cellS10 = rowS2.createCell(0, CellType.STRING);
		cellS10.setCellValue((sysGroupName != null) ? sysGroupName : "");
		cellS10.setCellStyle(stt);
		cellS10 = rowS2.createCell(7, CellType.STRING);
		cellS10.setCellValue("Độc lập - Tự do - Hạnh phúc");
		cellS10.setCellStyle(sttbold);

		Row rowS12 = sheet.createRow(4);
		Cell cellS12 = rowS12.createCell(0, CellType.STRING);
		cellS12.setCellValue("Ngày lập báo cáo:  " + (DateTimeUtils.convertDateToString(dateNow, "dd/MM/yyyy")));
		cellS12.setCellStyle(stt);

		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-22/08/2018-start
			XSSFCellStyle sttCenter = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			sttCenter.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			sttCenter.setAlignment(HorizontalAlignment.CENTER);
			int i = 7;
			for (ConstructionTaskDetailDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 7));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getYear() != null && dto.getMonth() != null)
						? "Tháng " + dto.getMonth() + "/" + dto.getYear()
						: "");
				cell.setCellStyle(sttCenter);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getTaskName() != null) ? dto.getTaskName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getPerformerName() != null) ? dto.getPerformerName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getStartDate() != null) ? dto.getStartDate() : null);
				cell.setCellStyle(sttCenter);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getEndDate() != null) ? dto.getEndDate() : null);
				cell.setCellStyle(sttCenter);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue(getStringStatusConstructionTask(dto.getStatus()));
				cell.setCellStyle(style);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue(
						(dto.getCompletePercent() != null) ? getStringForCompletePercent(dto.getCompletePercent())
								: "0%");
				cell.setCellStyle(styleNumber);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getCompleteState().equals("1")) ? "Đúng tiến độ" : "Chậm tiến độ");
				cell.setCellStyle(style);

				// thiếu quantity

			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt
				.encryptFileUploadPath(uploadPathReturn + File.separator + "Bao_cao_danh_sach_cong_viec.xlsx");
		return path;
	}

	private String getStringForCompletePercent(Double completePercent) {
		// TODO Auto-generated method stub

		return completePercent + "%";
	}

	private String getStringStatusConstructionTask(String status) {
		// TODO Auto-generated method stub
		if ("1".equals(status)) {
			return "Chưa thực hiện";
		} else if ("2".equals(status)) {
			return " Đang thực hiện";
		} else if ("4".equals(status)) {
			return " Đã hoàn thành";
		} else if ("3".equals(status)) {
			return " Tạm dừng";
		}
		return null;
	}

	// Huypq-20181017-start-exportFileSlow
	public String exportConstructionTaskSlow(GranttDTO granttSearch, Long sysGroupId, HttpServletRequest request)
			throws Exception {
		granttSearch.setPage(null);
		granttSearch.setPageSize(null);
		Date dateNow = new Date();
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Hang_muc_cham_tien_do.xlsx"));
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
				udir.getAbsolutePath() + File.separator + "Hang_muc_cham_tien_do.xlsx");
		List<ConstructionTaskSlowDTO> data = new ArrayList<ConstructionTaskSlowDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.WORK_PROGRESS, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty()) {
			data = constructionTaskDAO.getConstructionTaskSlow(granttSearch, groupIdList);
		}
		// List<ConstructionTaskSlowDTO> data =
		// constructionTaskDAO.getConstructionTaskSlow(obj);
		XSSFSheet sheet = workbook.getSheetAt(0);
		XSSFCellStyle stt = ExcelUtils.styleText(sheet);
		stt.setAlignment(HorizontalAlignment.CENTER);
		XSSFCellStyle sttbold = ExcelUtils.styleBold(sheet);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			XSSFCellStyle sttCenter = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			sttCenter.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			sttCenter.setAlignment(HorizontalAlignment.CENTER);
			int i = 1;
			for (ConstructionTaskSlowDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 1));
				cell.setCellStyle(stt);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getTimeReport() != null) ? dto.getTimeReport() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getProvinceCode() != null) ? dto.getProvinceCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getWorkItemName() != null) ? dto.getWorkItemName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getTaskName() != null) ? dto.getTaskName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getPartnerName() != null) ? dto.getPartnerName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue((dto.getFullName() != null) ? dto.getFullName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue((dto.getEmail() != null) ? dto.getEmail() : "");
				cell.setCellStyle(style);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getPhoneNumber() != null) ? dto.getPhoneNumber() : "");
				cell.setCellStyle(style);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue((dto.getStartDate() != null) ? dto.getStartDate() : null);
				cell.setCellStyle(sttCenter);
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue((dto.getEndDate() != null) ? dto.getEndDate() : null);
				cell.setCellStyle(sttCenter);

				// thiếu quantity

			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Hang_muc_cham_tien_do.xlsx");
		return path;
	}
	// Huypq-20181017-end

	public DataListDTO doSearchForConsManager(ConstructionTaskDetailDTO obj, HttpServletRequest request) {
		List<ConstructionTaskDetailDTO> ls = new ArrayList<ConstructionTaskDetailDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty())
			ls = constructionTaskDAO.doSearchForConsManager(obj, groupIdList);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	@Override
	public List<ConstructionTaskGranttDTO> getDataForGrant(GranttDTO granttSearch, Long sysGroupId,
			HttpServletRequest request) {
		List<ConstructionTaskGranttDTO> lstRs = new ArrayList<ConstructionTaskGranttDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.WORK_PROGRESS, request);
		// hoanm1_20180905_start
		String groupIdTC = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.WORK_PROGRESS_TC, request);
		String groupIdHSHC = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.WORK_PROGRESS_HSHC, request);
		// hoanm1_20180905_end
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty()) {
			lstRs = constructionTaskDAO.getDataForGrant(granttSearch, groupIdList, groupIdTC, groupIdHSHC);
		}
		// Long constructionIndex = 0L;
		// Long workItemIndex = 0L;
		// Long taskIndex = 0L;
		// List<ConstructionTaskGranttDTO> sysGroupLst = new
		// ArrayList<ConstructionTaskGranttDTO>();
		// for (ConstructionTaskGranttDTO dto : lstRs) {
		// if (dto.getLevelId() == 1L) {
		// constructionIndex = 0L;
		// dto.setFullname("");
		// sysGroupLst.add(dto);
		// } else if (dto.getLevelId() == 2L) {
		// workItemIndex = 0L;
		// dto.setOrderID(constructionIndex);
		// dto.setFullname("");
		// constructionIndex++;
		// } else if (dto.getLevelId() == 3L) {
		// taskIndex = 0L;
		// dto.setOrderID(workItemIndex);
		// workItemIndex++;
		// } else {
		// dto.setOrderID(taskIndex);
		// dto.setSummary(false);
		// taskIndex++;
		// }
		// }
		return lstRs;
	}

	@Override
	public List<ConstructionTaskResourcesGranttDTO> getDataResources() {

		return constructionTaskDAO.getDataResources();
	}

	@Override
	public List<ConstructionTaskAssignmentsGranttDTO> getDataAssignments(GranttDTO granttSearch) {

		return constructionTaskDAO.getDataAssignments(granttSearch);
	}

	public int insertConstruction(ConstructionTaskDTOUpdateRequest request) {
		// return constructionTaskDAO.saveObject(dto.toModel()).intValue();
		return constructionTaskDAO.inserConstructionTask(request);
	}

	public DataListDTO doSearchForRevenue(ConstructionTaskDetailDTO obj, HttpServletRequest request) {
		List<ConstructionTaskDetailDTO> ls = new ArrayList<ConstructionTaskDetailDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty())
			ls = constructionTaskDAO.doSearchForRevenue(obj, groupIdList);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public String exportContructionHSHC(ConstructionTaskDetailDTO obj, HttpServletRequest request) throws Exception {
		obj.setPage(1L);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Bao_cao_quan_li_HSHC.xlsx"));
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
				udir.getAbsolutePath() + File.separator + "Bao_cao_quan_li_HSHC.xlsx");
		List provinceListId = PermissionUtils.getListIdInDomainData(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<ConstructionTaskDetailDTO> data = new ArrayList<ConstructionTaskDetailDTO>();
		if (provinceListId != null && !provinceListId.isEmpty())
			data = constructionTaskDAO.doSearchForConsManager(obj, provinceListId);
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			Date dateNow = new Date();
			XSSFCellStyle style = ExcelUtils.styleText(sheet);

			// HuyPQ-17/08/2018-start
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));

			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yy");
			// HuyPQ-20/08/2018-end

			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			Row rowS12 = sheet.createRow(4);
			Cell cellS12 = rowS12.createCell(0, CellType.STRING);
			cellS12.setCellValue("Ngày lập báo cáo:  " + (DateTimeUtils.convertDateToString(dateNow, "dd/MM/yyyy")));
			cellS12.setCellStyle(styleDate);
			int i = 7;
			for (ConstructionTaskDetailDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 7));
				cell.setCellStyle(styleDate);
				// HuyPQ-21/08/2018-edit-start
				cell = row.createCell(1, CellType.STRING);
				Date dateComplete = dateFormat.parse(dto.getDateComplete());
				cell.setCellValue((dateComplete != null) ? dateComplete : null);
				cell.setCellStyle(styleDate);
				// HuyPQ-21/08/2018-edit-end
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);// tỉnh
				cell.setCellValue((dto.getCatProvinceCode() != null) ? dto.getCatProvinceCode() : "");
				cell.setCellStyle(style);
//				hoanm1_20181215_start
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getCatStationHouseCode() != null) ? dto.getCatStationHouseCode() : "");
				cell.setCellStyle(style);
//				hoanm1_20181215_end
				cell = row.createCell(5, CellType.STRING);// trạm
				cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getCntContract() != null) ? dto.getCntContract() : "");
				cell.setCellStyle(style);
				// HuyPQ-17/08/2018-start
//				hoanm1_20181215_start
				cell = row.createCell(8, CellType.NUMERIC);// number
				Float completeValuePlan = dto.getCompleteValuePlan() != null ? Float.parseFloat(dto.getCompleteValuePlan()) : 0;
				cell.setCellValue((completeValuePlan != null) ? completeValuePlan : 0);
				cell.setCellStyle(styleNumber);
//				hoanm1_20181215_end
				cell = row.createCell(9, CellType.NUMERIC);// number
				Float completeValue = dto.getCompleteValue() != null ? Float.parseFloat(dto.getCompleteValue()) : 0;
				cell.setCellValue((completeValue != null) ? completeValue  : 0);
				cell.setCellStyle(styleNumber);

				// HuyPQ-17/08/2018-end
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getStatus() != null) ? getStringForStatusConstr(dto.getStatus()) : "");
				cell.setCellStyle(style);
				cell = row.createCell(11, CellType.STRING);// workitem
				cell.setCellValue((dto.getWorkItemCode() != null) ? dto.getWorkItemCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(12, CellType.STRING);// ngày nhận
				String receiveDate = "";
				SimpleDateFormat fullDateFormat = new SimpleDateFormat("dd/MM/yyyy");
				if (dto.getReceiveRecordsDate() != null)
					receiveDate = fullDateFormat.format(dto.getReceiveRecordsDate());
				cell.setCellValue(dto.getReceiveRecordsDate() != null ? fullDateFormat.parse(receiveDate) : null);
				cell.setCellStyle(styleDate);
				// thiếu quantity
//				hoanm1_20181203_start
				cell = row.createCell(13, CellType.STRING);
				cell.setCellValue((dto.getApproceCompleteDescription() != null) ? dto.getApproceCompleteDescription() : "");
				cell.setCellStyle(style);
//				hoanm1_20181219_start
				cell = row.createCell(14, CellType.STRING);
				cell.setCellValue((dto.getDateCompleteTC() != null) ? dto.getDateCompleteTC() : "");
				cell.setCellStyle(style);
//				hoanm1_20181219_end
//				hoanm1_20181203_end
			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Bao_cao_quan_li_HSHC.xlsx");
		return path;
	}

	public String exportContructionDT(ConstructionTaskDetailDTO obj, HttpServletRequest request) throws Exception {
		obj.setPage(1L);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Bao_cao_quan_ly_DT.xlsx"));
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
				udir.getAbsolutePath() + File.separator + "Bao_cao_quan_ly_DT.xlsx");
		List provinceListId = PermissionUtils.getListIdInDomainData(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<ConstructionTaskDetailDTO> data = new ArrayList<ConstructionTaskDetailDTO>();
		if (provinceListId != null && !provinceListId.isEmpty())
			data = constructionTaskDAO.doSearchForRevenue(obj, provinceListId);
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			Date dateNow = new Date();
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-17/08/2018-start
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			// HuyPQ-17/08/2018-end
			// HuyPQ-start
			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yy");
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			Row rowS12 = sheet.createRow(4);
			Cell cellS12 = rowS12.createCell(0, CellType.STRING);
			cellS12.setCellValue("Ngày lập báo cáo:  " + (DateTimeUtils.convertDateToString(dateNow, "dd/MM/yyyy")));
			cellS12.setCellStyle(styleDate);
			int i = 7;
			for (ConstructionTaskDetailDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 7));
				cell.setCellStyle(styleNumber);
				// HuyPQ-22/08/2018-start
				cell = row.createCell(1, CellType.STRING);
				Date dateComplete = dateFormat.parse(dto.getDateComplete());
				cell.setCellValue((dateComplete != null) ? dateComplete : null);
				cell.setCellStyle(styleDate);
				// HuyPQ-end
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getCntContract() != null) ? dto.getCntContract() : "");
				cell.setCellStyle(style);
				// HuyPQ-17/08/2018-edit-start
				cell = row.createCell(6, CellType.STRING);
				if (dto.getCompleteValue() != null) {
					Float completeValue = Float.parseFloat(dto.getCompleteValue());
					cell.setCellValue(completeValue);
					cell.setCellStyle(styleNumber);
				} else {
					Float completeValue = (float) 0;
					cell.setCellValue(completeValue);
					cell.setCellStyle(styleNumber);
				}

				cell = row.createCell(7, CellType.NUMERIC);
				Float consAppRevenueState = Float.parseFloat(dto.getConsAppRevenueState());
				cell.setCellValue(
						(consAppRevenueState == 1 || consAppRevenueState == null) ? dto.getConsAppRevenueValue()
								: dto.getConsAppRevenueValueDB());
				cell.setCellStyle(styleNumber);
				// HuyPQ-17/08/2018-edit-end
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue((dto.getStatus() != null) ? getStringForStatusConstr(dto.getStatus()) : "");
				cell.setCellStyle(style);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue(
						(dto.getConsAppRevenueState() != null) ? getStringForStateConstr(dto.getConsAppRevenueState())
								: "");
				cell.setCellStyle(style);

				// thiếu quantity

			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Bao_cao_quan_ly_DT.xlsx");
		return path;

	}

	@Override
	public int updateCompletePercent(ConstructionTaskGranttDTO dto, KttsUserSession objUser) {
		// if(inValidStartDate(dto))
		// return -1;
		// if(inValidEndDate(dto))
		// return -2;
		constructionTaskDAO.updateCompletePercent(dto, objUser);
		Long parentId = dto.getParentID();
		while (parentId != null) {
			constructionTaskDAO.updateTaskParent(parentId);
			parentId = constructionTaskDAO.getParentId(parentId);
		}
		return constructionTaskDAO.updateCompletePercent(dto, objUser);

	}

	private boolean inValidEndDate(ConstructionTaskGranttDTO dto) {
		// TODO Auto-generated method stub
		return constructionTaskDAO.inValidEndDate(dto);
	}

	private boolean inValidStartDate(ConstructionTaskGranttDTO dto) {
		// TODO Auto-generated method stub
		return constructionTaskDAO.inValidStartDate(dto);
	}

	@Override
	public int deleteGrantt(ConstructionTaskGranttDTO dto) {
		return constructionTaskDAO.deleteGrantt(dto);
	}

	@Override
	public int createTask(ConstructionTaskGranttDTO dto) {
		return constructionTaskDAO.createTask(dto);
	}

	public String exportDetailMonthPlanTab1(ConstructionTaskDetailDTO obj) throws Exception {

		obj.setPage(1L);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Export_thicong_thang_chitiet.xlsx"));
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
				udir.getAbsolutePath() + File.separator + "Export_thicong_thang_chitiet.xlsx");

		List<ConstructionTaskDetailDTO> data = constructionTaskDAO.doSearch(obj);
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-17/08/2018-edit-start
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			// HuyPQ-17/08/2018-edit-end
			// HuyPQ-22/08/2018-edit-start
			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			XSSFCellStyle styleCurrency = ExcelUtils.styleCurrency(sheet);
			int i = 2;
			for (ConstructionTaskDetailDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getCatProvinceCode() != null) ? dto.getCatProvinceCode() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getWorkItemName() != null) ? dto.getWorkItemName() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getCntContract() != null) ? dto.getCntContract() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.NUMERIC);
				cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue(("1".equals(dto.getSourceType())) ? "x" : " ");
				cell.setCellStyle(style);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue(("2".equals(dto.getSourceType())) ? "x" : " ");
				cell.setCellStyle(style);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue(("1".equals(dto.getDeployType())) ? "x" : " ");
				cell.setCellStyle(style);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue(("2".equals(dto.getDeployType())) ? "x" : " ");
				cell.setCellStyle(style);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue((dto.getSupervisorName() != null) ? dto.getSupervisorName() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue((dto.getDirectorName() != null) ? dto.getDirectorName() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(13, CellType.STRING);
				cell.setCellValue((dto.getPerformerName() != null) ? dto.getPerformerName() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(14, CellType.STRING);
				cell.setCellValue((dto.getStartDate() != null) ? dto.getStartDate() : null);
				cell.setCellStyle(styleDate);
				cell = row.createCell(15, CellType.STRING);
				cell.setCellValue((dto.getEndDate() != null) ? dto.getEndDate() : null);
				cell.setCellStyle(styleDate);
				cell = row.createCell(16, CellType.STRING);
				cell.setCellValue((dto.getDescription() != null) ? dto.getDescription() : " ");
				cell.setCellStyle(style);

				// thiếu quantity

			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt
				.encryptFileUploadPath(uploadPathReturn + File.separator + "Export_thicong_thang_chitiet.xlsx");
		return path;
	}

	public String exportDetailMonthPlanTab2(ConstructionTaskDetailDTO obj) throws Exception {

		obj.setPage(1L);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Export_HSHC_thang_chitiet.xlsx"));
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
				udir.getAbsolutePath() + File.separator + "Export_HSHC_thang_chitiet.xlsx");

		List<ConstructionTaskDetailDTO> data = constructionTaskDAO.doSearch(obj);
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
			for (ConstructionTaskDetailDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getConstructionType() != null) ? dto.getConstructionType() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
//				hoanm1_20181229_start
//				cell.setCellValue(("1".equals(dto.getIsObstructed())) ? "Có" : "Không");
				cell.setCellValue((dto.getWorkItemNameHSHC() != null) ? dto.getWorkItemNameHSHC() : " ");
//				hoanm1_20181229_end
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getCntContract() != null) ? dto.getCntContract() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.NUMERIC);
				cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getCompleteDate() != null) ? dto.getCompleteDate() : null);
				cell.setCellStyle(styleDate);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue((dto.getSupervisorName() != null) ? dto.getSupervisorName() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue((dto.getDirectorName() != null) ? dto.getDirectorName() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getPerformerName() != null) ? dto.getPerformerName() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue((dto.getStartDate() != null) ? dto.getStartDate() : null);
				cell.setCellStyle(styleDate);
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue((dto.getEndDate() != null) ? dto.getEndDate() : null);
				cell.setCellStyle(styleDate);
				cell = row.createCell(13, CellType.STRING);
				cell.setCellValue((dto.getDescription() != null) ? dto.getDescription() : " ");
				cell.setCellStyle(style);

				// thiếu quantity

			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt
				.encryptFileUploadPath(uploadPathReturn + File.separator + "Export_HSHC_thang_chitiet.xlsx");
		return path;
	}

	public String exportDetailMonthPlanTab3(ConstructionTaskDetailDTO obj) throws Exception {

		obj.setPage(1L);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(
				new FileInputStream(filePath + "Export_lendoanhthu_thang_chitiet.xlsx"));
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
				udir.getAbsolutePath() + File.separator + "Export_lendoanhthu_thang_chitiet.xlsx");

		List<ConstructionTaskDetailDTO> data = constructionTaskDAO.doSearch(obj);
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
			for (ConstructionTaskDetailDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getCatProvinceCode() != null) ? dto.getCatProvinceCode() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getConstructionType() != null) ? dto.getConstructionType() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getCntContract() != null) ? dto.getCntContract() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.NUMERIC);
				cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getApproveCompleteDate() != null) ? dto.getApproveCompleteDate() : null);
				cell.setCellStyle(styleDate);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue((dto.getPerformerName() != null) ? dto.getPerformerName() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue((dto.getStartDate() != null) ? dto.getStartDate() : null);
				cell.setCellStyle(styleDate);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getEndDate() != null) ? dto.getEndDate() : null);
				cell.setCellStyle(styleDate);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue((dto.getDescription() != null) ? dto.getDescription() : " ");
				cell.setCellStyle(style);

				// thiếu quantity

			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt
				.encryptFileUploadPath(uploadPathReturn + File.separator + "Export_lendoanhthu_thang_chitiet.xlsx");
		return path;
	}

	public String exportDetailMonthPlanTab5(ConstructionTaskDetailDTO obj) throws Exception {

		obj.setPage(1L);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(
				new FileInputStream(filePath + "Export_dongtien_thang_chitiet.xlsx"));
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
				udir.getAbsolutePath() + File.separator + "Export_dongtien_thang_chitiet.xlsx");

		List<ConstructionTaskDetailDTO> data = constructionTaskDAO.doSearchForDT(obj);
		// DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
			// HuyPQ-17/08/2018-edit-start
			XSSFCellStyle styleCurrency = ExcelUtils.styleNumber(sheet);
			styleCurrency.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			// HuyPQ-17/08/2018-edit-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			int i = 1;
			for (ConstructionTaskDetailDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 1));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellStyle(style);
				cell.setCellValue((dto.getCatProvinceCode() != null) ? dto.getCatProvinceCode() : " ");
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getConstructionType() != null) ? dto.getConstructionType() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getWorkItemName() != null) ? dto.getWorkItemName() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getCntContract() != null) ? dto.getCntContract() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(7, CellType.NUMERIC);
				cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(8, CellType.NUMERIC);
				cell.setCellValue((dto.getVat() != null) ? dto.getVat() : 0);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(9, CellType.NUMERIC);
				cell.setCellValue(
						(dto.getVat() != null && dto.getQuantity() != null) ? getTotal(dto.getQuantity(), dto.getVat())
								: 0);
				cell.setCellStyle(styleCurrency);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getDescription() != null) ? dto.getDescription() : " ");
				cell.setCellStyle(style);

				// thiếu quantity

			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt
				.encryptFileUploadPath(uploadPathReturn + File.separator + "Export_dongtien_thang_chitiet.xlsx");
		return path;
	}

	private Double getTotal(Double quantity, Double vat) {
		// TODO Auto-generated method stub
		if (vat > 0) {
			return quantity + (quantity * (vat / 100));

		}
		return null;
	}

	public String exportDetailMonthPlanTab6(ConstructionTaskDetailDTO obj) throws Exception {

		obj.setPage(1L);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(
				new FileInputStream(filePath + "Export_congvieckhac_thang_chitiet.xlsx"));
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
				udir.getAbsolutePath() + File.separator + "Export_congvieckhac_thang_chitiet.xlsx");

		List<ConstructionTaskDetailDTO> data = constructionTaskDAO.doSearch(obj);
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
			// DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			// HuyPQ-22/08/2018-edit-start
			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			int i = 2;
			for (ConstructionTaskDetailDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getTaskName() != null) ? dto.getTaskName() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getPerformerName() != null) ? dto.getPerformerName() : " ");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getStartDate() != null) ? dto.getStartDate() : null);
				cell.setCellStyle(styleDate);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getEndDate() != null) ? dto.getEndDate() : null);
				cell.setCellStyle(styleDate);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getDescription() != null) ? dto.getDescription() : " ");
				cell.setCellStyle(style);

				// thiếu quantity

			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt
				.encryptFileUploadPath(uploadPathReturn + File.separator + "Export_congvieckhac_thang_chitiet.xlsx");
		return path;
	}

	private String numberFormat(double value) {
		DecimalFormat myFormatter = new DecimalFormat("###.###");
		String output = myFormatter.format(value);
		return output;
	}

	private String getStringForStatus(String status) {
		// TODO Auto-generated method stub
		if ("0".equals(status)) {
			return "Hết hiệu lực";
		} else if ("1".equals(status)) {
			return "Hiệu lực";
		}
		return null;
	}

	private String getStringForSignState(String signState) {
		// TODO Auto-generated method stub
		if ("1".equals(signState)) {
			return "Chưa trình ký";
		} else if ("2".equals(signState)) {
			return "Đã trình ký";
		} else if ("3".equals(signState)) {
			return "Đã ký duyệt";
		}
		return null;
	}
//hoanm1_20181215_start
	private String getStringForStatusConstr(String status) {
		// TODO Auto-generated method stub
		if ("0".equals(status)) {
			return "Đã hủy";
		} else if ("1".equals(status)) {
			return "Chờ phê duyệt";
		} else if ("2".equals(status)) {
			return "Đã phê duyệt";
		} else if ("3".equals(status)) {
			return "Từ chối";
		} 
		return null;
	}
//	hoanm1_20181215_end
	private String getStringForStateConstr(String status) {
		// TODO Auto-generated method stub
		if ("1".equals(status)) {
			return "Chưa phê duyệt";
		} else if ("2".equals(status)) {
			return "Đã phê duyệt";
		} else if ("3".equals(status)) {
			return "Đã từ chối";
		}
		return null;
	}

	@Override
	public List<ConstructionTaskGranttDTO> getDataConstructionGrantt(GranttDTO granttSearch) {
		List<ConstructionTaskGranttDTO> lstRs = constructionTaskDAO.getDataConstructionGrantt(granttSearch);

		Long sysGroupIndex = 0L;
		Long constructionIndex = 0L;
		Long workItemIndex = 0L;
		Long taskIndex = 0L;
		for (ConstructionTaskGranttDTO dto : lstRs) {
			if (dto.getLevelId() == 1L) {
				constructionIndex = 0L;
				dto.setOrderID(sysGroupIndex);
				sysGroupIndex++;
			} else if (dto.getLevelId() == 2L) {
				workItemIndex = 0L;
				dto.setParentID(null);
				dto.setOrderID(constructionIndex);
				constructionIndex++;
			} else if (dto.getLevelId() == 3L) {
				taskIndex = 0L;
				dto.setOrderID(workItemIndex);
				workItemIndex++;
			} else {
				dto.setOrderID(taskIndex);
				dto.setSummary(false);
				taskIndex++;
			}
		}

		return lstRs;
	}

	// Luu danh sach anh gui ve va lay ra duong dan
	public List<ConstructionImageInfo> saveConstructionImages(List<ConstructionImageInfo> lstConstructionImages) {
		List<ConstructionImageInfo> result = new ArrayList<>();
		for (ConstructionImageInfo constructionImage : lstConstructionImages) {
			if (constructionImage.getStatus() == 0) {
				ConstructionImageInfo obj = new ConstructionImageInfo();
				obj.setImageName(constructionImage.getImageName());
				obj.setLatitude(constructionImage.getLatitude());
				obj.setLongtitude(constructionImage.getLongtitude());
				InputStream inputStream = ImageUtil.convertBase64ToInputStream(constructionImage.getBase64String());
				try {
					String imagePath = UFile.writeToFileServerATTT2(inputStream, constructionImage.getImageName(),
							input_image_sub_folder_upload, folder2Upload);

					obj.setImagePath(imagePath);
				} catch (Exception e) {
					// return result;
					// throw new BusinessException("Loi khi save file", e);
					continue;
				}
				result.add(obj);
			}

			if (constructionImage.getStatus() == -1 && constructionImage.getImagePath() != "") {
				// ImageUtil.deleteFile(constructionImage.getImagePath());
				utilAttrachDocumentDao.updateUtilAttachDocumentById(constructionImage.getUtilAttachDocumentId());
			}
		}

		return result;
	}

	// Service lay danh sach anh
	public List<ConstructionImageInfo> getImageByConstructionTaskId(Long constructionTaskId) {
		List<ConstructionImageInfo> listImageResponse = new ArrayList<>();
		// lay danh sach constructionImageInfo theo constructionTaskId truyen vao
		List<ConstructionImageInfo> listImage = utilAttrachDocumentDao.getListImageByConstructionId(constructionTaskId);
		// lay list anh dua vao listImage Lay duoc
		listImageResponse = getConstructionImages(listImage);

		return listImageResponse;
	}

	// kepv_20181010_start
	/**
	 * PKE 03-10-2018 Lấy danh sách ảnh theo thông tin công trình kèm theo
	 * 
	 * @param constructionId
	 * @param type
	 * @return
	 */
	public List<ConstructionImageInfo> getImageByConstructionId_Type(Long constructionId, String type) {
		List<ConstructionImageInfo> listImageResponse = new ArrayList<>();
		//
		List<ConstructionImageInfo> listImage = utilAttrachDocumentDao.getListImageByConstructionId_Type(constructionId,
				type);
		// lay list anh dua vao listImage Lay duoc
		listImageResponse = getConstructionImages(listImage);

		return listImageResponse;
	}
	// kepv_20181010_end

	// lay danh sach ten anh va anh dinh dang base64
	public List<ConstructionImageInfo> getConstructionImages(List<ConstructionImageInfo> lstConstructionImages) {
		List<ConstructionImageInfo> result = new ArrayList<>();

		for (ConstructionImageInfo constructionImage : lstConstructionImages) {
			try {
				String fullPath = folder2Upload + File.separator + constructionImage.getImagePath();
				String base64Image = ImageUtil.convertImageToBase64(fullPath);
				ConstructionImageInfo obj = new ConstructionImageInfo();
				obj.setImageName(constructionImage.getImageName());
				obj.setBase64String(base64Image);
				obj.setImagePath(fullPath);
				obj.setStatus('1');
				obj.setUtilAttachDocumentId(constructionImage.getUtilAttachDocumentId());
				result.add(obj);
			} catch (Exception e) {
				continue;
			}

		}

		return result;
	}

	public boolean saveConstructionInfo(List<ConstructionInfoDTO> lstConstructionInfo) {
		boolean result = true;

		for (ConstructionInfoDTO item : lstConstructionInfo) {
			InputStream inputStream = ImageUtil.convertBase64ToInputStream(item.getBase64Image());

			String filePath = null;

			try {
				System.out.println("defaultSubFolderUpload");
				System.out.println(defaultSubFolderUpload);
				System.out.println("folder2Upload");
				System.out.println(folder2Upload);
				filePath = UFile.writeToFileServerATTT2(inputStream, item.getFileName(), defaultSubFolderUpload,
						folder2Upload);
				System.out.println("filePath");
				System.out.println(filePath);
			} catch (Exception e) {
				result = false;
				// throw new BusinessException("Loi khi save file", e);
			}

			item.setFilePath(filePath);

			// TODO: lưu thông tin công trình vào DB
			// Các thông tin lấy trong item
		}

		return result;
	}

	public Long checkPermissions(ConstructionDetailDTO obj, Long sysGroupId, HttpServletRequest request) {

		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.UNDO, Constant.AdResourceKey.CONSTRUCTION_PRICE,
				request)) {
			throw new IllegalArgumentException("Bạn không có quyền hủy hoàn thành");
		}
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.UNDO,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, obj.getCatProvinceId(), request)) {
			throw new IllegalArgumentException("Bạn không có quyền hủy hoàn thành cho đơn vị này");
		}
		try {
			return 0l;
		} catch (Exception e) {
			return 1l;
		}
	}
	//Tungtt_20181205_ start
	public Long checkPermissionsUndo(ConstructionDetailDTO obj, Long sysGroupId, HttpServletRequest request) {

		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.UNDO, Constant.AdResourceKey.CONSTRUCTION_PRICE,
				request)) {
			throw new IllegalArgumentException("Bạn không có quyền hủy hoàn thành");
		}
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.UNDO,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, obj.getCatProvinceId(), request)) {
			throw new IllegalArgumentException("Bạn không có quyền hủy hoàn thành cho đơn vị này");
		}
		try {
			return 0l;
		} catch (Exception e) {
			return 1l;
		}
	}
	//Tungtt_20181205_ end
	
	public Long checkPermissionsApproved(ConstructionDetailDTO obj, Long sysGroupId, HttpServletRequest request) {

		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
			throw new IllegalArgumentException("Bạn không có quyền xác nhận");
		}
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, obj.getCatProvinceId(), request)) {
			throw new IllegalArgumentException("Bạn không có quyền xác nhận cho cho đơn vị này");
		}
		try {
			return 0l;
		} catch (Exception e) {
			return 1l;
		}
	}
   //TungTT_2018_3011 start 
	public Long checkPermissionsApprovedHSHC(ConstructionDetailDTO obj, Long sysGroupId, HttpServletRequest request) {

		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.COMPLETE_CONSTRUCTION, request)) {
			throw new IllegalArgumentException("Bạn không có quyền xác nhận");
		}
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.COMPLETE_CONSTRUCTION, obj.getCatProvinceId(), request)) {
			throw new IllegalArgumentException("Bạn không có quyền xác nhận cho cho đơn vị này");
		}
		try {
			return 0l;
		} catch (Exception e) {
			return 1l;
		}
	}
	//TungTT_2018_3011 end
	
	public Long removeHSHC(ConstructionDetailDTO obj, HttpServletRequest request) {
		try {
			constructionTaskDAO.removeHSHC(obj);

			return 1l;
		} catch (Exception e) {
			return 0l;
		}
	}

	public Long removeComplete(List<String> listId, HttpServletRequest request,Long sysUserId) {
		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.UNDO, Constant.AdResourceKey.CONSTRUCTION_PRICE,
				request)) {
			throw new IllegalArgumentException("Bạn không có quyền hủy hoàn thành");
		}

		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.UNDO,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, request);

		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		Long groupIdList1 = Long.parseLong(groupIdList.get(0));

		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.UNDO,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, groupIdList1, request)) {
			throw new IllegalArgumentException("Bạn không có quyền hủy xác nhận cho đơn vị này");
		}

		try {
//			constructionTaskDAO.removeCompleteByListId(listId);

			return 1l;
		} catch (Exception e) {
			return 0l;
		}

	}

	public Long approveRevenue(List<ConstructionTaskDetailDTO> obj, Long sysUserId, HttpServletRequest request) {
		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
			throw new IllegalArgumentException("Bạn không có quyền phê duyệt");
		}

		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, request);
		//
		// List<String> groupIdList = ConvertData
		// .convertStringToList(groupId, ",");
		// Long groupIdList1 = Long.parseLong(groupIdList.get(0));

		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, obj.get(0).getCatProvinceId(), request)) {
			throw new IllegalArgumentException("Bạn không có quyền phê duyệt cho đơn vị này");
		}
		try {
			for (ConstructionTaskDetailDTO dto : obj) {
				constructionTaskDAO.approveRevenue(dto, sysUserId);
			}

			return 1l;
		} catch (Exception e) {
			return 0l;
		}
	}
	


	//TungTT_20181129_Strat
	public Long approveHSHC(ConstructionDetailDTO obj, HttpServletRequest request) {
		
		KttsUserSession user = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			 
			 constructionTaskDAO.approveRp_HSHC(obj);
			 return constructionTaskDAO.approveHSHCConstruction(obj);
			 
	}
	
	
    public Long UpdateUndoHshc(ConstructionDetailDTO obj, HttpServletRequest request) {
		
		KttsUserSession user = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			 
			 constructionTaskDAO.updateUndoHSHC(obj);
			 constructionTaskDAO.updateUndoHSHCConstruction(obj);
			 return 1l;
			 
	}
	//TungTT_20181129_end 
	
	public Long callbackConstrRevenue(ConstructionDetailDTO obj, HttpServletRequest request) {
		// if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
		// Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
		// throw new IllegalArgumentException(
		// "Bạn không có quyền undo");
		// }
		// if (!VpsPermissionChecker.checkPermissionOnDomainData(
		// Constant.OperationKey.APPROVED,
		// Constant.AdResourceKey.CONSTRUCTION_PRICE,
		// obj.getCatProvinceId(), request)) {
		// throw new IllegalArgumentException(
		// "Bạn không có quyền undo")
		// ;
		// }
		try {
			constructionTaskDAO.callbackConstrRevenue(obj);
			return 1l;
		} catch (Exception e) {
			return 0l;
		}
	}

	public Long rejectionRevenue(List<ConstructionTaskDetailDTO> obj, Long deptId, HttpServletRequest request) {

		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
			throw new IllegalArgumentException("Bạn không có quyền từ chối");
		}
		try {
			for (ConstructionTaskDetailDTO dto : obj) {
				constructionTaskDAO.rejectionRevenue(dto, deptId);
			}

			return 1l;
		} catch (Exception e) {
			return 0l;
		}
	}

	public List<ConstructionDetailDTO> searchConstruction(ConstructionDetailDTO obj, Long sysGroupId,
			HttpServletRequest request) {
		// List<ConstructionDetailDTO> ls = new ArrayList<ConstructionDetailDTO>();
		// String groupId = VpsPermissionChecker.getDomainDataItemIds(
		// Constant.OperationKey.VIEW, Constant.AdResourceKey.DATA,
		// request);
		// List<String> groupIdList = ConvertData
		// .convertStringToList(groupId, ",");
		// if (groupIdList != null && !groupIdList.isEmpty())
		// return constructionDAO.doSearch(obj, groupIdList);
		//
		// return ls;
		List<ConstructionDetailDTO> ls = new ArrayList<ConstructionDetailDTO>();
		// chinhpxn20180630_start
		String groupId;
		if (obj.getTaskType() == 3l) {
			groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
					Constant.AdResourceKey.TASK, request);
		} else {
			groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
					Constant.AdResourceKey.WORK_PROGRESS, request);
		}
		// chinhpxn20180630_end
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty())
			ls = constructionDAO.doSearch(obj, groupIdList);

		return ls;
		// return constructionDAO.doSearch1(obj);
	}

	public DataListDTO rpDailyTaskConstruction(ConstructionDetailDTO obj) {
		List<ConstructionDetailDTO> ls = constructionDAO.rpDailyTaskConstruction(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public List<ConstructionDetailDTO> searchConstructionDSTH(ConstructionDetailDTO obj, Long sysGroupId,
			HttpServletRequest request) {

		List<ConstructionDetailDTO> ls = new ArrayList<ConstructionDetailDTO>();
		String provinceId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
				Constant.AdResourceKey.EQUIPMENT_RETURN, request);
		List<String> provinceListId = ConvertData.convertStringToList(provinceId, ",");
		if (provinceListId != null && !provinceListId.isEmpty())
			ls = constructionDAO.doSearchDSTH(obj, provinceListId);

		return ls;
		// return constructionDAO.doSearch1(obj);
	}

	public List<WorkItemDetailDTO> searchWorkItems(WorkItemDetailDTO obj) {
		return workItemDAO.doSearch(obj);
	}

	public DataListDTO rpDailyTaskWorkItems(WorkItemDetailDTO obj) {
		List<WorkItemDetailDTO> ls = workItemDAO.rpDailyTaskWorkItems(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public List<WorkItemDetailDTO> searchCatTask(WorkItemDetailDTO obj) {
		return constructionDAO.doSearchCatTask(obj);
	}

	public List<SysUserDetailCOMSDTO> searchPerformer(SysUserDetailCOMSDTO obj, Long sysGroupId,
			HttpServletRequest request) {
		List<SysUserDetailCOMSDTO> ls = new ArrayList<SysUserDetailCOMSDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.WORK_PROGRESS, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty())
			ls = constructionDAO.doSearchPerformer(obj, groupIdList);
		return ls;
	}

	public Long updatePerfomer(ConstructionTaskDTO obj) {
		constructionTaskDAO.updatePerfomer(obj);
		return obj.getConstructionTaskId();
	}

	public DataListDTO exportPdf(CommonDTO dto) {
		ConstructionTaskDetailDTO obj = new ConstructionTaskDetailDTO();
		List<ConstructionTaskDetailDTO> ls = constructionTaskDAO.doSearchForReport(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public Response exportPdfService(String userName) throws Exception {
		if (userName != null) {
			ConstructionTaskDetailDTO obj = new ConstructionTaskDetailDTO();
			obj.setUserName(userName);
			obj.setPage(1L);
			obj.setPageSize(null);
			String sysGroupName = constructionTaskDAO.getDataSysGroupNameByUserName(obj.getUserName());
			List<ConstructionTaskDetailDTO> data = constructionTaskDAO.doSearchForReport(obj);
			// Date dateNow = new Date();
			// ExportPxkDTO data = constructionBusinessImpl.NoSynStockTransDetaill(dto);
			ConcurrentHashMap<String, Object> params = new ConcurrentHashMap<String, Object>();
			ClassLoader classloader = Thread.currentThread().getContextClassLoader();
			String reportPath = classloader.getResource("../" + "doc-template").getPath();
			String filePath = reportPath + "/YeuCauCoSerial.jasper";
			JRBeanCollectionDataSource tbl2 = new JRBeanCollectionDataSource(data);
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
			if (sysGroupName != null) {
				params.put("sysGroupName", sysGroupName);
			}

			JasperPrint jasperPrint = JasperFillManager.fillReport(filePath, params, new JREmptyDataSource());
			jasperPrint.addStyle(JasperReportConfig.getNormalStyle(reportPath));
			String pathReturn = generateLocationFile();
			File udir = new File(folderUpload + pathReturn);
			if (!udir.exists()) {
				udir.mkdirs();
			}
			File file = new File(folderUpload + pathReturn + File.separator + "YeuCauCoSerial.pdf");
			// JasperExportManager.exportReportToPdfFile(jasperPrint,folderUpload+pathReturn
			// +"KehoachThangChiTiet.pdf");
			JRDocxExporter exporter = new JRDocxExporter();
			exporter.setParameter(JRExporterParameter.CHARACTER_ENCODING, "UTF-8");
			exporter.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
			exporter.setParameter(JRExporterParameter.OUTPUT_FILE, file);
			exporter.exportReport();
			if (file.exists()) {
				ResponseBuilder response = Response.ok(file);
				response.header("Content-Disposition", "attachment; filename=\"" + "YeuCauKhongSerial.pdf" + "\"");
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

	public List<ConstructionTaskDetailDTO> getDataForExport(ConstructionTaskDetailDTO obj) {
		return constructionTaskDAO.doSearchForReport(obj);
	}

	public ConstructionTaskGranttDTO getCountConstruction(GranttDTO obj, Long sysGroupId, HttpServletRequest request) {
		// TODO Auto-generated method stub
		ConstructionTaskGranttDTO lstRs = new ConstructionTaskGranttDTO();
		lstRs.setTaskAll(0L);
		lstRs.setTaskPause(0L);
		lstRs.setTaskSlow(0L);
		lstRs.setTaskUnfulfilled(0L);
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.WORK_PROGRESS, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty())
			lstRs = constructionTaskDAO.getCountConstruction(obj, groupIdList);
		return lstRs;
	}

	public ConstructionTaskGranttDTO getCountConstructionForTc(GranttDTO obj) {
		// TODO Auto-generated method stub
		return constructionTaskDAO.getCountConstructionForTc(obj);
	}

	public List<ConstructionStationWorkItemDTO> getNameConstruction(SysUserRequest request) {
		int isManage = constructionDAO.getByAdResourceCon(request, CREATE_TASK);
		if (isManage == 0) {
			List<ConstructionStationWorkItemDTO> lst = constructionDAO
					.getListConstructionByIdSysGroupIdCreate_task(request);
			return lst;
		} else {
			List<DomainDTO> isManage1 = null;
			List<ConstructionStationWorkItemDTO> lst = constructionDAO.getListConstructionByIdSysGroupId(request,
					isManage1);
			return lst;
		}
	}

	public List<AppParamDTO> getAmountSLTN(Long id) {
		List<AppParamDTO> listCode = constructionDAO.getAmountSLTN(id);
		List<AppParamDTO> listNew = new ArrayList<AppParamDTO>();
		if (listCode.size() > 0) {
			for (AppParamDTO dto : listCode) {
				AppParamDTO newObj = new AppParamDTO();
				String name = constructionDAO.getName(dto.getCode());
				newObj.setName(name);
				newObj.setAmount(dto.getAmount());
				newObj.setCode(dto.getCode());
				newObj.setConfirm(dto.getConfirm());
				// hoanm1_20180703_start
				newObj.setConstructionTaskDailyId(dto.getConstructionTaskDailyId());
				// hoanm1_20180703_end
				listNew.add(newObj);
			}
		}
		return listNew;
	}

	public Double getProcess(ConstructionTaskDTOUpdateRequest request) {
		Double total = constructionTaskDailyDAO.getTotal(request);
		if (request.getConstructionTaskDTO().getAmount() != null && request.getConstructionTaskDTO().getAmount() != 0) {
			Double result = (total / (request.getConstructionTaskDTO().getAmount())) * 100;
			Double a = (double) Math.round(result);
			return a;
		} else {
			return 0D;
		}
	}

	public Double getAmountPreview(ConstructionTaskDTOUpdateRequest request) {
		return constructionTaskDailyDAO.getAmountPreview(request.getConstructionTaskDTO().getWorkItemId(),
				request.getConstructionTaskDTO().getCatTaskId());
	}

	public int getListConfirmDaily(ConstructionTaskDTOUpdateRequest request) {
		return constructionTaskDailyDAO.getListConfirmDaily(request.getConstructionTaskDTO().getConstructionTaskId());
	}

	// chinhpxn20180716_start

	@SuppressWarnings("deprecation")
	private boolean checkIfRowIsEmpty(Row row) {
		if (row == null) {
			return true;
		}
		if (row.getLastCellNum() <= 0) {
			return true;
		}
		for (int cellNum = row.getFirstCellNum(); cellNum < row.getLastCellNum(); cellNum++) {
			Cell cell = row.getCell(cellNum);
			if (cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK
					&& !StringUtils.isStringNullOrEmpty(cell.toString())) {
				return false;
			}
		}
		return true;
	}

	private ExcelErrorDTO createError(int row, String column, String detail) {
		ExcelErrorDTO err = new ExcelErrorDTO();
		err.setColumnError(column);
		err.setLineError(String.valueOf(row));
		err.setDetailError(detail);
		return err;
	}

	public boolean validateRequiredCell(Row row, List<ExcelErrorDTO> errorList, Long actionType) {
		DataFormatter formatter = new DataFormatter();
		boolean result = true;
		if (actionType == 1) {
			for (int colIndex : validateCol) {
				if (!validateString(formatter.formatCellValue(row.getCell(colIndex)))) {
					ExcelErrorDTO errorDTO = new ExcelErrorDTO();
					errorDTO.setColumnError(colAlias.get(colIndex));
					errorDTO.setLineError(String.valueOf(row.getRowNum() + 1));
					errorDTO.setDetailError(colName.get(colIndex) + " chưa nhập");
					errorList.add(errorDTO);
					result = false;
				}

			}
		} else {
			for (int colIndex : validateColForAddTask) {
				if (!validateString(formatter.formatCellValue(row.getCell(colIndex)))) {
					ExcelErrorDTO errorDTO = new ExcelErrorDTO();
					errorDTO.setColumnError(colAlias.get(colIndex));
					errorDTO.setLineError(String.valueOf(row.getRowNum() + 1));
					errorDTO.setDetailError(colName.get(colIndex) + " chưa nhập");
					errorList.add(errorDTO);
					result = false;
				}

			}
		}

		return result;
	}

	public List<ConstructionTaskDetailDTO> importConstructionTask(String fileInput, HttpServletRequest request,
			Long month, Long year, Long actionType, Long sysGroupId) throws Exception {
		List<ConstructionTaskDetailDTO> workLst = Lists.newArrayList();
		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();

		try {
			File f = new File(fileInput);
			ZipSecureFile.setMinInflateRatio(-1.0d);
			XSSFWorkbook workbook = new XSSFWorkbook(f);
			XSSFSheet sheet = workbook.getSheetAt(0);
			DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			DataFormatter formatter = new DataFormatter();
			int count = 0;

			HashMap<String, String> constructionMap = new HashMap<String, String>();
			List<ConstructionDetailDTO> constructionLst = constructionDAO.getConstructionForImportTask();
			for (ConstructionDetailDTO obj : constructionLst) {
				// if (obj.getCode() != null) {
				constructionMap.put(obj.getCode().toUpperCase(), obj.getConstructionId().toString());
				// }
			}

			HashMap<String, String> workItemMap = new HashMap<String, String>();
			HashMap<String, String> workItemMap2 = new HashMap<String, String>();
			List<WorkItemDetailDTO> workItemLst = workItemDAO.getWorkItemByName(month, year);
			for (WorkItemDetailDTO obj : workItemLst) {
				if (obj.getConstructionCode() != null && obj.getName() != null) {
					workItemMap.put(
							obj.getConstructionCode().toUpperCase().trim() + "|" + obj.getName().toUpperCase().trim(),
							String.valueOf(obj.getWorkItemId()));
					workItemMap2.put(
							obj.getConstructionCode().toUpperCase().trim() + "|" + obj.getName().toUpperCase().trim(),
							obj.getStatus());
				}

			}

			HashMap<String, String> constructionTaskMap = new HashMap<String, String>();
			HashMap<String, String> constructionTaskMap2 = new HashMap<String, String>();
			HashMap<String, String> constructionTaskMap3 = new HashMap<String, String>();
			HashMap<String, Long> constructionTaskMap4 = new HashMap<String, Long>();
			HashMap<String, Long> constructionTaskMap5 = new HashMap<String, Long>();
			List<ConstructionTaskDetailDTO> constructionTaskLst = constructionTaskDAO.getConstructionTaskByDMP(month,
					year, 3l, actionType, sysGroupId);
			for (ConstructionTaskDetailDTO ct : constructionTaskLst) {
				constructionTaskMap.put(ct.getConstructionId() + "|" + ct.getWorkItemId(),
						String.valueOf(ct.getConstructionTaskId()));
				constructionTaskMap2.put(ct.getConstructionId() + "|" + ct.getWorkItemId(), ct.getTaskName());
				constructionTaskMap3.put(ct.getConstructionId() + "|" + ct.getWorkItemId(), ct.getType());
				constructionTaskMap4.put(ct.getConstructionId() + "|" + ct.getWorkItemId(), ct.getParentId());
				constructionTaskMap5.put(ct.getConstructionId() + "|" + ct.getWorkItemId(), ct.getPerformerId());
			}
			// hoanm1_20181023_start
			HashMap<String, String> userMapLogin = new HashMap<String, String>();
			HashMap<String, String> userMapEmail = new HashMap<String, String>();
			List<SysUserDTO> lstUser = constructionTaskDAO.getListUser();
			for (SysUserDTO sys : lstUser) {
				userMapLogin.put(sys.getLoginName(), sys.getUserId().toString());
				userMapEmail.put(sys.getEmail(), sys.getUserId().toString());
			}
			// hoanm1_20181023_end
			for (Row row : sheet) {
				count++;
				if (count >= 3 && checkIfRowIsEmpty(row))
					continue;
				ConstructionTaskDetailDTO obj = new ConstructionTaskDetailDTO();
				if (count >= 3) {
					if (!validateRequiredCell(row, errorList, actionType))
						continue;
					// kiểm tra các ô bắt buộc nhập đã dc nhập chưa

					String constructionCode = formatter.formatCellValue(row.getCell(1)).trim();
					String workItemName = formatter.formatCellValue(row.getCell(2)).toString().trim();
					String performer = formatter.formatCellValue(row.getCell(3)).toString().trim();
					String startDate = formatter.formatCellValue(row.getCell(4)).toString().trim();
					String endDate = formatter.formatCellValue(row.getCell(5)).toString().trim();
					String quantity = "";
					if (actionType == 0) {
						quantity = formatter.formatCellValue(row.getCell(6)).toString().trim();
					}
					Long constructionId = 0l;
					Long workItemId = 0l;

					if (validateString(constructionCode)) {
						try {
							constructionId = Long.parseLong(constructionMap.get(constructionCode.toUpperCase()));
							obj.setConstructionId(constructionId);
							obj.setConstructionCode(constructionCode);
						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1),
									colName.get(1) + " không tồn tại!");
							errorList.add(errorDTO);
						}
					}
					if (actionType == 1) {
						if (validateString(workItemName)) {
							try {
								if (workItemMap2.get(
										constructionCode.toUpperCase().trim() + "|" + workItemName.toUpperCase().trim())
										.equals("3")) {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2),
											"Hạng mục đã hoàn thành không được phép chuyển người!");
									errorList.add(errorDTO);
								} else {
									workItemId = Long.parseLong(workItemMap.get(constructionCode.toUpperCase().trim()
											+ "|" + workItemName.toUpperCase().trim()));
									obj.setWorkItemId(workItemId);
									obj.setWorkItemName(workItemName);
								}
							} catch (Exception e) {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2),
										colName.get(2) + " không tồn tại trong kế hoạch tháng! ");
								errorList.add(errorDTO);
							}
						}
					} else {
						if (validateString(workItemName)) {
							try {
								// if (workItemDAO.getWorkItemByCodeNew(workItemName,
								// constructionCode).getStatus()
								// .equals("3")) {
								if (workItemMap2.get(
										constructionCode.toUpperCase().trim() + "|" + workItemName.toUpperCase().trim())
										.equals("3")) {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2),
											"Hạng mục đã hoàn thành không được phép import!");
									errorList.add(errorDTO);
								} else {
									// workItemId = workItemDAO.getWorkItemByCodeNew(workItemName, constructionCode)
									// .getWorkItemId();
									workItemId = Long.parseLong(workItemMap.get(constructionCode.toUpperCase().trim()
											+ "|" + workItemName.toUpperCase().trim()));
									obj.setWorkItemId(workItemId);
									obj.setWorkItemName(workItemName);
								}
							} catch (Exception e) {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2),
										colName.get(2) + " không tồn tại! ");
								errorList.add(errorDTO);
							}
						}
					}

					if (actionType == 0) {
						// check cong trinh+hang muc da ton tai trong ke hoach thang chua
						String key = obj.getConstructionId() + "|" + obj.getWorkItemId();
						if (constructionTaskMap.get(key) != null) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "B, C",
									"Hạng mục tên: [" + obj.getWorkItemName() + "] thuộc công trình có mã: ["
											+ obj.getConstructionCode() + "] đã tồn tại trong kế hoạch tháng " + month
											+ "/" + year + "!");
							errorList.add(errorDTO);
						}
					} else {
						// check cong trinh+hang muc da ton tai trong ke hoach thang chua
						String key = obj.getConstructionId() + "|" + obj.getWorkItemId();
						if (constructionTaskMap.get(key) == null) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "B, C",
									"Mã công trình: " + obj.getConstructionCode() + ", tên hạng mục: " + workItemName
											+ " không tồn tại trong kế hoạch tháng!");
							errorList.add(errorDTO);
						} else {
							obj.setConstructionTaskId(Long.parseLong(constructionTaskMap.get(key)));
							obj.setOldPerformerId(constructionTaskMap5.get(key));
							obj.setTaskName(constructionTaskMap2.get(key));
							obj.setType(constructionTaskMap3.get(key));
							obj.setParentId(constructionTaskMap4.get(key));
						}
					}

					if (validateString(performer)) {
						try {
							// hoanm1_20181023_start
							String userId = "";
							userId = userMapLogin.get(performer.toUpperCase().trim());
							if (userId == null) {
								userId = userMapEmail.get(performer.toUpperCase().trim());
							}
							obj.setPerformerId(Long.parseLong(userId));
							// hoanm1_20181023_end
						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3),
									colName.get(3) + " không hợp lệ!");
							errorList.add(errorDTO);
						}
					}

					if (validateString(startDate)) {
						try {
							Date startDateVal = dateFormat.parse(startDate);
							if (validateDate(startDate)) {
								obj.setStartDate(startDateVal);
							} else {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4),
										colName.get(4) + " không hợp lệ!");
								errorList.add(errorDTO);
							}

							// obj.setStartDate(dateFormat.parse(startDate));
						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4),
									colName.get(4) + " không hợp lệ!");
							errorList.add(errorDTO);
						}
					}

					if (validateString(endDate)) {
						try {
							// obj.setEndDate(dateFormat.parse(endDate));
							Date endDateVal = dateFormat.parse(endDate);
							if (validateDate(endDate)) {
								obj.setEndDate(endDateVal);
							} else {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5),
										colName.get(5) + " không hợp lệ!");
								errorList.add(errorDTO);
							}
						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5),
									colName.get(5) + " không hợp lệ!");
							errorList.add(errorDTO);
						}
					}
					// hoanm1_20181023_start_comment
					// if (obj.getEndDate() != null && obj.getStartDate() != null) {
					// if (obj.getEndDate().getTime() < obj.getStartDate().getTime()) {
					// ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "E, F",
					// "Thời gian kết thúc phải lớn hơn thời gian bắt đầu!");
					// errorList.add(errorDTO);
					// }
					// }
					// hoanm1_20181023_end_comment
					if (actionType == 0) {
						if (validateString(quantity)) {
							try {
								// if (quantity.length() > 14) {
								// ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6),
								// colName.get(6) + " có độ dài vượt quá 14 số! ");
								// errorList.add(errorDTO);
								// }
								if (NumberUtils.isNumber(quantity)) {
									obj.setQuantity(Double.parseDouble(quantity));
								} else {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6),
											colName.get(6) + " không hợp lệ! ");
									errorList.add(errorDTO);
								}

							} catch (Exception e) {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6),
										colName.get(6) + " không hợp lệ! ");
								errorList.add(errorDTO);
							}
						}
					}

					if (errorList.size() == 0) {
						workLst.add(obj);
					}
				}
			}

			if (errorList.size() > 0) {
				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
				List<ConstructionTaskDetailDTO> emptyArray = Lists.newArrayList();
				workLst = emptyArray;
				ConstructionTaskDetailDTO errorContainer = new ConstructionTaskDetailDTO();
				errorContainer.setErrorList(errorList);
				if (actionType == 0) {
					errorContainer.setMessageColumn(7); // cột dùng để in ra lỗi
				} else {
					errorContainer.setMessageColumn(6); // cột dùng để in ra lỗi
				}

				errorContainer.setFilePathError(filePathError);
				workLst.add(errorContainer);
			}

			workbook.close();
			return workLst;

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ExcelErrorDTO errorDTO = createError(0, "", e.toString());
			errorList.add(errorDTO);
			String filePathError = null;
			try {
				filePathError = UEncrypt.encryptFileUploadPath(fileInput);
			} catch (Exception ex) {
				LOGGER.error(e.getMessage(), e);
				errorDTO = createError(0, "", ex.toString());
				errorList.add(errorDTO);
			}
			List<ConstructionTaskDetailDTO> emptyArray = Lists.newArrayList();
			workLst = emptyArray;
			ConstructionTaskDetailDTO errorContainer = new ConstructionTaskDetailDTO();
			errorContainer.setErrorList(errorList);
			if (actionType == 0) {
				errorContainer.setMessageColumn(7); // cột dùng để in ra lỗi
			} else {
				errorContainer.setMessageColumn(6); // cột dùng để in ra lỗi
			}
			errorContainer.setFilePathError(filePathError);
			workLst.add(errorContainer);
			return workLst;
		}
	}

	public List<ConstructionTaskDetailDTO> updateListConstructionTaskPerformer(List<ConstructionTaskDetailDTO> result,
			Long month, Long year, String fileInput, Long actionType, Long sysGroupId, KttsUserSession user) {
		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();

		HashMap<String, Long> checkDupMap = new HashMap<String, Long>();
		Long i = 0L;
		try {
			for (ConstructionTaskDetailDTO obj : result) {
				String key = obj.getConstructionId() + "|" + obj.getWorkItemId();
				if (checkDupMap.get(key) == null) {
					checkDupMap.put(key, i++);
				} else {
					continue;
				}
				constructionTaskDAO.updateConstructionTaskPerformerId(obj);
				constructionTaskDAO.updateWorkItemPerformerId(obj);
				createSendSmsEmail(obj, user);
				createSendSmsEmailToConvert(obj, user);
				// hoanm1_20180723_start
				obj.setSysGroupId(sysGroupId);
				// hoanm1_20180723_end
				createSendSmsEmailToOperator(obj, user);
			}
		} catch (Exception e) {
			try {
				result.clear();
				ExcelErrorDTO errorDTO = createError(0, "Lỗi phần mềm", e.toString());
				errorList.add(errorDTO);
				ConstructionTaskDetailDTO errorContainer = new ConstructionTaskDetailDTO();
				errorContainer.setErrorList(errorList);
				errorContainer.setMessageColumn(6); // cột dùng để in ra lỗi
				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
				errorContainer.setFilePathError(filePathError);
				result.add(errorContainer);
			} catch (Exception ex) {
				LOGGER.error(ex.getMessage(), ex);
			}
		}

		return result;
	}

	public List<ConstructionTaskDetailDTO> addListConstructionTask(KttsUserSession user,
			List<ConstructionTaskDetailDTO> result, Long month, Long year, String fileInput, Long actionType,
			Long sysGroupId, Long detailMonthPlanId) {
		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
		HashMap<String, Long> checkDupMap = new HashMap<String, Long>();
		// hoanm1_20181024_start
		HashMap<Long, String> sysGroupMap = new HashMap<Long, String>();
		List<DepartmentDTO> lstGroup = constructionTaskDAO.getListGroup();
		for (DepartmentDTO sys : lstGroup) {
			sysGroupMap.put(sys.getDepartmentId(), sys.getName());
		}
		Long checkGroupLevel1 = constructionTaskDAO.getLevel1SysGroupId(sysGroupId, "1", detailMonthPlanId);
		HashMap<String, Long> constructionCodeMap = new HashMap<String, Long>();
		List<ConstructionTaskDetailDTO> lstConstructionCode = constructionTaskDAO.getLevel2ConstructionCode("1", 2L,
				detailMonthPlanId, sysGroupId);
		for (ConstructionTaskDetailDTO code : lstConstructionCode) {
			constructionCodeMap.put(code.getConstructionCode(), code.getConstructionTaskId());
		}
		// hoanm1_20181024_end
		try {
			Long i = 0L;
			for (ConstructionTaskDetailDTO dto : result) {
				String key = dto.getConstructionId() + "|" + dto.getWorkItemId() + "|" + dto.getPerformerId();
				if (checkDupMap.get(key) == null) {
					checkDupMap.put(key, i++);
				} else {
					continue;
				}
				dto.setLevelId(3L);
				dto.setMonth(month);
				dto.setSysGroupId(sysGroupId);
				dto.setYear(year);
				dto.setType("1");
				dto.setDetailMonthPlanId(detailMonthPlanId);
				// hoanm1_20181024_start
				dto.setSysGroupName(sysGroupMap.get(sysGroupId));
				// hoanm1_20181024_end
				getParentTaskForThiCong(dto, "1", detailMonthPlanId, sysGroupId, checkGroupLevel1, constructionCodeMap);
				dto.setPerformerWorkItemId(dto.getPerformerId());
				// hoanm1_20181023_start
				// WorkItemDetailDTO work =
				// workItemDAO.getWorkItemByCodeNew(dto.getWorkItemName(),
				// dto.getConstructionCode());
				// dto.setTaskName(work.getName());
				// dto.setWorkItemId(work.getWorkItemId());
				dto.setTaskName(dto.getWorkItemName());
				dto.setWorkItemId(dto.getWorkItemId());
				// hoanm1_20181023_end
				dto.setBaselineStartDate(dto.getStartDate());
				dto.setBaselineEndDate(dto.getEndDate());
				dto.setStatus("1");
				dto.setCompleteState("1");
				dto.setPerformerWorkItemId(dto.getPerformerId());
				// hoanm1_20181023_start
				// if (dto.getSupervisorId() == null)
				// dto.setSupervisorId(
				// Double.parseDouble(constructionTaskDAO.getSuperVisorId(dto.getConstructionCode())));
				// if (dto.getDirectorId() == null)
				// dto.setDirectorId(Double.parseDouble(constructionTaskDAO.getDirectorId(dto.getConstructionCode())));
				// hoanm1_20181023_end
				dto.setCreatedDate(new Date());
				dto.setCreatedUserId(user.getVpsUserInfo().getSysUserId());
				dto.setCreatedGroupId(user.getVpsUserInfo().getSysGroupId());

				ConstructionTaskBO bo = dto.toModel();
				Long id = constructionTaskDAO.saveObject(bo);
				detailMonthPlanDAO.updatePerforment(dto.getPerformerId(), dto.getWorkItemId());
				bo.setPath(dto.getPath() + id + "/");
				dto.setPath(dto.getPath() + id + "/");
				dto.setConstructionTaskId(id);
				constructionTaskDAO.updateObject(bo);
				createSendSmsEmail(dto, user);
				if (dto.getWorkItemId() != null)
					insertTaskByWorkItem("1", dto.getWorkItemId(), dto);

			}
		} catch (Exception e) {
			try {
				ExcelErrorDTO errorDTO = createError(0, "Lỗi phần mềm", e.toString());
				errorList.add(errorDTO);
				result.clear();
				ConstructionTaskDetailDTO errorContainer = new ConstructionTaskDetailDTO();
				errorContainer.setErrorList(errorList);
				errorContainer.setMessageColumn(7); // cột dùng để in ra lỗi
				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
				errorContainer.setFilePathError(filePathError);
				result.add(errorContainer);
			} catch (Exception ex) {
				LOGGER.error(ex.getMessage(), ex);
			}
		}
		return result;
	}

	private void getParentTaskForThiCong(ConstructionTaskDetailDTO dto, String type, Long detailMonthPlanId,
			Long sysGroupId, Long provinceLevelId, HashMap<String, Long> constructionCodeMap) {
		// TODO Auto-generated method stub
		ConstructionTaskDetailDTO provinceLevel = new ConstructionTaskDetailDTO();
		ConstructionTaskDetailDTO constructionLevel = new ConstructionTaskDetailDTO();
		if (sysGroupId != null) {
			// hoanm1_20181024_start
			// provinceLevel = constructionTaskDAO.getLevel1BySysGroupId(sysGroupId, type,
			// detailMonthPlanId);
			// Long provinceLevelId = provinceLevel.getConstructionTaskId();
			// if (provinceLevel.getConstructionTaskId() == null) {//
			if (provinceLevelId == 0L || provinceLevelId == null) {
				// constructionTaskDAO.deleteConstructionTask(type, 1L, detailMonthPlanId);
				// hoanm1_20181023_end
				provinceLevel.setType(type);
				// hoanm1_20181024_start
				// provinceLevel.setTaskName(constructionTaskDAO.getDivisionCodeSysGroupId(sysGroupId));
				provinceLevel.setTaskName(dto.getSysGroupName());
				// hoanm1_20181024_end
				provinceLevel.setLevelId(1L);
				provinceLevel.setSysGroupId(sysGroupId);
				provinceLevel.setDetailMonthPlanId(detailMonthPlanId);
				provinceLevel.setMonth(dto.getMonth());
				provinceLevel.setYear(dto.getYear());
				provinceLevel.setStatus("1");
				provinceLevel.setCompleteState("1");
				ConstructionTaskBO bo = provinceLevel.toModel();
				provinceLevelId = constructionTaskDAO.saveObject(bo);
				bo.setPath("/" + provinceLevelId + "/");
				bo.setConstructionTaskId(provinceLevelId);
				constructionTaskDAO.update(bo);
				constructionTaskDAO.getSession().flush();
				// hoanm1_20181023_start
				// constructionTaskDAO.updateChildRecord(bo, detailMonthPlanId);
				// hoanm1_20181023_end

			}
			if (!StringUtils.isNullOrEmpty(dto.getConstructionCode())) {
				// constructionLevel =
				// constructionTaskDAO.getConstructionTaskByConstructionCode(dto.getConstructionCode(),
				// type, 2L, detailMonthPlanId);
				Long constructionLevelId = 0L;
				constructionLevelId = constructionCodeMap.get(dto.getConstructionCode());
				// Long constructionLevelId = constructionLevel.getConstructionTaskId();
				// if (constructionLevel.getConstructionTaskId() == null) {
				if (constructionLevelId == null) {
					constructionLevel.setType(type);
					constructionLevel.setTaskName(dto.getConstructionCode());
					constructionLevel.setLevelId(2L);
					constructionLevel.setDetailMonthPlanId(detailMonthPlanId);
					constructionLevel.setParentId(provinceLevelId);
					constructionLevel.setMonth(dto.getMonth());
					constructionLevel.setYear(dto.getYear());
					constructionLevel.setConstructionId(dto.getConstructionId());
					constructionLevel.setSysGroupId(sysGroupId);
					constructionLevel.setStatus("1");
					constructionLevel.setSupervisorId(dto.getSupervisorId());
					constructionLevel.setDirectorId(dto.getDirectorId());
					constructionLevel.setCompleteState("1");
					ConstructionTaskBO bo = constructionLevel.toModel();
					constructionLevelId = constructionTaskDAO.saveObject(bo);
					bo.setConstructionTaskId(constructionLevelId);
					bo.setPath("/" + provinceLevelId + "/" + constructionLevelId + "/");
					constructionTaskDAO.updateObject(bo);
					constructionTaskDAO.getSession().flush();
					constructionCodeMap.put(dto.getConstructionCode(), constructionLevelId);
				}
				dto.setParentId(constructionLevelId);
				dto.setPath("/" + provinceLevelId + "/" + constructionLevelId + "/");
			}
		}
	}

	private void insertTaskByWorkItem(String type, Long workItemId, ConstructionTaskDetailDTO parent) {
		// TODO Auto-generated method stub
		List<ConstructionTaskDTO> list = constructionTaskDAO.getTaskByWorkItem(workItemId);
		if (list != null && !list.isEmpty()) {
			for (ConstructionTaskDTO dto : list) {
				dto.setLevelId(4L);
				dto.setMonth(parent.getMonth());
				dto.setSysGroupId(parent.getSysGroupId());
				dto.setYear(parent.getYear());
				dto.setType(type);
				dto.setWorkItemId(workItemId);
				dto.setStartDate(parent.getStartDate());
				dto.setEndDate(parent.getEndDate());
				dto.setBaselineStartDate(parent.getStartDate());
				dto.setBaselineEndDate(parent.getEndDate());
				dto.setPerformerWorkItemId(parent.getPerformerId());
				dto.setPerformerId(parent.getPerformerId());
				dto.setDetailMonthPlanId(parent.getDetailMonthPlanId());
				dto.setParentId(parent.getConstructionTaskId());
				// hoanm1_20181023_start
				// dto.setSupervisorId(
				// Double.parseDouble(constructionTaskDAO.getSuperVisorId(parent.getConstructionCode())));
				// dto.setDirectorId(Double.parseDouble(constructionTaskDAO.getDirectorId(parent.getConstructionCode())));
				// hoanm1_20181023_end
				dto.setCompleteState("1");
				dto.setStatus("1");
				dto.setConstructionId(parent.getConstructionId());
				ConstructionTaskBO bo = dto.toModel();
				Long id = constructionTaskDAO.saveObject(bo);
				bo.setPath(parent.getPath() + id + "/");
				bo.setConstructionTaskId(id);
				constructionTaskDAO.updateObject(bo);
			}
		}

	}

	public DetailMonthPlanDTO getDetailMonthPlanId(Long month, Long year, Long sysGroupId) {
		return constructionTaskDAO.getDetailMonthPlanId(month, year, sysGroupId);
	}

	// chinhpxn20180716_end

	// chinhpxn20180718_start
	public int createSendSmsEmail(ConstructionTaskDTO request, KttsUserSession user) {
		return constructionTaskDAO.createSendSmsEmail(request, user);
	}

	public int createSendSmsEmailToConvert(ConstructionTaskDTO request, KttsUserSession user) {
		return constructionTaskDAO.createSendSmsEmailToConvert(request, user);
	}

	public int createSendSmsEmailToOperator(ConstructionTaskDTO request, KttsUserSession user) {
		return constructionTaskDAO.createSendSmsEmailToOperator(request, user);
	}
	// chinhpxn20180718_end

	@SuppressWarnings("unlikely-arg-type")
	public ConstructionTaskDTO getListImageById(ConstructionTaskDTO obj) throws Exception {
		ConstructionTaskDTO data = new ConstructionTaskDTO();
		List<Long> listConstructionTaskId = new ArrayList<>();
		if (obj.getLevelId() == 4l) {
			listConstructionTaskId.add(obj.getId());
		} else {
			listConstructionTaskId = constructionTaskDAO.getListConstructionTask(obj.getId());
		}
		if (listConstructionTaskId != null) {
			List<UtilAttachDocumentDTO> listImage = utilAttachDocumentDAO
					.getByTypeAndObjectListConstructionTask(listConstructionTaskId, 44L);
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

	// hoanm1_20180815_start
	// @Override
	public List<ConstructionTaskDTO> rpSumTask(ConstructionTaskDTO dto, List<String> groupIdList) {
		return constructionTaskDAO.rpSumTask(dto, groupIdList);
	}
	// hoanm1_20180815_end

	public String exportExcelRpSumTask(ConstructionTaskDTO obj, HttpServletRequest request) throws Exception {
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Export_congviec_tonghop.xlsx"));
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
				udir.getAbsolutePath() + File.separator + "Export_congviec_tonghop.xlsx");
		List<ConstructionTaskDTO> data = new ArrayList<ConstructionTaskDTO>();
		// hoanm1_20180815_start
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		data = constructionTaskDAO.rpSumTask(obj, groupIdList);
		// hoanm1_20180815_end
		List<ConstructionTaskDTO> dataSheet2 = constructionTaskDAO.getDataSheetTwoExcel(obj,groupIdList);// Huypq-20181105-edit
		XSSFSheet sheet = workbook.getSheetAt(0);
		if ((data != null && !data.isEmpty()) || (dataSheet2 != null && !dataSheet2.isEmpty())) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-20/8/2018-edit-start
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.00"));
			XSSFCellStyle styleNumber2 = ExcelUtils.styleNumber(sheet);
			styleNumber2.setDataFormat(workbook.createDataFormat().getFormat("0"));
			// HuyPQ-20/8/2018-edit-end
			// HuyPQ-22/08/2018-start
			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			styleDate.setAlignment(HorizontalAlignment.CENTER);
			int i = 3;
			int j = 5; // Huypq-20181105-edit
			int m = 3; // Huypq-20181105-edit
			for (ConstructionTaskDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 3));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getFullName() != null) ? dto.getFullName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getContractCode() != null) ? dto.getContractCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getProvinceCode() != null) ? dto.getProvinceCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getStationCode() != null) ? dto.getStationCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getConstructionTypeName() != null) ? dto.getConstructionTypeName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue((dto.getWorkItemName() != null) ? dto.getWorkItemName() : "");
				cell.setCellStyle(style);
				// HuyPQ-20/8/2018-edit-start
				cell = row.createCell(9, CellType.NUMERIC);
				cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
				cell.setCellStyle(styleNumber);
				// HuyPQ-20/8/2018-edit-end
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue((dto.getTCTT() != null) ? dto.getTCTT() : "");
				cell.setCellStyle(style);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue((dto.getGiam_sat() != null) ? dto.getGiam_sat() : "");
				cell.setCellStyle(style);
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue((dto.getKetthuc_trienkhai() != null) ? dto.getKetthuc_trienkhai() : null);
				cell.setCellStyle(styleDate);
				cell = row.createCell(13, CellType.STRING);
				cell.setCellValue((dto.getThicong_xong() != null) ? dto.getThicong_xong() : "");
				cell.setCellStyle(style);
				cell = row.createCell(14, CellType.STRING);
				cell.setCellValue((dto.getDang_thicong() != null) ? dto.getDang_thicong() : "");
				cell.setCellStyle(style);
				cell = row.createCell(15, CellType.STRING);
				cell.setCellValue((dto.getLuy_ke() != null) ? dto.getLuy_ke() : "");
				cell.setCellStyle(style);
				cell = row.createCell(16, CellType.STRING);
				cell.setCellValue((dto.getChua_thicong() != null) ? dto.getChua_thicong() : "");
				cell.setCellStyle(style);
				cell = row.createCell(17, CellType.STRING);
				cell.setCellValue((dto.getVuong() != null) ? dto.getVuong() : "");
				cell.setCellStyle(style);
				cell = row.createCell(18, CellType.STRING);
				cell.setCellValue((dto.getBatdau_thicong() != null) ? dto.getBatdau_thicong() : null);
				cell.setCellStyle(styleDate);
				cell = row.createCell(19, CellType.STRING);
				cell.setCellValue((dto.getKetthuc_thicong() != null) ? dto.getKetthuc_thicong() : null);
				cell.setCellStyle(styleDate);
			}
			// Huypq-20181105-start
			for (int k = 0; k < 1; k++) {

				XSSFSheet createSheet = workbook.getSheetAt(1);

				for (ConstructionTaskDTO dto : dataSheet2) {
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
						cell2.setCellValue((dto.getWorkItemPartFinish() != null) ? dto.getWorkItemPartFinish() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(6, CellType.STRING);
						cell2.setCellValue((dto.getQuantityPartFinish() != null) ? dto.getQuantityPartFinish() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(7, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemConsFinish() != null) ? dto.getWorkItemConsFinish() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(8, CellType.STRING);
						cell2.setCellValue((dto.getQuantityConsFinish() != null) ? dto.getQuantityConsFinish() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(9, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemSumFinish() != null) ? dto.getWorkItemSumFinish() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(10, CellType.STRING);
						cell2.setCellValue((dto.getQuantitySumFinish() != null) ? dto.getQuantitySumFinish() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(11, CellType.STRING);
						cell2.setCellValue(
								(dto.getWorkItemPartConstructing() != null) ? dto.getWorkItemPartConstructing() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(12, CellType.STRING);
						cell2.setCellValue(
								(dto.getQuantityPartConstructing() != null) ? dto.getQuantityPartConstructing() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(13, CellType.STRING);
						cell2.setCellValue(
								(dto.getWorkItemConsConstructing() != null) ? dto.getWorkItemConsConstructing() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(14, CellType.STRING);
						cell2.setCellValue(
								(dto.getQuantityConsConstructing() != null) ? dto.getQuantityConsConstructing() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(15, CellType.STRING);
						cell2.setCellValue(
								(dto.getWorkItemSumConstructing() != null) ? dto.getWorkItemSumConstructing() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(16, CellType.STRING);
						cell2.setCellValue(
								(dto.getQuantitySumConstructing() != null) ? dto.getQuantitySumConstructing() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(17, CellType.STRING);
						cell2.setCellValue(
								(dto.getWorkItemPartNonConstruction() != null) ? dto.getWorkItemPartNonConstruction()
										: 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(18, CellType.STRING);
						cell2.setCellValue(
								(dto.getQuantityPartNonConstruction() != null) ? dto.getQuantityPartNonConstruction()
										: 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(19, CellType.STRING);
						cell2.setCellValue(
								(dto.getWorkItemConsNonConstruction() != null) ? dto.getWorkItemConsNonConstruction()
										: 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(20, CellType.STRING);
						cell2.setCellValue(
								(dto.getQuantityConsNonConstruction() != null) ? dto.getQuantityConsNonConstruction()
										: 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(21, CellType.STRING);
						cell2.setCellValue(
								(dto.getWorkItemSumNonConstruction() != null) ? dto.getWorkItemSumNonConstruction()
										: 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(22, CellType.STRING);
						cell2.setCellValue(
								(dto.getQuantitySumNonConstruction() != null) ? dto.getQuantitySumNonConstruction()
										: 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(23, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemPartStuck() != null) ? dto.getWorkItemPartStuck() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(24, CellType.STRING);
						cell2.setCellValue((dto.getQuantityPartStuck() != null) ? dto.getQuantityPartStuck() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(25, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemConsStuck() != null) ? dto.getWorkItemConsStuck() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(26, CellType.STRING);
						cell2.setCellValue((dto.getQuantityConsStuck() != null) ? dto.getQuantityConsStuck() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(27, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemSumStuck() != null) ? dto.getWorkItemSumStuck() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(28, CellType.STRING);
						cell2.setCellValue((dto.getQuantitySumStuck() != null) ? dto.getQuantitySumStuck() : 0);
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
						cell2.setCellValue((dto.getWorkItemPartFinish() != null) ? dto.getWorkItemPartFinish() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(6, CellType.STRING);
						cell2.setCellValue((dto.getQuantityPartFinish() != null) ? dto.getQuantityPartFinish() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(7, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemConsFinish() != null) ? dto.getWorkItemConsFinish() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(8, CellType.STRING);
						cell2.setCellValue((dto.getQuantityConsFinish() != null) ? dto.getQuantityConsFinish() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(9, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemSumFinish() != null) ? dto.getWorkItemSumFinish() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(10, CellType.STRING);
						cell2.setCellValue((dto.getQuantitySumFinish() != null) ? dto.getQuantitySumFinish() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(11, CellType.STRING);
						cell2.setCellValue(
								(dto.getWorkItemPartConstructing() != null) ? dto.getWorkItemPartConstructing() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(12, CellType.STRING);
						cell2.setCellValue(
								(dto.getQuantityPartConstructing() != null) ? dto.getQuantityPartConstructing() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(13, CellType.STRING);
						cell2.setCellValue(
								(dto.getWorkItemConsConstructing() != null) ? dto.getWorkItemConsConstructing() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(14, CellType.STRING);
						cell2.setCellValue(
								(dto.getQuantityConsConstructing() != null) ? dto.getQuantityConsConstructing() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(15, CellType.STRING);
						cell2.setCellValue(
								(dto.getWorkItemSumConstructing() != null) ? dto.getWorkItemSumConstructing() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(16, CellType.STRING);
						cell2.setCellValue(
								(dto.getQuantitySumConstructing() != null) ? dto.getQuantitySumConstructing() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(17, CellType.STRING);
						cell2.setCellValue(
								(dto.getWorkItemPartNonConstruction() != null) ? dto.getWorkItemPartNonConstruction()
										: 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(18, CellType.STRING);
						cell2.setCellValue(
								(dto.getQuantityPartNonConstruction() != null) ? dto.getQuantityPartNonConstruction()
										: 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(19, CellType.STRING);
						cell2.setCellValue(
								(dto.getWorkItemConsNonConstruction() != null) ? dto.getWorkItemConsNonConstruction()
										: 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(20, CellType.STRING);
						cell2.setCellValue(
								(dto.getQuantityConsNonConstruction() != null) ? dto.getQuantityConsNonConstruction()
										: 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(21, CellType.STRING);
						cell2.setCellValue(
								(dto.getWorkItemSumNonConstruction() != null) ? dto.getWorkItemSumNonConstruction()
										: 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(22, CellType.STRING);
						cell2.setCellValue(
								(dto.getQuantitySumNonConstruction() != null) ? dto.getQuantitySumNonConstruction()
										: 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(23, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemPartStuck() != null) ? dto.getWorkItemPartStuck() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(24, CellType.STRING);
						cell2.setCellValue((dto.getQuantityPartStuck() != null) ? dto.getQuantityPartStuck() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(25, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemConsStuck() != null) ? dto.getWorkItemConsStuck() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(26, CellType.STRING);
						cell2.setCellValue((dto.getQuantityConsStuck() != null) ? dto.getQuantityConsStuck() : 0);
						cell2.setCellStyle(styleNumber);
						cell2 = row2.createCell(27, CellType.STRING);
						cell2.setCellValue((dto.getWorkItemSumStuck() != null) ? dto.getWorkItemSumStuck() : 0);
						cell2.setCellStyle(styleNumber2);
						cell2 = row2.createCell(28, CellType.STRING);
						cell2.setCellValue((dto.getQuantitySumStuck() != null) ? dto.getQuantitySumStuck() : 0);
						cell2.setCellStyle(styleNumber);
					}
				}
			}
			// Huypq-20181105-end
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();
		String path = UEncrypt
				.encryptFileUploadPath(uploadPathReturn + File.separator + "Export_congviec_tonghop.xlsx");
		return path;
	}

	// nhantv 20180823 start
	public List<WorkItemDetailDTO> getWorkItemForAssign(WorkItemDetailDTO obj) {
		return constructionTaskDAO.getWorkItemForAssign(obj);
	}

	public List<WorkItemDTO> getWorkItemForAddingTask(WorkItemDetailDTO obj) {
		return workItemDAO.getWorkItemForAddingTask(obj);
	}

	public List<ConstructionDTO> getConstrForChangePerformer(ConstructionTaskDTO obj) {
		return constructionDAO.getForChangePerformer(obj);
	}

	// autocomplete công trình trong màn hình chuyển người
	public List<ConstructionDTO> getForChangePerformerAutocomplete(ConstructionTaskDTO obj) {
		return constructionDAO.getForChangePerformerAutocomplete(obj);
	}

	public List<SysUserDTO> getForChangePerformerAutocomplete(ConstructionTaskDTO obj, List<String> sysGroupId) {
		return sysUserDAO.getForChangePerformerAutocomplete(obj, sysGroupId);
	}

	public List<SysUserDTO> getPerformerForChanging(ConstructionTaskDTO obj, List<String> sysGroupId) {
		return sysUserDAO.getPerformerForChanging(obj, sysGroupId);
	}

	public DataListDTO findForChangePerformer(ConstructionTaskDTO obj) {
		List<ConstructionTaskDTO> ls = constructionTaskDAO.findForChangePerformer(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public int updatePerformer(ConstructionTaskDetailDTO obj, KttsUserSession user) {
		for (ConstructionTaskDetailDTO cdt : obj.getChildDTOList()) {
			try {
				constructionTaskDAO.updateTransPerfomer(cdt);
				constructionTaskDAO.updateWorkItemPerformerId(cdt);

				constructionTaskDAO.createSendSmsEmail(cdt, user);
				constructionTaskDAO.createSendSmsEmailToConvert(cdt, user);
				constructionTaskDAO.createSendSmsEmailToOperator(cdt, user);
			} catch (Exception e) {
				e.printStackTrace();
				return -1;
			}
		}
		return 1;
	}
	// nhantv 20180823 stop

	public List<ConstructionTaskDetailDTO> importLDT(String fileInput, String filePath, long month, long year,
			long sysGroupId) throws Exception {
		Set<String> constructionSet = constructionTaskDAO.getConstructionTaskMap("3", month, year, sysGroupId);
		List<ConstructionTaskDetailDTO> workLst = new ArrayList<ConstructionTaskDetailDTO>();
		Map<String, ConstructionDetailDTO> constructionMap = constructionDAO.getCodeAndIdForValidate();
		Map<String, SysUserDTO> userMapByLoginName = new HashMap<String, SysUserDTO>();
		Map<String, SysUserDTO> userMapByEmail = new HashMap<String, SysUserDTO>();
		try {
			detailMonthPlanDAO.getUserForMap(userMapByLoginName, userMapByEmail);

		} catch (Exception e) {
			return null;
		}
		File f = new File(fileInput);
		XSSFWorkbook workbook = new XSSFWorkbook(f);
		XSSFSheet sheet = workbook.getSheetAt(0);
		DataFormatter formatter = new DataFormatter();
		DecimalFormat df = new DecimalFormat("#.###");
		DecimalFormat longf = new DecimalFormat("#");
		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
		boolean isExistError = false;
		int count = 0;
		for (Row row : sheet) {
			count++;
			if (count > 2 && !ValidateUtils.checkIfRowIsEmpty(row)) {
				boolean checkColumn3 = true;
				boolean checkColumn6 = true;
				boolean checkColumn8 = true;
				boolean checkColumn9 = true;
				boolean checkColumn10 = true;
				boolean checkColumn11 = true;
				boolean checkColumn12 = true;
				DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
				ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
				for (int i = 0; i < 13; i++) {
					Cell cell = row.getCell(i);
					if (cell != null) {
						if (cell.getColumnIndex() == 3) {
							String code = formatter.formatCellValue(cell).trim();
							ConstructionDetailDTO obj = constructionMap.get(code);
							boolean isInPlan = constructionSet.contains(code);
							if (isInPlan) {
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "4",
										" Công việc đã tồn tại trong kế hoạch tháng!");
								errorList.add(errorDTO);
							} else if (obj != null && !isInPlan) {
								newObj.setConstructionCode(obj.getCode());
								newObj.setConstructionName(obj.getName());
								newObj.setConstructionId(obj.getConstructionId());
							}
							if (obj == null) {
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "4",
										" Chưa nhập mã công trình hoặc mã công trình không tồn tại!");
								errorList.add(errorDTO);
							}

						} else if (cell.getColumnIndex() == 5) {
							newObj.setCntContract(
									formatter.formatCellValue(cell) != null ? formatter.formatCellValue(cell) : "");
						} else if (cell.getColumnIndex() == 6) {
							try {
								Double quantity = new Double(cell.getNumericCellValue());
								newObj.setQuantity(quantity);
							} catch (Exception e) {
								checkColumn6 = false;
							}
							if (!checkColumn6) {
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "7",
										" Giá trị không hợp lệ!");
								errorList.add(errorDTO);
							}
						} else if (cell.getColumnIndex() == 8) {
							String name = formatter.formatCellValue(cell).trim();
							SysUserDTO obj = userMapByLoginName.get(name.toUpperCase()) != null
									? userMapByLoginName.get(name.toUpperCase())
									: userMapByEmail.get(name.toUpperCase());
							if (obj != null) {
								newObj.setPerformerId(obj.getUserId());
								newObj.setPerformerName(obj.getFullName());
							} else {
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "9",
										" Sai tên đăng nhập hoặc email!");
								errorList.add(errorDTO);
							}
						} else if (cell.getColumnIndex() == 9) {
							try {
								Date startDate = dateFormat.parse(formatter.formatCellValue(cell));
								if (validateDate(formatter.formatCellValue(cell)))
									newObj.setStartDate(startDate);
								else
									checkColumn9 = false;
							} catch (Exception e) {
								checkColumn9 = false;
							}
							if (!checkColumn9) {
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "10",
										" Ngày bắt đầu không hợp lệ!");
								errorList.add(errorDTO);
							}
						} else if (cell.getColumnIndex() == 10) {
							try {
								Date endDate = dateFormat.parse(formatter.formatCellValue(cell));
								if (validateDate(formatter.formatCellValue(cell)))
									newObj.setEndDate(endDate);
								else
									checkColumn10 = false;
							} catch (Exception e) {
								checkColumn10 = false;
							}
							if (!checkColumn10) {
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "11",
										" Ngày kết thúc không hợp lệ!");
								errorList.add(errorDTO);
							}
						} else if (cell.getColumnIndex() == 11) {
							try {
								String taskOrder = formatter.formatCellValue(cell).trim();
								if (taskOrder.equalsIgnoreCase("1")) {
									newObj.setTaskOrder("1");
									newObj.setTaskName(
											"Tạo đề nghị quyết toán cho công trình " + newObj.getConstructionCode());
								} else if (taskOrder.equalsIgnoreCase("2")) {
									newObj.setTaskOrder("2");
									newObj.setTaskName("Lên doanh thu cho công trình " + newObj.getConstructionCode());
								} else {
									checkColumn11 = false;
								}
							} catch (Exception e) {
								checkColumn11 = false;
							}
							if (!checkColumn11) {
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "12",
										" Quyết toán/ Doanh thu không hợp lệ!");
								errorList.add(errorDTO);
							}
						} else if (cell.getColumnIndex() == 12) {
							try {
								String descriptionHSHC = formatter.formatCellValue(cell).trim();
								if (descriptionHSHC.length() <= 1000) {
									newObj.setDescription(descriptionHSHC);
								} else {
									checkColumn12 = false;
									isExistError = true;
								}
							} catch (Exception e) {
								checkColumn12 = false;
							}
							if (!checkColumn12) {
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "13",
										" Ghi chú vượt quá 1000 ký tự!");
								errorList.add(errorDTO);
							}
						}
					}
				}
				if (!isExistError) {
					workLst.add(newObj);
				}
			}
		}
		if (isExistError) {
			workLst = new ArrayList<ConstructionTaskDetailDTO>();
			ConstructionTaskDetailDTO objErr = new ConstructionTaskDetailDTO();
			objErr.setErrorList(errorList);
			objErr.setMessageColumn(13);
			objErr.setErrorFilePath(UEncrypt.encryptFileUploadPath(filePath));
			objErr.setFilePathError(UEncrypt.encryptFileUploadPath(filePath));
			workLst.add(objErr);
		}
		workbook.close();
		return workLst;
	}

	public List<ConstructionTaskDetailDTO> importHSHC(String fileInput, String filePath, long month, long year,
			long sysGroupId) throws Exception {
		List<ConstructionTaskDetailDTO> workLst = new ArrayList<ConstructionTaskDetailDTO>();
		Set<String> constructionSet = constructionTaskDAO.getConstructionTaskMap("2", month, year, sysGroupId);
		Map<String, ConstructionDetailDTO> constructionMap = constructionDAO.getCodeAndIdForValidate();
		Map<String, SysUserDTO> userMapByLoginName = new HashMap<String, SysUserDTO>();
		Map<String, SysUserDTO> userMapByEmail = new HashMap<String, SysUserDTO>();
		try {
			detailMonthPlanDAO.getUserForMap(userMapByLoginName, userMapByEmail);
		} catch (Exception e) {
			return null;
		}
		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
		File f = new File(fileInput);
		XSSFWorkbook workbook = new XSSFWorkbook(f);
		XSSFSheet sheet = workbook.getSheetAt(0);
		DataFormatter formatter = new DataFormatter();
		boolean isExistError = false;
		int count = 0;
		ArrayList<ConstructionTaskDetailDTO> constructionCodeMaps = new ArrayList<ConstructionTaskDetailDTO>(); //Huypq-20190211-add
		for (Row row : sheet) {
			count++;
			if (count > 2 && !ValidateUtils.checkIfRowIsEmpty(row)) {
				boolean checkColumn2 = true;
				boolean checkColumn6 = true;
				boolean checkColumn8 = true;
				boolean checkColumn9 = true;
				boolean checkColumn10 = true;
				boolean checkColumn11 = true;
				boolean checkColumn12 = true;
//              hoanm1_20181229_start
				boolean checkColumn5 = true;
				boolean checkContract = true;
				DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
				ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
				String code="";
                Map<String, ConstructionDetailDTO> constructionCntContractMap = constructionDAO.getConstructionCntContract();
//                hoanm1_20181229_end
				for (int i = 0; i < 13; i++) {
					Cell cell = row.getCell(i);
					if (cell != null) {
						if (cell.getColumnIndex() == 3) {
							code = formatter.formatCellValue(row.getCell(3)).trim();
							ConstructionDetailDTO obj = constructionMap.get(code);
							boolean isInPlan = constructionSet.contains(code);

							if (isInPlan) {
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "4",
										"Công việc đã tồn tại trong kế hoạch tháng!");
								errorList.add(errorDTO);
							} else if (obj != null && !isInPlan) {
								newObj.setConstructionCode(obj.getCode());
								newObj.setConstructionName(obj.getName());
								newObj.setConstructionId(obj.getConstructionId());
								constructionCodeMaps.add(newObj); //Huypq-20190211-add
							}
							if (obj == null) {
								checkColumn2 = false;
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "4",
										" Chưa nhập mã công trình hoặc mã công trình không tồn tại!");
								errorList.add(errorDTO);
							}
							//Huypq-20190211-start
                            if(constructionCodeMaps.size()>=2) {
                            	for(int k=0;k<constructionCodeMaps.size();k++) {
                                	for(int h=k+1;h<constructionCodeMaps.size();h++) {
                                		if((constructionCodeMaps.get(k).getConstructionCode().trim()).equals(constructionCodeMaps.get(h).getConstructionCode().trim())) {
                                			isExistError = true;
                                			ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "4",
            										" Mã công trình đã tồn tại trong file import!");
            								errorList.add(errorDTO);
                                		}
                                	}
                                }
                            }
                            //Huypq-end
						} 
//                      hoanm1_20181229_start
                      else if (cell.getColumnIndex() == 5) {
                          try {
                          	if(!formatter.formatCellValue(cell).trim().isEmpty()){
                          		newObj.setWorkItemNameHSHC(formatter.formatCellValue(cell).trim());
                          	}else{
                          		checkColumn5 = false;
                          	}
                          } catch (Exception e) {
                        	  checkColumn5 = false;
                          }
							if (!checkColumn5) {
								isExistError = true;
								errorList.add(createError(row.getRowNum() + 1, "5", "Hạng mục hoàn công không được để trống"));
							}
                      } 
//						hoanm1_20190109_start
//                      else if (cell.getColumnIndex() == 6) {
//                          try {
//                      			ConstructionDetailDTO obj = constructionCntContractMap.get(code);
//                            		if (obj == null) {
//                            			checkContract = false;	
//                            		}
//                            } catch (Exception e) {
//                            	checkContract = false;
//                            }
//  							if (!checkContract) {
//  								isExistError = true;
//  								errorList.add(createError(row.getRowNum() + 1, "6", "Công trình chưa được gán hợp đồng"));
//  							}
//                        } 
//                        hoanm1_20190109_end
						else if (cell.getColumnIndex() == 7) {
							try {
								Double quantity = new Double(cell.getNumericCellValue() * 1000000);
								newObj.setQuantity(quantity);
							} catch (Exception e) {
								checkColumn6 = false;
							}
							if (!checkColumn6) {
								isExistError = true;
								errorList.add(createError(row.getRowNum() + 1, "7", " Giá trị không hợp lệ!"));
							}
						} else if (cell.getColumnIndex() == 8) {
							try {
								Date completeDate = dateFormat.parse(formatter.formatCellValue(cell));
								newObj.setCompleteDate(completeDate);
							} catch (Exception e) {
								checkColumn8 = false;
							}
						} else if (cell.getColumnIndex() == 9) {
							String name = formatter.formatCellValue(cell).trim();
							SysUserDTO obj = userMapByLoginName.get(name.toUpperCase()) != null
									? userMapByLoginName.get(name.toUpperCase())
									: userMapByEmail.get(name.toUpperCase());
							if (obj != null) {
								newObj.setPerformerId(obj.getUserId());
								newObj.setPerformerName(obj.getFullName());
							} else {
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "9",
										" Sai tên đăng nhập hoặc email!");
								errorList.add(errorDTO);
							}
						} else if (cell.getColumnIndex() == 10) {
							try {
								Date startDate = dateFormat.parse(formatter.formatCellValue(cell));
								if (validateDate(formatter.formatCellValue(cell))) {
									newObj.setStartDate(startDate);
								} else {
									checkColumn10 = false;
								}
							} catch (Exception e) {
								checkColumn10 = false;
							}
							if (!checkColumn10) {
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "10",
										"Ngày bắt đầu không hợp lệ!");
								errorList.add(errorDTO);
							}
						} else if (cell.getColumnIndex() == 11) {
							try {
								Date endDate = dateFormat.parse(formatter.formatCellValue(cell));
								if (validateDate(formatter.formatCellValue(cell))) {
									newObj.setEndDate(endDate);
								} else {
									checkColumn11 = false;
								}

							} catch (Exception e) {
								checkColumn11 = false;
							}
							if (!checkColumn11) {
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "11",
										" Ngày kết thúc không hợp lệ!");
								errorList.add(errorDTO);
							}
						} else if (cell.getColumnIndex() == 12) {
							try {
								String descriptionHSHC = formatter.formatCellValue(cell).trim();
								if (descriptionHSHC.length() <= 1000) {
									newObj.setDescription(descriptionHSHC);
								} else {
									checkColumn12 = false;
									isExistError = true;
								}
							} catch (Exception e) {
								checkColumn12 = false;
							}
							if (!checkColumn12) {
								isExistError = true;
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, "11",
										" Ghi chú vượt quá 1000 ký tự!");
								errorList.add(errorDTO);
							}
						}
					}
				}
				if (!isExistError) {
					newObj.setCntContract(formatter.formatCellValue(row.getCell(6)) != null
							? formatter.formatCellValue(row.getCell(6))
							: "");
					workLst.add(newObj);
				}
			}
		}
		if (isExistError) {
			workLst = new ArrayList<ConstructionTaskDetailDTO>();
			ConstructionTaskDetailDTO objErr = new ConstructionTaskDetailDTO();
			objErr.setErrorList(errorList);
			objErr.setMessageColumn(13);
			objErr.setErrorFilePath(UEncrypt.encryptFileUploadPath(filePath));
			objErr.setFilePathError(UEncrypt.encryptFileUploadPath(filePath));
			workLst.add(objErr);
		}
		workbook.close();
		return workLst;
	}

	public static Long getCurrentTimeStampMonth(Date date) {
		SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy
		String strDate = sdfDate.format(date);
		String res = strDate.substring(5, 7);
		return Long.parseLong(res);
	}

	public static Long getCurrentTimeStampYear(Date date) {
		SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy
		String strDate = sdfDate.format(date);
		String res = strDate.substring(0, 4);
		return Long.parseLong(res);
	}

	boolean validateDate(String date) {
		String dateBreaking[] = date.split("/");
		if (Integer.parseInt(dateBreaking[1]) > 12) {
			return false;
		}
		if (Integer.parseInt(dateBreaking[2]) < (new Date()).getYear() + 1900) {
			return false;
		}
		if (Integer.parseInt(dateBreaking[0]) > 31) {
			return false;
		}
		SimpleDateFormat sdfrmt = new SimpleDateFormat("dd/MM/yyyy");
		sdfrmt.setLenient(false);
		try {
			Date javaDate = sdfrmt.parse(date);
			// System.out.println(date+" is valid date format");
		} catch (Exception e) {
			// System.out.println(date+" is Invalid Date format");
			return false;
		}
		return true;
	}

	// Huypq_20181025-start-chart
	public List<ConstructionTaskDTO> getDataChart(ConstructionTaskDTO obj) {
		List<ConstructionTaskDTO> listChart = Lists.newArrayList();
		List<ConstructionTaskDTO> listChartHashSet = Lists.newArrayList();
		List<ConstructionTaskDTO> lstDay = constructionTaskDAO.listDay(obj);

		List<ConstructionTaskDTO> listData = constructionTaskDAO.getDataChart(obj);
		for (int i = 0; i < lstDay.size(); i++) {
			ConstructionTaskDTO newObj = new ConstructionTaskDTO();
			for (int j = 0; j < listData.size(); j++) {

				String dayData = listData.get(j).getStartDateChart();
				String day = lstDay.get(i).getStartDateChart();
				if (dayData.equals(day)) {

					newObj.setStartDateChart(listData.get(j).getStartDateChart());
					if (listData.get(j).getTypeName().equals("KH hoan cong")) {
						newObj.setQuantityKhHc(listData.get(j).getQuantityChart());
					}
					if (listData.get(j).getTypeName().equals("KH san luong")) {
						newObj.setQuantityKhSl(listData.get(j).getQuantityChart());
					}
					if (listData.get(j).getTypeName().equals("TH san luong")) {
						newObj.setQuantityThSl(listData.get(j).getQuantityChart());
					}
					if (listData.get(j).getTypeName().equals("TH hoan cong")) {
						newObj.setQuantityThHc(listData.get(j).getQuantityChart());

					}
				}
			}
			listChart.add(newObj);
		}

		return listChart;
	}

	public List<ConstructionTaskDTO> getDataChartAcc(ConstructionTaskDTO obj) {
		List<ConstructionTaskDTO> listChart = Lists.newArrayList();
		List<ConstructionTaskDTO> listChartHashSet = Lists.newArrayList();
		List<ConstructionTaskDTO> lstDay = constructionTaskDAO.listDayAcc(obj);

		List<ConstructionTaskDTO> listData = constructionTaskDAO.getDataChartAcc(obj);
		for (int i = 0; i < lstDay.size(); i++) {
			ConstructionTaskDTO newObj = new ConstructionTaskDTO();
			for (int j = 0; j < listData.size(); j++) {

				String dayData = listData.get(j).getStartDateChart();
				String day = lstDay.get(i).getStartDateChart();
				if (dayData.equals(day)) {

					newObj.setStartDateChart(listData.get(j).getStartDateChart());
					if (listData.get(j).getTypeName().equals("KH hoan cong")) {
						newObj.setQuantityKhHc(listData.get(j).getQuantityChart());
					}
					if (listData.get(j).getTypeName().equals("KH san luong")) {
						newObj.setQuantityKhSl(listData.get(j).getQuantityChart());
					}
					if (listData.get(j).getTypeName().equals("TH san luong")) {
						newObj.setQuantityThSl(listData.get(j).getQuantityChart());
					}
					if (listData.get(j).getTypeName().equals("TH hoan cong")) {
						newObj.setQuantityThHc(listData.get(j).getQuantityChart());

					}
				}
			}
			listChart.add(newObj);
		}

		return listChart;
	}

	// Huypq_20181025-end-chart

	//VietNT_20181128_start
	@SuppressWarnings("Duplicates")
	public ConstructionHSHCDTOHolder doImportConstructionHSHC(String filePath, Long sysUserId) throws Exception {
		List<RpHSHCDTO> dtoList = new ArrayList<>();
		List<ConstructionDTO> constructionDTOResults = new ArrayList<>();
		ConstructionHSHCDTOHolder res = new ConstructionHSHCDTOHolder();
		List<ExcelErrorDTO> errorList = new ArrayList<>();

		try {
			File f = new File(filePath);
			XSSFWorkbook workbook = new XSSFWorkbook(f);
			XSSFSheet sheet = workbook.getSheetAt(0);

			DataFormatter formatter = new DataFormatter();
			int rowCount = 0;

			// prepare data for validate
			// get List rpHSHC
            List<RpHSHCDTO> rpHSHCs = rpConstructionHSHCDAO.doSearchHSHCForImport(new ConstructionTaskDetailDTO());

			for (Row row : sheet) {
				rowCount++;
				// data start from row 3
				if (rowCount < 3) {
					continue;
				}

				// check required field empty
				if (!this.isRequiredDataExist(row, errorList, formatter)) {
                    continue;
                }
				// ma cong trinh
				String constructionCode = formatter.formatCellValue(row.getCell(6)).trim();
				// gia tri phe duyet
				String completeValueStr = formatter.formatCellValue(row.getCell(9)).trim();
				// Phê duyệt/Từ chối: 1 = null, 2 = 1, 3 = 2
				String completeStateStr = formatter.formatCellValue(row.getCell(11)).trim();
				// Lý do từ chối
				String description = formatter.formatCellValue(row.getCell(12)).trim();
//				hoanm1_20181218_start
				String dateCompleteImport = formatter.formatCellValue(row.getCell(13)).trim();
//				hoanm1_20181218_end

				// validate constructionCode exist
				// find matching record in list get from db
				RpHSHCDTO dtoResult = rpHSHCs.stream()
						.filter(dto -> dto.getConstructionCode().toUpperCase().equals(constructionCode.toUpperCase()))
						.findFirst().orElse(null);
				ConstructionDTO constructionDTO = new ConstructionDTO();
//				ConstructionDTO constructionDTO = constructionDTOS.stream()
//						.filter(dto -> dto.getCode().toUpperCase().equals(constructionCode.toUpperCase()))
//						.findFirst().orElse(null);

				if (dtoResult != null) {
					// record exits, begin validate
					Date completedDate = new Date(dtoResult.getDateComplete().getTime());

					int errorCol = 8;
					long completeValue = this.getValidLongTypeData(rowCount, completeValueStr, errorList, errorCol);
					completeValue = completeValue == 0 ? dtoResult.getCompleteValuePlan() : completeValue;

					//long completeState = this.getValidLongTypeData(rowCount, completeStateStr, errorList, errorCol);
//					hoanm1_20181218_start
					this.validateCompleteState(rowCount, completeStateStr, completedDate, description, errorList,dateCompleteImport);
//					hoanm1_20181218_end
					long completeState = Long.parseLong(completeStateStr);

					// if no error, create DTO
					if (errorList.size() == 0) {
						// after validate, completeState can only be 1 or 2
						// update result dto
						if (completeState == 1) {
							long sumCompleteValue = rpConstructionHSHCDAO.sumCompleteValueByConsCode(dtoResult.getConstructionCode());
//							hoanm1_20181218_start
							this.updateDtoApprove(dtoResult, constructionDTO, completeValue, sumCompleteValue, sysUserId,dateCompleteImport);
						}
						else {
							this.updateDtoDenied(dtoResult, constructionDTO, description, sysUserId,dateCompleteImport);
						}
//						hoanm1_20181218_end
						dtoList.add(dtoResult);
						constructionDTOResults.add(constructionDTO);
					}

				} else {
					// record not found, add error
					ExcelErrorDTO errorDTO = this.createError(rowCount, colAlias.get(6), colNameHSHC.get(6) + " không ở trạng thái chờ phê duyệt");
					errorList.add(errorDTO);
				}
			}

			if (errorList.size() > 0) {
				String filePathError = UEncrypt.encryptFileUploadPath(filePath);
				this.doWriteError(errorList, dtoList, filePathError, 14);
			}
			workbook.close();

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ExcelErrorDTO errorDTO = createError(0, "", e.toString());
			errorList.add(errorDTO);
			String filePathError = null;

			try {
				filePathError = UEncrypt.encryptFileUploadPath(filePath);
			} catch (Exception ex) {
				LOGGER.error(e.getMessage(), e);
				errorDTO = createError(0, "", ex.toString());
				errorList.add(errorDTO);
			}
			this.doWriteError(errorList, dtoList, filePathError, 14);
		}

		res.setRpHSHCDTOS(dtoList);
		res.setConstructionDTOS(constructionDTOResults);

		return res;
	}

	@SuppressWarnings("Duplicates")
	private void doWriteError(List<ExcelErrorDTO> errorList, List<RpHSHCDTO> dtoList, String filePathError, int errColumn) {
		dtoList.clear();

		RpHSHCDTO errorContainer = new RpHSHCDTO();
		errorContainer.setErrorList(errorList);
		errorContainer.setMessageColumn(errColumn); // cột dùng để in ra lỗi
		errorContainer.setFilePathError(filePathError);

		dtoList.add(errorContainer);
	}

	/**
	 * Update DTO data if approve
	 * @param dtoResult		record found
	 * @param completeValue	completeValue from Import Data
	 */
//	hoanm1_20181218_start
	private void updateDtoApprove(RpHSHCDTO dtoResult, ConstructionDTO consDto, long completeValue, long sumCompleteValue, Long sysUserId,String dateCompleteImport) {
		dtoResult.setCompleteValue(completeValue*1000000);
//		dtoResult.setCompleteValuePlan(completeValuePlan);
		dtoResult.setCompleteState(2L);
		Date today = new Date();
		dtoResult.setCompleteUpdateDate(today);
		dtoResult.setReceiveRecordsDate(today);
		dtoResult.setCompleteUserUpdate(sysUserId);
		dtoResult.setDateCompleteTC(dateCompleteImport);

		consDto.setCode(dtoResult.getConstructionCode());
		consDto.setReceiveRecordsDate(today);
		consDto.setCompleteApprovedUpdateDate(today);
		consDto.setCompleteApprovedValue(sumCompleteValue + completeValue*1000000);
		consDto.setCompleteApprovedState(2L);
		consDto.setCompleteApprovedUserId(sysUserId.toString());
		consDto.setDateCompleteTC(dateCompleteImport);
	}
	/**
	 * Update DTO data if denied
	 * @param dtoResult		record found
	 * @param description	description for denied
	 */
	private void updateDtoDenied(RpHSHCDTO dtoResult, ConstructionDTO consDto, String description, Long sysUserId,String dateCompleteImport) {
		dtoResult.setCompleteValue(0L);
		dtoResult.setCompleteState(3L);
		dtoResult.setDateCompleteTC(dateCompleteImport);

		Date today = new Date();
		dtoResult.setCompleteUpdateDate(today);
		dtoResult.setApproveCompleteDescription(description);
		dtoResult.setCompleteUserUpdate(sysUserId);

		consDto.setApproveCompleteDescription(description);
		consDto.setCode(dtoResult.getConstructionCode());
		consDto.setCompleteApprovedUpdateDate(today);
		consDto.setCompleteApprovedUserId(sysUserId.toString());
		consDto.setDateCompleteTC(dateCompleteImport);
		consDto.setCompleteApprovedState(3L);
	}
//	hoanm1_20181218_end
	/**
	 * Convert String to Date type, if string invalid add error, if string empty return null
	 * @param rowCount		current row
	 * @param dateStr		String contain date
	 * @param sdf			SimpleDateFormat obj
	 * @param errorList		list error
	 * @param errorCol		data's column
	 * @return Date type
	 */
    private Date getValidDateData(int rowCount, String dateStr, SimpleDateFormat sdf, List<ExcelErrorDTO> errorList, int errorCol) {
		Date date = null;
		if (this.validateString(dateStr)) {
			try {
				date = sdf.parse(dateStr);
			} catch (Exception e) {
				errorList.add(this.createError(rowCount, colAlias.get(errorCol), colNameHSHC.get(errorCol) + " sai kiểu dữ liệu"));
			}
		}
		return date;
	}

	/**
	 * Validate field completeDate is <= 5th of next month
	 * @param rowCount		current row
	 * @param completeDate	Complete Date
	 * @param errorList		list error
	 */
	private void validateCompleteDate(int rowCount, Date completeDate, List<ExcelErrorDTO> errorList) {
		LocalDateTime from = LocalDateTime.fromDateFields(completeDate);
		// extract day, month, year from completeDate
		int expiredDay = 5;
		int expiredMonth = from.getMonthOfYear() + 1;
		int expiredYear = from.getYear();

		if (from.getMonthOfYear() == 12) {
			expiredMonth = 1;
			expiredYear++;
		}

		// to create expiredDate(5th of next month)
		Date expiredDate = new LocalDateTime()
				.withDate(expiredYear, expiredMonth, expiredDay)
				.withHourOfDay(23)
				.withMinuteOfHour(59)
				.toDate();

		// compare now with expiredDate
		Date now = new Date();
		if (now.after(expiredDate)) {
			ExcelErrorDTO errorDTO = createError(rowCount, colAlias.get(1),
					colNameHSHC.get(1) + " đã quá thời gian phê duyệt");
			errorList.add(errorDTO);
		}
	}

	/**
	 * Convert Long type from String, if string invalid add error, if string empty return 0
	 * @param rowCount		current row
	 * @param strLong		String contain data
	 * @param errorList		list error
	 * @param errorCol		data's column
	 * @return Long type number
	 */
	private long getValidLongTypeData(int rowCount, String strLong, List<ExcelErrorDTO> errorList, int errorCol) {
		long numLong = 0;
		if (this.validateString(strLong)) {
			try {
				numLong = Long.parseLong(strLong);
			} catch (Exception e) {
				ExcelErrorDTO errorDTO = this.createError(rowCount, colAlias.get(errorCol), colNameHSHC.get(errorCol) + " sai kiểu dữ liệu");
				errorList.add(errorDTO);
			}
		}
		return numLong;
	}

	/**
	 * Validate required field base on completeState.
	 * 1 == approve: required receiveRecordDate
	 * 2 == denied: required description
	 * else reject input
	 *
	 * @param rowCount				current row
	 * @param completeStateStr		completeState, type Long, 1 = approve, 2 = denied
	 * @param completedDate			completeDate, for method validateCompleteState()
	 * @param description			description, required when 2
	 * @param errorList				list error
	 */
//	hoanm1_20181218_start
	private void validateCompleteState(int rowCount, String completeStateStr, Date completedDate, String description, List<ExcelErrorDTO> errorList,String dateCompleteImport) {
		if (!completeStateStr.equals("1") && !completeStateStr.equals("2")) {
			// completeState invalid(not equal to 1 or 2)
			errorList.add(this.createError(rowCount, colAlias.get(11), colNameHSHC.get(11) + " giá trị không hợp lệ(1: Chấp nhận, 2: Từ chối)"));
		} else {
			this.validateCompleteDate(rowCount, completedDate, errorList);
			// if approve -> do nothing
			// if denied check description exist
			if (completeStateStr.equals("2")) {
				if (!this.validateString(description)) {
					errorList.add(this.createError(rowCount, colAlias.get(12), colNameHSHC.get(12) + " không được bỏ trống khi Từ chối" ));
				}
			}
		}
		if (!this.validateString(dateCompleteImport)) {
			errorList.add(this.createError(rowCount, colAlias.get(13), colNameHSHC.get(13) + " không được bỏ trống" ));
		}
	}
//	hoanm1_20181218_end
	/**
	 * Check if required data exist in cell
	 * @param row		row num
	 * @param errorList	list of errors
	 * @param formatter	POI formatter
	 * @return True if all required data exist
	 */
	private boolean isRequiredDataExist(Row row, List<ExcelErrorDTO> errorList, DataFormatter formatter) {
		int errCount = 0;
		for (int colIndex : requiredColHSHC) {
			if (!this.validateString(formatter.formatCellValue(row.getCell(colIndex)))) {
				ExcelErrorDTO errorDTO = this.createError(row.getRowNum() + 1, colAlias.get(colIndex), colNameHSHC.get(colIndex) + " chưa nhập");
                errorList.add(errorDTO);
				errCount++;
			}
		}
		return errCount == 0;
	}

    public void doUpdateHSHC(List<RpHSHCDTO> dtos, List<ConstructionDTO> consDto) {
		for (int i = 0; i < dtos.size(); i++) {
			try {
				constructionDAO.updateConstructionHSHC(consDto.get(i));
				rpConstructionHSHCDAO.update(dtos.get(i).toModel());
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	@SuppressWarnings("Duplicates")
	public String makeTemplateHSHC(ConstructionTaskDetailDTO dtoSearch) throws Exception {
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "BieuMau_HSHC.xlsx"));
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
				udir.getAbsolutePath() + File.separator + "BieuMau_HSHC.xlsx");

		List<RpHSHCDTO> data = rpConstructionHSHCDAO.doSearchHSHCForImport(dtoSearch);
		List<DepartmentDTO> listGroup;
		HashMap<Long, String> mapIdNameGroup = new HashMap<>();
		if (data != null && !data.isEmpty()) {
			List<Long> ids = data.stream().map(RpHSHCDTO::getSysGroupId).collect(Collectors.toList());
			listGroup = constructionTaskDAO.getListGroupByIds(ids);
			listGroup.forEach(group -> mapIdNameGroup.put(group.getDepartmentId(), group.getName()));
		}

		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);

			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);

			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();

			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));

			int i = 2;
			for (RpHSHCDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell;
				//stt
				cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(style);

				// ngay hoan thanh
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue(dto.getDateComplete());
				cell.setCellStyle(styleDate);

				// don vi thuc hien (groupId)
				String groupName = mapIdNameGroup.get(dto.getSysGroupId());
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue(null == groupName ? dto.getSysGroupId().toString() : groupName);
				cell.setCellStyle(style);

				// ma tinh
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue(dto.getCatProvinceCode());
				cell.setCellStyle(style);
				
				// hoanm1_20181219_start ma nha tram
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue(dto.getCatStationHouseCode());
				cell.setCellStyle(style);
//				hoanm1_20181219_end
				// ma tram
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue(dto.getCatStationCode());
				cell.setCellStyle(style);

				// ma cong trinh
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue(dto.getConstructionCode());
				cell.setCellStyle(style);

				// max hop dong
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue(dto.getCntContractCode());
				cell.setCellStyle(style);

				// completeValue plan
				cell = row.createCell(8, CellType.NUMERIC);
				cell.setCellValue(dto.getCompleteValuePlan() == null ? 0 : dto.getCompleteValuePlan()/1000000);
				cell.setCellStyle(style);

				// completeValue
				cell = row.createCell(9, CellType.NUMERIC);
				cell.setCellValue(dto.getCompleteValue() == null ? 0 : dto.getCompleteValue());
				cell.setCellStyle(style);

				// workitem code
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue(dto.getWorkItemCode());
				cell.setCellStyle(style);

				//complete state
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue("");
				cell.setCellStyle(style);

				// description
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue("");
				cell.setCellStyle(style);
				
//				hoanm1_20181218_start
				cell = row.createCell(13, CellType.STRING);
				cell.setCellValue("");
				cell.setCellStyle(style);
//				hoanm1_20181218_end
			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "BieuMau_HSHC.xlsx");
		return path;
	}

	//VietNT_end
	// Huypq_20181025-end-chart
	public ConstructionDetailDTO getUserUpdate(Long rpHshcId) {
		return constructionTaskDAO.getUserUpdate(rpHshcId);
	}
	// Huypq_20181025-end-
	//VietNT_20181207_start
	public DataListDTO getConstructionByStationId(ConstructionDTO obj) {
		List<ConstructionDetailDTO> ls = constructionDAO.getConstructionByStationId(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	//VietNT_end
}
