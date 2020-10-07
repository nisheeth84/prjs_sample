package com.viettel.coms.business;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.poi.openxml4j.util.ZipSecureFile;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.util.SystemOutLogger;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFCreationHelper;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.collect.Lists;
import com.viettel.asset.dto.SysGroupDto;
import com.viettel.cat.constant.Constants;
import com.viettel.cat.dto.CatPartnerDTO;
import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.bo.ConstructionBO;
import com.viettel.coms.bo.ConstructionReturnBO;
import com.viettel.coms.bo.WorkItemBO;
import com.viettel.coms.dao.CatStationDAO;
import com.viettel.coms.dao.ConstructionAcceptanceCertDAO;
import com.viettel.coms.dao.ConstructionDAO;
import com.viettel.coms.dao.ConstructionMerchandiseDAO;
import com.viettel.coms.dao.ConstructionReturnDAO;
import com.viettel.coms.dao.ConstructionScheduleDAO;
import com.viettel.coms.dao.ConstructionTaskDAO;
import com.viettel.coms.dao.DepartmentDAO;
import com.viettel.coms.dao.DmpnOrderDAO;
import com.viettel.coms.dao.ObstructedDAO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dao.WorkItemDAO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.AssignHandoverDTO;
import com.viettel.coms.dto.AssignHandoverRequest;
import com.viettel.coms.dto.AssignHandoverResponse;
import com.viettel.coms.dto.CatCommonDTO;
import com.viettel.coms.dto.CatConstructionTypeDTO;
import com.viettel.coms.dto.CatStationDTO;
import com.viettel.coms.dto.CatWorkItemTypeDTO;
import com.viettel.coms.dto.CommonDTO;
import com.viettel.coms.dto.ConstructionAcceptanceCertDTO;
import com.viettel.coms.dto.ConstructionDTO;
import com.viettel.coms.dto.ConstructionDetailDTO;
import com.viettel.coms.dto.ConstructionMerchandiseDTO;
import com.viettel.coms.dto.ConstructionReturnDTO;
import com.viettel.coms.dto.ConstructionStationWorkItemDTO;
import com.viettel.coms.dto.ConstructionStationWorkItemDTOResponse;
import com.viettel.coms.dto.ConstructionTaskDTO;
import com.viettel.coms.dto.ConstructionTaskDailyDTO;
import com.viettel.coms.dto.ConstructionTaskDetailDTO;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.coms.dto.DomainDTO;
import com.viettel.coms.dto.ExcelErrorDTO;
import com.viettel.coms.dto.ExportPxkDTO;
import com.viettel.coms.dto.ObstructedDetailDTO;
import com.viettel.coms.dto.SignVOfficeDetailDTO;
import com.viettel.coms.dto.StockTransGeneralDTO;
import com.viettel.coms.dto.SynStockTransDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.dto.SysUserDetailCOMSDTO;
import com.viettel.coms.dto.SysUserRequest;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.coms.dto.WorkItemDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.coms.dto.stockListDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.coms.utils.PermissionUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.service.base.utils.StringUtils;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
import com.viettel.utils.ImageUtil;
import com.viettel.wms.utils.ValidateUtils;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

//import com.viettel.Common.CommonDTO.ExcelErrorDTO;
//import org.apache.commons.lang3.StringUtils;

//import org.apache.commons.lang3.StringUtils;

@Service("constructionBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ConstructionBusinessImpl extends BaseFWBusinessImpl<ConstructionDAO, ConstructionDTO, ConstructionBO>
		implements ConstructionBusiness {

	private static final String VIEW_WORK_PROGRESS = "VIEW WORK_PROGRESS";
	private static final String CREATE_TASK = "CREATE_TASK";
	// chinhpxn 20180607 start
	static Logger LOGGER = LoggerFactory.getLogger(ConstructionBusinessImpl.class);
	// chinhpxn 20180607 end

	@Autowired
	private ConstructionScheduleDAO constructionScheduleDAO;

	@Autowired
	private ObstructedDAO obstructedDAO;
	@Autowired
	private ConstructionDAO constructionDAO;
	@Autowired
	private DmpnOrderDAO dmpnOrderDAO;
	@Autowired
	private WorkItemDAO workItemDAO;
	@Autowired
	private ConstructionTaskDAO constructionTaskDAO;
	@Autowired
	private ConstructionMerchandiseDAO constructionMerchandiseDAO;
	@Autowired
	private ConstructionAcceptanceCertDAO constructionAcceptanceCertDAO;
	@Autowired
	private UtilAttachDocumentDAO utilAttachDocumentDAO;
	// chinhpxn20180620
	@Autowired
	private ConstructionReturnDAO constructionReturnDAO;
	// chinhpxn20180620
	@Autowired
	CatStationDAO catStationDAO;
	//Huypq-20190213-start
	@Autowired
    private DepartmentDAO departmentDAO;
	//Huypq-end
	@Value("${folder_upload2}")
	private String folder2Upload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;
	@Value("${input_image_sub_folder_upload}")
	private String input_image_sub_folder_upload;

	@Context
	HttpServletRequest request;

	public ConstructionBusinessImpl() {
		tModel = new ConstructionBO();
		tDAO = constructionDAO;
	}

	@Override
	public ConstructionDAO gettDAO() {
		return constructionDAO;
	}

	@Override
	public long count() {
		return constructionDAO.count("ConstructionBO", null);
	}

	public List<CatConstructionTypeDTO> getCatConstructionType() {
		return constructionDAO.getCatConstructionType();
	}

	// chinhpxn 20180605 start
	public SysGroupDto getSysGroupInfo(Long id) {
		return constructionDAO.getSysGroupInfo(id);
	}

	// chinhpxn 20180605 end

	// chinhpxn 20180607 start

	int[] validateCol = { 1, 2, 3, 4, 5 };
	int[] constructionValidateCol = { 1, 2, 3, 4, 5 };
	HashMap<Integer, String> colName = new HashMap();
	{
		colName.put(1, "Mã công trình");
		colName.put(2, "Tên hạng mục");
		colName.put(3, "Hình thức thi công");
		colName.put(4, "Mã đơn vị/Đối tác thực hiện");
		colName.put(5, "Mã đơn vị giám sát");
	}
	HashMap<Integer, String> constructionColName = new HashMap();
	{
		constructionColName.put(1, "Loại công trình");
		constructionColName.put(2, "Mã trạm/ tuyến");
		constructionColName.put(3, "Mã công trình");
		constructionColName.put(4, "Vùng miền/ Loại tuyến/ Loại GPON/ Loại công trình lẻ");
		constructionColName.put(5, "Đơn vị thi công");
		constructionColName.put(6, "Ngày khởi công dự kiến");
		constructionColName.put(7, "Hình thức thi công");
		constructionColName.put(8, "Ghi chú");
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
		colAlias.put(0, "A");
	}

	public boolean validateString(String str) {
		return (str != null && str.length() > 0);
	}

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

	public boolean validateRequiredCell(Row row, List<ExcelErrorDTO> errorList) {
		DataFormatter formatter = new DataFormatter();
		boolean result = true;
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
		return result;
	}

	public boolean validateRequiredCellForConstruction(Row row, List<ExcelErrorDTO> errorList) {
		DataFormatter formatter = new DataFormatter();
		boolean result = true;
		for (int colIndex : constructionValidateCol) {
			if (!validateString(formatter.formatCellValue(row.getCell(colIndex)))) {
				ExcelErrorDTO errorDTO = new ExcelErrorDTO();
				errorDTO.setColumnError(colAlias.get(colIndex));
				errorDTO.setLineError(String.valueOf(row.getRowNum() + 1));
				errorDTO.setDetailError(constructionColName.get(colIndex) + " chưa nhập");
				errorList.add(errorDTO);
				result = false;
			}

		}
		return result;
	}

	private ExcelErrorDTO createError(int row, String column, String detail) {
		ExcelErrorDTO err = new ExcelErrorDTO();
		err.setColumnError(column);
		err.setLineError(String.valueOf(row));
		err.setDetailError(detail);
		return err;
	}

	public List<WorkItemDetailDTO> importWorkItemDetail(String fileInput) throws Exception {
		List<WorkItemDetailDTO> workLst = Lists.newArrayList();
		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
		String error = "";

		try {
			File f = new File(fileInput);
			ZipSecureFile.setMinInflateRatio(-1.0d);
			
			XSSFWorkbook workbook = new XSSFWorkbook(f);
			XSSFSheet sheet = workbook.getSheetAt(0);

			DataFormatter formatter = new DataFormatter();
			int count = 0;

			HashMap<String, String> constructionMap = new HashMap<String, String>();
			HashMap<String, String> constructionMap2 = new HashMap<String, String>();
			List<ConstructionDetailDTO> constructionLst = constructionDAO.getConstructionForImport();
			for (ConstructionDetailDTO obj : constructionLst) {
				if (obj.getCode() != null) {
					constructionMap.put(obj.getCode().toUpperCase(), obj.getConstructionId().toString());
					if (obj.getCatContructionTypeId() != null) {
						constructionMap2.put(obj.getCode().toUpperCase(), obj.getCatContructionTypeId().toString());
					}

				}

			}

			HashMap<String, String> catWorkItemTypeMap = new HashMap<String, String>();
			HashMap<String, String> catWorkItemTypeMap2 = new HashMap<String, String>();
			HashMap<String, String> catWorkItemTypeMap3 = new HashMap<String, String>();
			List<WorkItemDetailDTO> catWorkItemLst = constructionDAO.getCatWorkItemType();

			for (WorkItemDetailDTO obj : catWorkItemLst) {
				String key = null;
				if (obj.getName() != null && obj.getCatConstructionTypeId() != null) {
					key = obj.getName().toUpperCase().trim() + "|" + obj.getCatConstructionTypeId().toString();
					if (obj.getCode() != null) {
						catWorkItemTypeMap.put(key, obj.getCode().toUpperCase());
					}
					if (obj.getCatWorkItemTypeId() != null) {
						catWorkItemTypeMap2.put(key, obj.getCatWorkItemTypeId().toString());
					}
				}

				if (obj.getCatConstructionTypeId() != null && obj.getCatConstructionTypeName() != null) {
					catWorkItemTypeMap3.put(obj.getCatConstructionTypeId().toString(),
							obj.getCatConstructionTypeName());
				}

			}

			HashMap<String, String> sysGroupMap = new HashMap<String, String>();
			List<SysGroupDto> sysGroupLst = constructionDAO.getSysGroupForImport();
			for (SysGroupDto obj : sysGroupLst) {
				if (obj.getGroupCode() != null) {
					sysGroupMap.put(obj.getGroupCode().toUpperCase(), obj.getGroupId().toString());
				}
			}

			HashMap<String, String> catPartnerMap = new HashMap<String, String>();
			List<CatPartnerDTO> catPartnerLst = constructionDAO.getCatPartnerForImport();
			for (CatPartnerDTO obj : catPartnerLst) {
				if (obj.getCode() != null) {
					catPartnerMap.put(obj.getCode().toUpperCase(), obj.getCatPartnerId().toString());
				}

			}

			for (Row row : sheet) {
				count++;
				if (count >= 3 && checkIfRowIsEmpty(row))
					continue;
				WorkItemDetailDTO obj = new WorkItemDetailDTO();
				if (count >= 3) {
					if (!validateRequiredCell(row, errorList))
						continue;
					// kiểm tra các ô bắt buộc nhập đã dc nhập chưa

					String constructionCode = formatter.formatCellValue(row.getCell(1)).trim();
					String workItemName = formatter.formatCellValue(row.getCell(2)).toString().trim();
					String isInternal = formatter.formatCellValue(row.getCell(3)).toString().toUpperCase().trim();
					String constructorCode = formatter.formatCellValue(row.getCell(4)).toString().toUpperCase().trim();
					String supervisorCode = formatter.formatCellValue(row.getCell(5)).toString().toUpperCase().trim();

					Long constructionId = 0l;
					String workItemCode = null;
					Long catWorkItemTypeId = 0l;
					Long constructorId = 0l;
					Long supervisorId = 0l;
					Long constructionTypeId = 0l;
					if (validateString(constructionCode)) {
						try {
							constructionId = Long.parseLong(constructionMap.get(constructionCode.toUpperCase()));
							obj.setConstructionId(constructionId);
							constructionTypeId = Long.parseLong(constructionMap2.get(constructionCode.toUpperCase()));
						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1),
									colName.get(1) + " không tồn tại");
							errorList.add(errorDTO);
						}
					}

					if (validateString(workItemName)) {
						try {
							workItemCode = catWorkItemTypeMap
									.get(workItemName.toUpperCase() + "|" + constructionTypeId);
							catWorkItemTypeId = Long.parseLong(
									catWorkItemTypeMap2.get(workItemName.toUpperCase() + "|" + constructionTypeId));
							obj.setCode(constructionCode + "_" + workItemCode);
							obj.setName(workItemName);
							obj.setCatWorkItemTypeId(catWorkItemTypeId);
							Long catWorkItemGroupId = null;
							for(WorkItemDetailDTO widDto : catWorkItemLst){
								System.out.println(widDto.getCatWorkItemTypeId());
								if(widDto.getCatWorkItemTypeId().equals(catWorkItemTypeId)){
									catWorkItemGroupId = widDto.getCatWorkItemGroupId();
									obj.setCatWorkItemGroupId(catWorkItemGroupId);
									break;
								}
							}
						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2),
									colName.get(2) + " không thuộc loại công trình: "
											+ catWorkItemTypeMap3.get(constructionTypeId.toString()));
							errorList.add(errorDTO);
						}
					}
					if (!(isInternal.equals("1") || isInternal.equals("2"))) {
						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3),
								colName.get(3) + " không hợp lệ");
						errorList.add(errorDTO);
					} else {
						obj.setIsInternal(isInternal);
					}

					if (validateString(constructorCode)) {
						try {
							if (isInternal.equalsIgnoreCase("1")) {
								constructorId = Long.parseLong(sysGroupMap.get(constructorCode));
							} else {
								constructorId = Long.parseLong(catPartnerMap.get(constructorCode));
							}
							obj.setConstructorId(constructorId);
						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4),
									colName.get(4) + " không tồn tại");
							errorList.add(errorDTO);
						}

					}

					if (validateString(supervisorCode)) {
						try {
							supervisorId = Long.parseLong(sysGroupMap.get(supervisorCode));
							obj.setSupervisorId(supervisorId);
						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5),
									colName.get(5) + " không tồn tại");
							errorList.add(errorDTO);
						}
					}

					if (errorList.size() == 0) {
						workLst.add(obj);
					}
				}
			}

			if (errorList.size() > 0) {
				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
				List<WorkItemDetailDTO> emptyArray = Lists.newArrayList();
				workLst = emptyArray;
				WorkItemDetailDTO errorContainer = new WorkItemDetailDTO();
				errorContainer.setErrorList(errorList);
				errorContainer.setMessageColumn(6); // cột dùng để in ra lỗi
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
			List<WorkItemDetailDTO> emptyArray = Lists.newArrayList();
			workLst = emptyArray;
			WorkItemDetailDTO errorContainer = new WorkItemDetailDTO();
			errorContainer.setErrorList(errorList);
			errorContainer.setMessageColumn(6); // cột dùng để in ra lỗi
			errorContainer.setFilePathError(filePathError);
			workLst.add(errorContainer);
			return workLst;
		}
	}

	public List<WorkItemDetailDTO> getCatWorkItemType() {
		return constructionDAO.getCatWorkItemType();
	}

	public List<WorkItemDetailDTO> getWorkItem() {
		return constructionDAO.getWorkItem();
	}

	public List<SysGroupDto> getSysGroupForImport() {
		return constructionDAO.getSysGroupForImport();
	}

	public List<CatPartnerDTO> getCatPartnerForImport() {
		return constructionDAO.getCatPartnerForImport();
	}

	public List<ConstructionDetailDTO> getCatConstructionTypeForImport() {
		return constructionDAO.getCatConstructionTypeForImport();
	}
	//Huypq_20181010-start
	public List<ConstructionDetailDTO> getCheckCodeList(ConstructionDetailDTO obj) {
		return constructionDAO.getCheckCodeList(obj);
	}
	//Huypq_20181010-end
	
	//TungTT-24/1/2019 start
	
	public ConstructionDTO getDataUpdate(ConstructionDTO obj) {
		return constructionDAO.getDataUpdate(obj);
	}
	
//	public Long updateUnitConstruction(ConstructionDTO obj) throws ParseException {
// 	    constructionDAO.updateUnitConstruction(obj);
// 		return 0l;
// 	}
	//TungTT-24/1/2019 end
	
	public List<DepartmentDTO> getDepartmentForImport() {
		return constructionDAO.getDepartmentForImport();
	}

	public List<ConstructionDetailDTO> importConstruction(String fileInput, HttpServletRequest request)
			throws Exception {
		List<ConstructionDetailDTO> workLst = Lists.newArrayList();
		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();

		try {
			File f = new File(fileInput);
			XSSFWorkbook workbook = new XSSFWorkbook(f);
			XSSFSheet sheet = workbook.getSheetAt(0);

			DataFormatter formatter = new DataFormatter();
			int count = 0;

			HashMap<String, String> constructionMap = new HashMap<String, String>();
			List<ConstructionDetailDTO> constructionLst = constructionDAO.getConstructionForImport();
			for (ConstructionDetailDTO obj : constructionLst) {
				if (obj.getCode() != null) {
					constructionMap.put(obj.getCode().toUpperCase().trim(), obj.getConstructionId().toString());
				}

			}

			HashMap<String, String> catConstructionTypeMap = new HashMap<String, String>();
			List<ConstructionDetailDTO> catConstructionTypeLst = constructionDAO.getCatConstructionTypeForImport();
			for (ConstructionDetailDTO obj : catConstructionTypeLst) {
				if (obj.getName() != null) {
					catConstructionTypeMap.put(obj.getName().toUpperCase().trim(),
							obj.getCatConstructionTypeId().toString());
				}
			}

			HashMap<String, String> catStationMap = new HashMap<String, String>();
			HashMap<String, String> catStationMapTuyen = new HashMap<String, String>();
			HashMap<String, String> catStationMap2 = new HashMap<String, String>();
			List<CatStationDTO> catStationLst = getCatStationForImport(request);
			for (CatStationDTO obj : catStationLst) {
				if (obj.getType().equals("1")) {
					if (obj.getCode() != null) {
						catStationMap.put(obj.getCode().toUpperCase().trim(), obj.getId().toString());
					}
				} else {
					if (obj.getCode() != null) {
						catStationMapTuyen.put(obj.getCode().toUpperCase().trim(), obj.getId().toString());
					}
				}
				if (obj.getCode() != null && obj.getAddress() != null) {
					catStationMap2.put(obj.getCode().toUpperCase().trim(), obj.getAddress());
				}
			}

			HashMap<String, String> regionMap = new HashMap<String, String>();
			List<AppParamDTO> regionLst = constructionDAO.getAppParamByType("REGION");
			for (AppParamDTO obj : regionLst) {
				regionMap.put(obj.getName().toUpperCase().trim(), obj.getCode());
			}

			HashMap<String, String> lineTypeMap = new HashMap<String, String>();
			List<AppParamDTO> lineTypeLst = constructionDAO.getAppParamByType("CONSTRUCTION_LINE_TYPE");
			for (AppParamDTO obj : lineTypeLst) {
				lineTypeMap.put(obj.getName().toUpperCase().trim(), obj.getCode());
			}

			HashMap<String, String> gponTypeMap = new HashMap<String, String>();
			List<AppParamDTO> gponTypeLst = constructionDAO.getAppParamByType("CONSTRUCTION_GPON_TYPE");
			for (AppParamDTO obj : gponTypeLst) {
				gponTypeMap.put(obj.getName().toUpperCase().trim(), obj.getCode());
			}

			HashMap<String, String> leMap = new HashMap<String, String>();
			List<AppParamDTO> leLst = constructionDAO.getAppParamByType("CONSTRUCTION_OTHER_TYPE");
			for (AppParamDTO obj : leLst) {
				leMap.put(obj.getName().toUpperCase().trim(), obj.getCode());
			}

			HashMap<String, String> sysGroupMap = new HashMap<String, String>();
			List<SysGroupDto> sysGroupLst = constructionDAO.getSysGroupForImport();
			for (SysGroupDto obj : sysGroupLst) {
				if (obj.getGroupCode() != null) {
					sysGroupMap.put(obj.getGroupCode().toUpperCase(), obj.getGroupId().toString());
				}

			}

			HashMap<String, String> catConstructionDeployMap = new HashMap<String, String>();
			List<CatConstructionTypeDTO> catConstructionDeployLst = constructionDAO.getCatConstructionDeploy();
			for (CatConstructionTypeDTO obj : catConstructionDeployLst) {
				if (obj.getName() != null) {
					catConstructionDeployMap.put(obj.getName().toUpperCase().trim(), obj.getId().toString());
				}
			}

			for (Row row : sheet) {
				count++;
				if (count >= 3 && checkIfRowIsEmpty(row))
					continue;
				ConstructionDetailDTO obj = new ConstructionDetailDTO();
				if (count >= 3) {
					if (!validateRequiredCellForConstruction(row, errorList))
						continue;
					// kiểm tra các ô bắt buộc nhập đã dc nhập chưa

					String catConstructionTypeName = formatter.formatCellValue(row.getCell(1)).toUpperCase().trim();
					String catStationName = formatter.formatCellValue(row.getCell(2)).toUpperCase().trim();
					String constructionCode = formatter.formatCellValue(row.getCell(3)).trim();
					String regionOrType = formatter.formatCellValue(row.getCell(4)).toUpperCase().trim();
					String sysGroupCode = formatter.formatCellValue(row.getCell(5)).toUpperCase().trim();
					String expectedStartingDate = formatter.formatCellValue(row.getCell(6)).trim();
					String catConstructionDeployName = formatter.formatCellValue(row.getCell(7)).toUpperCase().trim();
					String description = formatter.formatCellValue(row.getCell(8)).trim();

					Long catConstructionTypeId = 0l;
					Long catStationId = 0l;
					Long regionOrTypeId = 0l;
					Long catConstructionDeployId = 0l;

					if (validateString(catConstructionTypeName)) {
						try {
							catConstructionTypeId = Long.parseLong(catConstructionTypeMap.get(catConstructionTypeName));
							obj.setCatConstructionTypeId(catConstructionTypeId);
						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1),
									constructionColName.get(1) + " không tồn tại");
							errorList.add(errorDTO);
						}
					}

					if (validateString(catStationName)) {
						try {
							if (catConstructionTypeId == 2l) {
								catStationId = Long.parseLong(catStationMapTuyen.get(catStationName));
							} else {
								catStationId = Long.parseLong(catStationMap.get(catStationName));
							}
							obj.setCatStationId(catStationId);
							obj.setName(catStationMap2.get(catStationName));
						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2),
									constructionColName.get(2) + " không tồn tại");
							errorList.add(errorDTO);
						}
					}

					if (validateString(constructionCode)) {
						try {
							if (constructionCode.length() > 50) {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3),
										constructionColName.get(3) + " có độ dài vượt quá giới hạn: 50");
								errorList.add(errorDTO);
							}
							if (constructionMap.get(constructionCode.toUpperCase()) != null) {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3),
										constructionColName.get(3) + " đã tồn tại trong cơ sở dữ liệu");
								errorList.add(errorDTO);
							} else {
								obj.setCode(constructionCode);
							}
						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3),
									constructionColName.get(3) + " không hợp lệ");
							errorList.add(errorDTO);
						}
					}

					if (validateString(regionOrType)) {
						try {
							if (catConstructionTypeId == 1l) {
								if (regionMap.get(regionOrType) != null) {
									regionOrTypeId = Long.parseLong(regionMap.get(regionOrType));
									obj.setRegion(regionOrTypeId);
								} else {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4),
											constructionColName.get(4) + " không tồn tại");
									errorList.add(errorDTO);
								}
							} else if (catConstructionTypeId == 2l) {
								if (lineTypeMap.get(regionOrType) != null) {
									obj.setDeployType(lineTypeMap.get(regionOrType));
								} else {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4),
											constructionColName.get(4) + " không tồn tại");
									errorList.add(errorDTO);
								}

							} else if (catConstructionTypeId == 3l) {
								if (gponTypeMap.get(regionOrType) != null) {
									obj.setDeployType(gponTypeMap.get(regionOrType));
								} else {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4),
											constructionColName.get(4) + " không tồn tại");
									errorList.add(errorDTO);
								}
							} else {
								if (leMap.get(regionOrType) != null) {
									obj.setDeployType(leMap.get(regionOrType));
								} else {
									ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4),
											constructionColName.get(4) + " không tồn tại");
									errorList.add(errorDTO);
								}

							}
						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4),
									constructionColName.get(4) + " không tồn tại");
							errorList.add(errorDTO);
						}
					}

					if (validateString(sysGroupCode)) {
						try {
							if (sysGroupMap.get(sysGroupCode) != null) {
								obj.setSysGroupId(sysGroupMap.get(sysGroupCode));
							} else {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5),
										constructionColName.get(5) + " không tồn tại");
								errorList.add(errorDTO);
							}

						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5),
									constructionColName.get(5) + " không tồn tại");
							errorList.add(errorDTO);
						}
					}

					if (validateString(expectedStartingDate)) {
						try {
							DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
							Date startDate = dateFormat.parse(expectedStartingDate);
							obj.setExcpectedStartingDate(startDate);
						} catch (Exception e) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6),
									constructionColName.get(6) + " không hợp lệ");
							errorList.add(errorDTO);
						}
					}

					if (validateString(catConstructionDeployName)) {
						if (catConstructionTypeId != 1l) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(7),
									constructionColName.get(7) + " không thuộc " + catConstructionTypeName);
							errorList.add(errorDTO);
						} else {
							try {
								catConstructionDeployId = Long
										.parseLong(catConstructionDeployMap.get(catConstructionDeployName));
								obj.setCatConstructionDeployId(catConstructionDeployId);
							} catch (Exception e) {
								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(7),
										constructionColName.get(7) + " không tồn tại");
								errorList.add(errorDTO);
							}
						}
					}

					if (description.length() > 1000) {
						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(8),
								constructionColName.get(8) + " có độ dài vượt quá giới hạn: 1000");
						errorList.add(errorDTO);
					} else {
						obj.setDescription(description);
					}

					if (errorList.size() == 0) {
						workLst.add(obj);
					}
				}
			}

			if (errorList.size() > 0) {
				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
				List<ConstructionDetailDTO> emptyArray = Lists.newArrayList();
				workLst = emptyArray;
				ConstructionDetailDTO errorContainer = new ConstructionDetailDTO();
				errorContainer.setErrorList(errorList);
				errorContainer.setMessageColumn(9); // cột dùng để in ra lỗi
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
			List<ConstructionDetailDTO> emptyArray = Lists.newArrayList();
			workLst = emptyArray;
			ConstructionDetailDTO errorContainer = new ConstructionDetailDTO();
			errorContainer.setErrorList(errorList);
			errorContainer.setMessageColumn(9); // cột dùng để in ra lỗi
			errorContainer.setFilePathError(filePathError);
			workLst.add(errorContainer);
			return workLst;
		}
	}

	public List<ConstructionDetailDTO> getConstructionForImport() {
		return constructionDAO.doSearch(new ConstructionDetailDTO(), null);
	}
	
	public List<ConstructionDetailDTO> getConstructionForImportGPXD() {
		return constructionDAO.doSearch(new ConstructionDetailDTO(), null);
	}

	public List<CatStationDTO> getCatStationForImport(HttpServletRequest request) {
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
				Constant.AdResourceKey.CONSTRUCTION, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		return constructionDAO.getCatStationForImport(groupIdList);
	}

	// chinhpxn 20180607 end

	public List<CatStationDTO> getCatStation(CatStationDTO obj, HttpServletRequest request) {
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
				Constant.AdResourceKey.CONSTRUCTION, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		return constructionDAO.getCatStation(obj, groupIdList);
	}

	public DataListDTO doSearch(ConstructionDetailDTO obj, Long sysGroupId, HttpServletRequest request) {
		List<ConstructionDetailDTO> ls = new ArrayList<ConstructionDetailDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW, Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty()) {
			ls = constructionDAO.doSearchDataConstruction(obj, groupIdList);
		}
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public DataListDTO doSearchTTTDCT(ConstructionDetailDTO obj, Long sysGroupId, HttpServletRequest request) {
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

		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public DataListDTO doSearchDSTH(ConstructionDetailDTO obj, Long sysGroupId, HttpServletRequest request) {
		List<ConstructionDetailDTO> ls = new ArrayList<ConstructionDetailDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
				Constant.AdResourceKey.EQUIPMENT_RETURN, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty())
			ls = constructionDAO.doSearchDSTH(obj, groupIdList);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public DataListDTO searchMerchandise(ConstructionDetailDTO obj) {
		List<ConstructionMerchandiseDTO> ls = constructionDAO.searchMerchandise(obj);
		// chinhpxn20180620
		// List<ConstructionMerchandiseDTO> newLst = new
		// ArrayList<ConstructionMerchandiseDTO>();
		// for (ConstructionMerchandiseDTO dto : ls) {
		// if(dto.getSlConLai() != 0) {
		// newLst.add(dto);
		// }
		// }
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		// chinhpxn20180620
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public List<ConstructionMerchandiseDTO> searchMerchandiseForSave(ConstructionDetailDTO obj) {
		List<ConstructionMerchandiseDTO> ls = constructionDAO.searchMerchandiseForSave(obj);
		List<ConstructionMerchandiseDTO> newLst = new ArrayList<ConstructionMerchandiseDTO>();
		for (ConstructionMerchandiseDTO dto : ls) {
			if (dto.getSlConLai() != 0) {
				newLst.add(dto);
			}
		}
		return newLst;
	}

	public DataListDTO doSearchWorkItem(ConstructionDetailDTO obj) {
		List<WorkItemDetailDTO> ls = constructionDAO.doSearchWorkItem(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public Long addWorkItem(WorkItemDetailDTO obj) {
		checkNameCode(obj.getCode(), null);
		Long constructionId = workItemDAO.saveObject(obj.toModel());
		return constructionId;
	}

	// chinhpxn_20180615_start
	public String addWorkItemLst(List<WorkItemDetailDTO> dtoLst) {
		List<WorkItemBO> objLst = new ArrayList<WorkItemBO>();
		for (WorkItemDetailDTO obj : dtoLst) {
			objLst.add(obj.toModel());
		}
		return workItemDAO.saveList(objLst);
	}

	// chinhpxn_20180615_end
	public Long updateWorkItem(WorkItemDetailDTO obj) {
		checkNameCode(obj.getCode(), obj.getConstructionId());
		Long status = workItemDAO.updateObject(obj.toModel());
		return status;

	}

	public void remove(ConstructionDetailDTO obj, HttpServletRequest request) {
		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE, Constant.AdResourceKey.CONSTRUCTION,
				request)) {
			throw new IllegalArgumentException("Bạn không có quyền xóa thông tin công trình");
		}
		long constructionId = constructionDAO.getProvinceIdByConstructionId(obj.getConstructionId());
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.CREATE,
				Constant.AdResourceKey.CONSTRUCTION, constructionId, request)) {
			throw new IllegalArgumentException("Bạn không có quyền xóa thông tin công trình cho trạm/ tuyến này");
		}

		constructionDAO.remove(obj);
	}

	public Long add(ConstructionDTO obj, HttpServletRequest request) {
		checkNameCode(obj.getCode(), null);
		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE, Constant.AdResourceKey.CONSTRUCTION,
				request)) {
			throw new IllegalArgumentException("Bạn không có quyền tạo mới thông tin công trình");
		}
		long provinceId = constructionDAO.getProvinceIdByCatStation(obj.getCatStationId());
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.CREATE,
				Constant.AdResourceKey.CONSTRUCTION, provinceId, request)) {
			throw new IllegalArgumentException("Bạn không có quyền tạo thông tin công trình cho trạm/ tuyến này");
		}
		obj.setIsObstructed("0");
		Long constructionId = constructionDAO.saveObject(obj.toModel());

		return constructionId;
	}

	// chinhpxn_20180614_start
	public Long addConstructionForImport(ConstructionDetailDTO obj) {
		return constructionDAO.saveObject(obj.toModel());
	}

	// chinhpxn_20180614_end

	public void checkNameCode(String code, Long constructionId) {
		boolean isExist = constructionDAO.checkNameCode(code, constructionId);
		if (isExist)
			throw new IllegalArgumentException("Mã công trình đã tồn tại!");
	}

	public ConstructionDetailDTO getById(Long id) throws Exception {
		ConstructionDetailDTO data = constructionDAO.getConstructionById(id);
		data.setListFileVuong(utilAttachDocumentDAO.getByTypeAndObjectTC(id, "43"));
		List<UtilAttachDocumentDTO> listFileBGMBBuild = utilAttachDocumentDAO.getByTypeAndObjectTC(id, "41");
		List<UtilAttachDocumentDTO> listFileBGMBElectric = utilAttachDocumentDAO.getByTypeAndObjectTC(id, "53");
		listFileBGMBBuild.addAll(listFileBGMBElectric);
		data.setListFileBGMB(listFileBGMBBuild);
		data.setListFileStart(utilAttachDocumentDAO.getByTypeAndObjectTC(id, "42"));
		data.setListFileMerchandise(utilAttachDocumentDAO.getByTypeAndObjectTC(id, "46"));
		data.setListFileConstrLicence(utilAttachDocumentDAO.getByTypeAndObjectTC(id, "54"));
		data.setListFileConstrDesign(utilAttachDocumentDAO.getByTypeAndObjectTC(id, "55"));
		// hungnx 080618 start
		data.setFileLst(utilAttachDocumentDAO.getByTypeAndObjectTC(id, Constants.FILETYPE.CONSTRUCTION));
		// hungnx 080618 end
		return data;
	}

	public List<AppParamDTO> getAppParamByType(String type) {
		return constructionDAO.getAppParamByType(type);
	}

	public Long updateConstruction(ConstructionDTO obj, HttpServletRequest request) {
		checkNameCode(obj.getCode(), obj.getConstructionId());
		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE, Constant.AdResourceKey.CONSTRUCTION,
				request)) {
			throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa thông tin công trình");
		}
		long provinceId = constructionDAO.getProvinceIdByCatStation(obj.getCatStationId());
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.CREATE,
				Constant.AdResourceKey.CONSTRUCTION, provinceId, request)) {
			throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa thông tin công trình cho trạm/ tuyến này");
		}
		Long status = constructionDAO.updateConstruction(obj.toModel());
		//TungTT 24/1/2019 start
		
	    ConstructionDTO objUpdate =  constructionDAO.getDataUpdate(obj);
	    if(objUpdate != null) {
	    	constructionDAO.updateUnitConstruction(objUpdate.getSysUserId(),objUpdate.getSysUserName(),obj.getConstructionId());  	
	    } 
		//TungTT 24/1/2019 end
		return status;

	}

	public List<CatConstructionTypeDTO> getCatConstructionDeploy() {
		return constructionDAO.getCatConstructionDeploy();
	}

	@Transactional(rollbackFor = Exception.class)
	public ConstructionDetailDTO updateVuongItem(ObstructedDetailDTO obj, String userName, Long userId)
			throws Exception {
		// TODO Auto-generated method stub
		Long idVuong = null;
		if (obj.getObstructedId() == null) {
			if ("0".equals(obj.getObstructedState()))
				obj.setClosedDate(new Date());
			else {
				obj.setClosedDate(null);
			}
			idVuong = obstructedDAO.saveObject(obj.toModel());
		} else {
			if ("0".equals(obj.getObstructedState()))
				obj.setClosedDate(new Date());
			else {
				obj.setClosedDate(null);
			}
			idVuong = obj.getObstructedId();
			obstructedDAO.updateObject(obj.toModel());
		}
		obstructedDAO.getSession().flush();
		constructionDAO.updateVuongItem(obj);
		// chinhpxn 20180606 start
		constructionDAO.updateVuongTask(obj);
		// chinhpxn 20180606 end
		List<Long> listId = utilAttachDocumentDAO.getIdByObjectAndType(idVuong, 43L);
		List<Long> deleteId = new ArrayList<Long>(listId);
		if (obj.getListFileVuong() != null) {
			for (UtilAttachDocumentDTO file : obj.getListFileVuong()) {
				if (file.getUtilAttachDocumentId() == null) {
					file.setObjectId(idVuong);
					file.setType("43");
					file.setCreatedDate(new Date());
					file.setCreatedUserId(userId);
					file.setCreatedUserName(userName);
					file.setDescription("file Vướng");
					file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
					utilAttachDocumentDAO.saveObject(file.toModel());
				}
			}
			for (Long id : listId) {
				for (UtilAttachDocumentDTO file : obj.getListFileVuong()) {
					if (file.getUtilAttachDocumentId() != null) {
						if (id.longValue() == file.getUtilAttachDocumentId().longValue())
							deleteId.remove(id);
					}
				}
			}
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		} else {
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		}
		return constructionDAO.getConstructionById(obj.getConstructionId());
	}

	public Long updateBGMBItem(ConstructionDetailDTO obj, String userName) throws Exception {
		// TODO Auto-generated method stub
		constructionDAO.updateBGMBItem(obj);
		List<Long> listId = utilAttachDocumentDAO.getIdByObjectAndType(obj.getConstructionId(), 41L);
		List<Long> deleteId = new ArrayList<Long>(listId);
		if (obj.getListFileBGMB() != null) {
			for (UtilAttachDocumentDTO file : obj.getListFileBGMB()) {
				if (file.getUtilAttachDocumentId() == null) {
					file.setObjectId(obj.getConstructionId());
					
					file.setType(obj.getCustomField().equals("1") ? "41" : "53");
					file.setCreatedDate(new Date());
					file.setCreatedUserId(obj.getUpdatedUserId());
					file.setCreatedUserName(userName);
					file.setDescription(obj.getCustomField().equals("1") ? "file bàn giao mặt bằng xây dựng" : "file bàn giao mặt bằng điện");
					file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
					utilAttachDocumentDAO.saveObject(file.toModel());
				}
			}
			for (Long id : listId) {
				for (UtilAttachDocumentDTO file : obj.getListFileBGMB()) {
					if (file.getUtilAttachDocumentId() != null) {
						if (id.longValue() == file.getUtilAttachDocumentId().longValue())
							deleteId.remove(id);
					}
				}
			}
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		} else {
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		}
		return obj.getConstructionId();
	}
	
	public Long updateConstrLicence(ConstructionDetailDTO obj, String userName) throws Exception {
		// TODO Auto-generated method stub
		constructionDAO.updateConstrLicence(obj);
		List<Long> listId = utilAttachDocumentDAO.getIdByObjectAndType(obj.getConstructionId(), 54L);
		List<Long> deleteId = new ArrayList<Long>(listId);
		if (obj.getListFileConstrLicence() != null) {
			for (UtilAttachDocumentDTO file : obj.getListFileConstrLicence()) {
				if (file.getUtilAttachDocumentId() == null) {
					file.setObjectId(obj.getConstructionId());
					
					file.setType("54");
					file.setCreatedDate(new Date());
					file.setCreatedUserId(obj.getUpdatedUserId());
					file.setCreatedUserName(userName);
					file.setDescription("giấy phép xây dựng" );
					file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
					utilAttachDocumentDAO.saveObject(file.toModel());
				}
			}
			for (Long id : listId) {
				for (UtilAttachDocumentDTO file : obj.getListFileConstrLicence()) {
					if (file.getUtilAttachDocumentId() != null) {
						if (id.longValue() == file.getUtilAttachDocumentId().longValue())
							deleteId.remove(id);
					}
				}
			}
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		} else {
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		}
		return obj.getConstructionId();
	}
	
	public Long updateConstrDesign(ConstructionDetailDTO obj, String userName) throws Exception {
		// TODO Auto-generated method stub
		constructionDAO.updateConstrDesign(obj);
		List<Long> listId = utilAttachDocumentDAO.getIdByObjectAndType(obj.getConstructionId(), 55L);
		List<Long> deleteId = new ArrayList<Long>(listId);
		if (obj.getListFileConstrDesign() != null) {
			for (UtilAttachDocumentDTO file : obj.getListFileConstrDesign()) {
				if (file.getUtilAttachDocumentId() == null) {
					file.setObjectId(obj.getConstructionId());
					
					file.setType("55");
					file.setCreatedDate(new Date());
					file.setCreatedUserId(obj.getUpdatedUserId());
					file.setCreatedUserName(userName);
					file.setDescription("thiết kế xây dựng" );
					file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
					utilAttachDocumentDAO.saveObject(file.toModel());
				}
			}
			for (Long id : listId) {
				for (UtilAttachDocumentDTO file : obj.getListFileConstrDesign()) {
					if (file.getUtilAttachDocumentId() != null) {
						if (id.longValue() == file.getUtilAttachDocumentId().longValue())
							deleteId.remove(id);
					}
				}
			}
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		} else {
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		}
		return obj.getConstructionId();
	}

	public Long updateHSHCItem(ConstructionDetailDTO obj, String userName, HttpServletRequest request)
			throws Exception {
		// TODO Auto-generated method stub
		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.UNDO, Constant.AdResourceKey.CONSTRUCTION_PRICE,
				request)) {
			throw new IllegalArgumentException("Bạn không có quyền hủy hoàn thành");
		}

		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.UNDO,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, obj.getCatProvinceId(), request)) {
			throw new IllegalArgumentException("Bạn không có quyền hủy hoàn thành");
		}
		constructionDAO.updateHSHCItem(obj);
		List<Long> listId = utilAttachDocumentDAO.getIdByObjectAndType(obj.getConstructionId(), 47L);
		List<Long> deleteId = new ArrayList<Long>(listId);
		if (obj.getListFileHSHC() != null) {
			for (UtilAttachDocumentDTO file : obj.getListFileHSHC()) {
				if (file.getUtilAttachDocumentId() == null) {
					file.setObjectId(obj.getConstructionId());
					file.setType("47");
					file.setCreatedDate(new Date());
					file.setCreatedUserId(obj.getUpdatedUserId());
					file.setCreatedUserName(userName);
					file.setDescription("file HSHC");
					file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
					utilAttachDocumentDAO.saveObject(file.toModel());
				}
			}
			for (Long id : listId) {
				for (UtilAttachDocumentDTO file : obj.getListFileHSHC()) {
					if (file.getUtilAttachDocumentId() != null) {
						if (id.longValue() == file.getUtilAttachDocumentId().longValue())
							deleteId.remove(id);
					}
				}
			}
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		} else {
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		}
		return obj.getConstructionId();
	}

	public Long updateDTItem(ConstructionDetailDTO obj, String userName, Long sysUserId, HttpServletRequest request)
			throws Exception {
		// TODO Auto-generated method stub
		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
			throw new IllegalArgumentException("Bạn không có quyền xác nhận");
		}

		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, obj.getCatProvinceId(), request)) {
			throw new IllegalArgumentException("Bạn không có quyền từ chối");
		}
		constructionDAO.updateDTItem(obj, sysUserId);
		List<Long> listId = utilAttachDocumentDAO.getIdByObjectAndType(obj.getConstructionId(), 48L);
		List<Long> deleteId = new ArrayList<Long>(listId);
		if (obj.getListFileDT() != null) {
			for (UtilAttachDocumentDTO file : obj.getListFileDT()) {
				if (file.getUtilAttachDocumentId() == null) {
					file.setObjectId(obj.getConstructionId());
					file.setType("48");
					file.setCreatedDate(new Date());
					file.setCreatedUserId(obj.getUpdatedUserId());
					file.setCreatedUserName(userName);
					file.setDescription("file DT");
					file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
					utilAttachDocumentDAO.saveObject(file.toModel());
				}
			}
			for (Long id : listId) {
				for (UtilAttachDocumentDTO file : obj.getListFileDT()) {
					if (file.getUtilAttachDocumentId() != null) {
						if (id.longValue() == file.getUtilAttachDocumentId().longValue())
							deleteId.remove(id);
					}
				}
			}
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		} else {
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		}
		return obj.getConstructionId();
	}

	public Long checkPermissionsApproved(ConstructionDetailDTO obj, Long sysGroupId, HttpServletRequest request) {

		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
			throw new IllegalArgumentException("Bạn không có quyền phê duyệt");
		}
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, obj.getCatProvinceId(), request)) {
			throw new IllegalArgumentException("Bạn không có quyền phê duyệt cho trạm/tuyến này");
		}
		try {
			return 0l;
		} catch (Exception e) {
			return 1l;
		}

	}

	public Long checkPermissionsCancel(ConstructionDetailDTO obj, Long sysGroupId, HttpServletRequest request) {

		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
			throw new IllegalArgumentException("Bạn không có quyền từ chối");
		}
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, obj.getCatProvinceId(), request)) {
			throw new IllegalArgumentException("Bạn không có quyền từ chối cho trạm/tuyến này");
		}
		try {
			return 0l;
		} catch (Exception e) {
			return 1l;
		}
	}

	public Long checkPermissions(ConstructionDetailDTO obj, Long sysGroupId, HttpServletRequest request) {

		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
			throw new IllegalArgumentException("Bạn không có quyền ");
		}
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, obj.getCatProvinceId(), request)) {
			throw new IllegalArgumentException("Bạn không có quyền với trạm/tuyến này");
		}
		try {
			return 0l;
		} catch (Exception e) {
			return 1l;
		}
	}

	public Long checkPermissionsUndo(ConstructionDetailDTO obj, Long sysGroupId, HttpServletRequest request) {

		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
			throw new IllegalArgumentException("Bạn không có quyền Undo");
		}
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.CONSTRUCTION_PRICE, obj.getCatProvinceId(), request)) {
			throw new IllegalArgumentException("Bạn không có quyền Undo cho trạm/tuyến này");
		}
		try {
			return 0l;
		} catch (Exception e) {
			return 1l;
		}
	}

	public Long updateDTItemApproved(ConstructionDetailDTO obj, String userName, Long sysUserId,
			HttpServletRequest request) throws Exception {
		// TODO Auto-generated method stub
		// if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.UNDO,
		// Constant.AdResourceKey.CONSTRUCTION_PRICE, request)) {
		// throw new IllegalArgumentException(
		// "Bạn không có quyền phê duyệt");
		// }
		// if (!VpsPermissionChecker.checkPermissionOnDomainData(
		// Constant.OperationKey.APPROVED,
		// Constant.AdResourceKey.CONSTRUCTION_PRICE,
		// obj.getCatProvinceId(), request)) {
		// throw new IllegalArgumentException(
		// "Bạn không có quyền phê duyệt cho trạm/tuyến này")
		// ;
		// }
		constructionDAO.updateDTItemApprover(obj, sysUserId);
		List<Long> listId = utilAttachDocumentDAO.getIdByObjectAndType(obj.getConstructionId(), 48L);
		List<Long> deleteId = new ArrayList<Long>(listId);
		if (obj.getListFileDT() != null) {
			for (UtilAttachDocumentDTO file : obj.getListFileDT()) {
				if (file.getUtilAttachDocumentId() == null) {
					file.setObjectId(obj.getConstructionId());
					file.setType("48");
					file.setCreatedDate(new Date());
					file.setCreatedUserId(obj.getUpdatedUserId());
					file.setCreatedUserName(userName);
					file.setDescription("file DT");
					file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
					utilAttachDocumentDAO.saveObject(file.toModel());
				}
			}
			for (Long id : listId) {
				for (UtilAttachDocumentDTO file : obj.getListFileDT()) {
					if (file.getUtilAttachDocumentId() != null) {
						if (id.longValue() == file.getUtilAttachDocumentId().longValue())
							deleteId.remove(id);
					}
				}
			}
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		} else {
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		}
		return obj.getConstructionId();
	}

	public Long updateStartItem(ConstructionDetailDTO obj, String userName) throws Exception {
		// TODO Auto-generated method stub
		constructionDAO.updateStartItem(obj);
		List<Long> listId = utilAttachDocumentDAO.getIdByObjectAndType(obj.getConstructionId(), 42L);
		List<Long> deleteId = new ArrayList<Long>(listId);
		if (obj.getListFileStart() != null) {
			for (UtilAttachDocumentDTO file : obj.getListFileStart()) {
				if (file.getUtilAttachDocumentId() == null) {
					file.setObjectId(obj.getConstructionId());
					file.setType("42");
					file.setCreatedDate(new Date());
					file.setCreatedUserId(obj.getUpdatedUserId());
					file.setCreatedUserName(userName);
					file.setDescription("file Start");
					file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
					utilAttachDocumentDAO.saveObject(file.toModel());
				}
			}
			for (Long id : listId) {
				for (UtilAttachDocumentDTO file : obj.getListFileStart()) {
					if (file.getUtilAttachDocumentId() != null) {
						if (id.longValue() == file.getUtilAttachDocumentId().longValue())
							deleteId.remove(id);
					}
				}
			}
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		} else {
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		}
		return obj.getConstructionId();
	}

	public Long updateMerchandiseItem(ConstructionDetailDTO obj, String userName) throws Exception {
		// TODO Auto-generated method stub
		constructionDAO.updateMerchandiseItem(obj);
		List<Long> listId = utilAttachDocumentDAO.getIdByObjectAndType(obj.getConstructionId(), 46L);
		List<Long> deleteId = new ArrayList<Long>(listId);
		if (obj.getListFileMerchandise() != null) {
			utilAttachDocumentDAO.deleteListUtils(deleteId);
			for (UtilAttachDocumentDTO file : obj.getListFileMerchandise()) {
				file.setObjectId(obj.getConstructionId());
				file.setType("46");
				file.setCreatedDate(new Date());
				file.setCreatedUserId(obj.getUpdatedUserId());
				file.setCreatedUserName(userName);
				file.setDescription("file Merchandise");
				file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
				utilAttachDocumentDAO.saveObject(file.toModel());
			}
		}
		if (obj.getListConstructionReturn() != null) {
			List<ConstructionReturnBO> saveLst = new ArrayList<ConstructionReturnBO>();
			for (ConstructionReturnDTO dto : obj.getListConstructionReturn()) {
				dto.setConstructionId(obj.getConstructionId());
				dto.setQuantity(dto.getSlConLai());
				saveLst.add(dto.toModel());
			}
			constructionReturnDAO.saveList(saveLst);
		}
		return obj.getConstructionId();
	}

	public List<CatCommonDTO> getWorkItemType(Long ida) {
		// TODO Auto-generated method stub
		return constructionDAO.getWorkItemType(ida);
	}

	public ConstructionDetailDTO getConstructionHSHCById(ConstructionTaskDetailDTO obj) throws Exception {
		ConstructionDetailDTO constructionDetailDTO = new ConstructionDetailDTO();
		List<WorkItemDetailDTO> listWorkItem = workItemDAO.getListWorkItemByConsId(obj.getConstructionId());
		constructionDetailDTO.setListWorkItem(listWorkItem);
		if (obj.getTypeHSHC() != 1) {
			constructionDetailDTO
					.setListFileDT(utilAttachDocumentDAO.getByTypeAndObjectTC(obj.getConstructionId(), "48"));
		}
		constructionDetailDTO
				.setListFileHSHC(utilAttachDocumentDAO.getByTypeAndObjectTC(obj.getConstructionId(), "47"));
		return constructionDetailDTO;
	}

	public ConstructionDetailDTO getStockStrans(Long id) {
		ConstructionDetailDTO constructionDetailDTO = new ConstructionDetailDTO();
		// Bên A
		List<StockTransGeneralDTO> listSynStockTrans = constructionDAO.getSynStockTrans(id);
		List<StockTransGeneralDTO> listDSVT = constructionDAO.getDSVT(id);
		// Bên B
		List<StockTransGeneralDTO> listStockTrans = constructionDAO.getStockTrans(id);
		ConstructionAcceptanceCertDTO certDTO = constructionDAO.getCertDTO(id);
		List<StockTransGeneralDTO> listDSVTBB = constructionDAO.getListVTBB(id);
		// thầu phụ
		List<ConstructionMerchandiseDTO> listDSTP = constructionMerchandiseDAO.getListDSTP(id);
		// thông tin status và obstructed_statuss
		String lStatus = constructionMerchandiseDAO.getListStatusAnObstructed(id);
		String lStatus1 = constructionMerchandiseDAO.getListStatusAnObstructed1(id);
		constructionDetailDTO.setListStockTrans(listStockTrans);
		constructionDetailDTO.setListDsvtDto(listDSVT);
		constructionDetailDTO.setListSynStockTrans(listSynStockTrans);
		constructionDetailDTO.setCertDTO(certDTO);
		constructionDetailDTO.setListDSTP(listDSTP);
		constructionDetailDTO.setListDSVTBB(listDSVTBB);
		constructionDetailDTO.setLstatus(lStatus);
		constructionDetailDTO.setLstatus1(lStatus1);

		return constructionDetailDTO;
	}

	// START SERVICE MOBILE

	public List<ConstructionStationWorkItemDTO> getNameAndAddressContruction(SysUserRequest request,
			ConstructionStationWorkItemDTOResponse response) {

		List<DomainDTO> isViewWorkProgress = constructionScheduleDAO.getByAdResource(request.getSysUserId(),
				VIEW_WORK_PROGRESS);
		if (isViewWorkProgress.size() > 0) {
			SysUserRequest sysUser = new SysUserRequest();
			sysUser.setAuthorities(VIEW_WORK_PROGRESS);
			response.setSysUser(sysUser);
		}

		return constructionDAO.getListConstructionByIdSysGroupId(request, isViewWorkProgress);
	}

	// END SERVICE MOBILE
	public Long saveMerchandise(ConstructionDetailDTO obj, KttsUserSession objUser) {
		List<StockTransGeneralDTO> listDSVTA = obj.getListSynStockTrans();
		List<StockTransGeneralDTO> listDSTBA = obj.getListDsvtDto();
		ConstructionAcceptanceCertDTO certDTO = obj.getCertDTO();
		List<Long> li = constructionDAO.getListIdConstruction();
		List<StockTransGeneralDTO> listDSVTBB = obj.getListDSVTBB();
		List<StockTransGeneralDTO> listDSTTBB = obj.getListStockTrans();

		// chinhpxn20180621 - ko tac dong bang ConstructionMerchandise nua
		// xu li du lieu ben B
		// for (StockTransGeneralDTO dto : listDSVTBB) {
		// if(dto.getNumberSuDung()==null && dto.getNumberXuat()!=null){
		// dto.setNumberSuDung(0d);
		// }
		// List<StockTransGeneralDTO> fa =
		// constructionMerchandiseDAO.getListVatTu(obj.getConstructionId(),
		// dto.getGoodsId());
		// int slcl = 0;
		// int slsd = dto.getNumberSuDung().intValue();
		// for (StockTransGeneralDTO a : fa) {
		// if(a.getNumberThuhoi() == null){
		// slcl = a.getNumberXuat().intValue();
		// }
		// if(a.getNumberThuhoi() != null){
		// slcl = a.getNumberXuat().intValue()- a.getNumberThuhoi().intValue();
		// }
		// if (slcl < slsd) {
		// constructionMerchandiseDAO.removeDSVTBB(a.getMerEntityId(),dto.getGoodsId());
		// ConstructionMerchandiseDTO mer = new ConstructionMerchandiseDTO();
		// mer.setGoodsCode(dto.getGoodsCode());
		// mer.setRemainCount((double)0);
		// mer.setQuantity((double) slcl);
		// mer.setType("2");
		// mer.setGoodsName(dto.getGoodsName());
		// mer.setMerEntityId(a.getMerEntityId());
		// mer.setConstructionId(dto.getConstructionId());
		// mer.setGoodsUnitName(dto.getGoodsUnitName());
		// mer.setGoodsId(dto.getGoodsId());
		// mer.setGoodsIsSerial("0");
		// constructionMerchandiseDAO.saveObject(mer.toModel());
		// slsd = slsd-slcl;
		// } else if (slcl >= slsd) {
		// constructionMerchandiseDAO.removeDSVTBB(a.getMerEntityId(),dto.getGoodsId());
		// ConstructionMerchandiseDTO mer = new ConstructionMerchandiseDTO();
		// mer.setGoodsCode(dto.getGoodsCode());
		// mer.setRemainCount((double) slcl-slsd);
		// mer.setQuantity((double) slsd);
		// mer.setType("2");
		// mer.setGoodsName(dto.getGoodsName());
		// mer.setMerEntityId(a.getMerEntityId());
		// mer.setConstructionId(dto.getConstructionId());
		// mer.setGoodsUnitName(dto.getGoodsUnitName());
		// mer.setGoodsId(dto.getGoodsId());
		// mer.setGoodsIsSerial("0");
		// constructionMerchandiseDAO.saveObject(mer.toModel());
		// slsd=0;
		// }
		// }
		// }
		// //thiet bi B
		// constructionMerchandiseDAO.deleteAllTBBB(obj.getConstructionId());
		// if(listDSTTBB!=null){
		// for (StockTransGeneralDTO dto : listDSTTBB) {
		// if(dto.getEmploy()==null){
		// dto.setEmploy(0l);
		// }
		// if(dto.getEmploy()==1){
		// String type ="2";
		// Double quantity = 1D;
		// Double remainCount = 0D;
		// AddVTTBB(dto , quantity, remainCount , type);
		// }
		// else{
		// String type ="2";
		// Double quantity = 0D;
		// Double remainCount = 1D;
		// AddVTTBB(dto , quantity, remainCount , type);
		// }
		// }
		// }
		// lưu thông tin chung
		Long numberAcceptance = constructionMerchandiseDAO.getNumberAcceptance(obj.getConstructionId());
		ConstructionAcceptanceCertDTO acceptanDto = constructionMerchandiseDAO.getListAcc(obj.getConstructionId());
		if (numberAcceptance == 0) {
			ConstructionAcceptanceCertDTO con = new ConstructionAcceptanceCertDTO();
			con.setConstructionId(obj.getConstructionId());
			con.setCreatedDate(new Date());
			con.setCreatedUserId(objUser.getVpsUserInfo().getSysUserId());
			con.setCreatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			con.setCompleteDate(certDTO.getCompleteDate());
			con.setStartingDate(certDTO.getStartingDate());
			con.setImporter(certDTO.getImporter());
			constructionAcceptanceCertDAO.saveObject(con.toModel());
		} else {
			constructionMerchandiseDAO.DeleteTTTC(obj.getConstructionId());
			ConstructionAcceptanceCertDTO con = new ConstructionAcceptanceCertDTO();
			Date now = new Date();
			con.setCreatedDate(acceptanDto.getCreatedDate());
			con.setCreatedUserId(acceptanDto.getCreatedUserId());
			con.setCreatedGroupId(acceptanDto.getCreatedGroupId());
			con.setUpdatedDate(now);
			con.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
			con.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
			con.setConstructionId(obj.getConstructionId());
			con.setCompleteDate(certDTO.getCompleteDate());
			con.setStartingDate(certDTO.getStartingDate());
			con.setImporter(certDTO.getImporter());
			constructionAcceptanceCertDAO.saveObject(con.toModel());
		}

		// lưu thông tin vật tư ben A
		// constructionMerchandiseDAO.DeleteVTA(obj.getConstructionId());
		// for (StockTransGeneralDTO listDto : listDSVTA) {
		// ConstructionMerchandiseDTO mer = new ConstructionMerchandiseDTO();
		// mer.setGoodsCode(listDto.getGoodsCode());
		// mer.setRemainCount(listDto.getRemainQuantity());
		// mer.setQuantity(listDto.getQuantity());
		// mer.setType("1");
		// mer.setGoodsName(listDto.getGoodsName());
		// mer.setMerEntityId(listDto.getMerEntityId());
		// mer.setConstructionId(listDto.getConstructionId());
		// mer.setConstructionMerchandiseId(listDto
		// .getConstructionMerchadiseId());
		// mer.setGoodsUnitName(listDto.getGoodsUnitName());
		// mer.setGoodsId(listDto.getGoodsId());
		// mer.setGoodsIsSerial("0");
		// mer.setSerial(listDto.getSerial());
		// constructionMerchandiseDAO.saveObject(mer.toModel());
		// }
		// // lưu thông tin thiết bị bên A
		// constructionMerchandiseDAO.DeleteTBA(obj.getConstructionId());
		// if(listDSTBA!=null){
		// for (StockTransGeneralDTO dto : listDSTBA) {
		// if(dto.getEmploy()==null){
		// dto.setEmploy(0l);
		// }
		// if (dto.getEmploy() == 1) {
		// String type ="1";
		// Double quantity = 1D;
		// Double remainCount = 0D;
		// AddVTTBB(dto , quantity, remainCount ,type);
		// }
		// else{
		// String type ="1";
		// Double quantity = 0D;
		// Double remainCount = 1D;
		// AddVTTBB(dto , quantity, remainCount , type);
		// }
		// }
		// }
		// chinhpxn20180621
		// set trạng thái sau khi nghiệm thu
		constructionDAO.updateStatusNT(obj.getConstructionId());
		return obj.getConstructionId();
	}

	private void AddVTTBB(StockTransGeneralDTO dto, Double quantity, Double remainCount, String type) {
		ConstructionMerchandiseDTO tb = new ConstructionMerchandiseDTO();
		tb.setGoodsCode(dto.getGoodsCode());
		tb.setRemainCount(remainCount);
		tb.setType(type);
		tb.setQuantity(quantity);
		tb.setGoodsName(dto.getGoodsName());
		tb.setMerEntityId(dto.getMerEntityId());
		tb.setConstructionId(dto.getConstructionId());
		tb.setConstructionMerchandiseId(dto.getConstructionMerchadiseId());
		tb.setGoodsUnitName(dto.getGoodsUnitName());
		tb.setGoodsId(dto.getGoodsId());
		tb.setGoodsIsSerial(dto.getGoodsIsSerial());
		tb.setSerial(dto.getSerial());
		constructionMerchandiseDAO.saveObject(tb.toModel());
	}

	private void addMerchandise(List<StockTransGeneralDTO> list, ConstructionDetailDTO obj, String type) {
		ConstructionMerchandiseDTO merchandiseDTO = new ConstructionMerchandiseDTO();
		// xoa dữ liệu
		constructionMerchandiseDAO.removeByListId(obj.getConstructionId());
		for (StockTransGeneralDTO dto : list) {
			if (dto.getGoodsIsSerial().equals("0")) {
				merchandiseDTO.setRemainCount(dto.getRemainQuantity());
				merchandiseDTO.setQuantity(dto.getConsQuantity());
			} else {
				merchandiseDTO.setRemainCount(1D);
				merchandiseDTO.setQuantity(1D);
			}
			saveMer(dto, merchandiseDTO, obj.getConstructionId(), type);
		}
	}

	private void saveMer(StockTransGeneralDTO dto, ConstructionMerchandiseDTO merchandiseDTO, Long id, String type) {
		merchandiseDTO.setType(type);
		merchandiseDTO.setConstructionId(id);
		merchandiseDTO.setGoodsCode(dto.getGoodsCode());
		merchandiseDTO.setGoodsName(dto.getGoodsName());
		merchandiseDTO.setGoodsId(dto.getGoodsId());
		merchandiseDTO.setMerEntityId(dto.getMerEntityId());
		merchandiseDTO.setGoodsIsSerial(dto.getGoodsIsSerial());
		merchandiseDTO.setGoodsUnitName(dto.getGoodsUnitName());
		constructionMerchandiseDAO.saveObject(merchandiseDTO.toModel());
	}

	public void confirmPkx(SynStockTransDTO obj) {
		Date dateNow = new Date();
		constructionDAO.confirmPkx(obj, dateNow);
		constructionDAO.UpdateIsReturn(obj);
	}

	public DataListDTO detaillPhieu(SynStockTransDTO obj) {
		List<SynStockTransDTO> ls = constructionDAO.detaillPhieu(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		return data;
	}

	public List<SignVOfficeDetailDTO> getDataSign(Long synStockId) {
		// TODO Auto-generated method stub
		return constructionDAO.getDataSign(synStockId);
	}

	public String exportConstruction(ConstructionDetailDTO obj, HttpServletRequest request) throws Exception {
		obj.setPage(null);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Danhsachtracuucongtrinh.xlsx"));
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
				udir.getAbsolutePath() + File.separator + "Danhsachtracuucongtrinh.xlsx");
		List provinceListId = PermissionUtils.getListIdInDomainData(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<ConstructionDetailDTO> data = new ArrayList<ConstructionDetailDTO>();
		if (provinceListId != null && !provinceListId.isEmpty())
			data = constructionDAO.doSearchDataConstruction(obj, provinceListId);
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			int i = 2;
			for (ConstructionDetailDTO dto : data) {
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
				cell.setCellValue((dto.getCatContructionTypeName() != null) ? dto.getCatContructionTypeName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue(SetDataString(dto.getStatus()));
				cell.setCellStyle(style);
				// thiếu quantity
			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt
				.encryptFileUploadPath(uploadPathReturn + File.separator + "Danhsachtracuucongtrinh.xlsx");
		return path;
	}

	private String SetDataString(String sa) {
		if ("1".equals(sa)) {
			return "Chờ bàn giao mặt bằng";
		}
		if ("2".equals(sa)) {
			return "Chờ khởi công";
		}
		if ("3".equals(sa)) {
			return "Đang thực hiện";
		}
		if ("4".equals(sa)) {
			return "Đã tạm dừng";
		}
		if ("5".equals(sa)) {
			return "Đã hoàn thành";
		}
		if ("6".equals(sa)) {
			return "Đã Nghiệm thu";
		}
		if ("7".equals(sa)) {
			return "Đã hoàn công";
		}
		if ("8".equals(sa)) {
			return "Đã quyết đoán ";
		}
		if ("0".equals(sa)) {
			return "Đã hủy";
		}
		return null;
	}

	private String SetStatusString(String sa) {
		if ("1".equals(sa)) {
			return "Chưa thực hiện";
		}
		if ("2".equals(sa)) {
			return "Đang thực hiện";
		}
		if ("3".equals(sa)) {
			return "Hoàn thành";
		}
		return null;
	}

	public ExportPxkDTO NoSynStockTransDetaill(CommonDTO dto) {
		ExportPxkDTO data = new ExportPxkDTO();
		data.setTotalMonney(0D);
		List<stockListDTO> stockList = constructionDAO.NoSynStockTransDetaill(dto.getObjectId(), dto.getSynType());
		data.setStockList(stockList);
		double totalMonney = 0;
		if (stockList != null & !stockList.isEmpty()) {
			long count = 1;
			for (stockListDTO stock : stockList) {
				stock.setStt(count++);
				if (stock.getTotal1() != null) {
					totalMonney = stock.getTotal1() + totalMonney;
				}
			}
			data.setTotalMonney(totalMonney);
		}
		return data;
	}

	public String exportExcelHm(WorkItemDetailDTO obj) throws Exception {
		// WorkItemDetailDTO obj = new WorkItemDetailDTO();
		obj.setPage(1L);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Danhsachangmuc.xlsx"));
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
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "Danhsachangmuc.xlsx");
		List<WorkItemDetailDTO> data = workItemDAO.doSearch(obj);
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-17/08/2018-edit-start
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			// HuyPQ-17/08/2018-edit-end
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
				cell.setCellValue((dto.getCatWorkItemType() != null) ? dto.getCatWorkItemType() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.NUMERIC);
				cell.setCellValue((dto.getPrice() != null) ? dto.getPrice() : 0);
				cell.setCellStyle(styleNumber);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getConstructorName() != null) ? dto.getConstructorName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getSupervisorName() != null) ? dto.getSupervisorName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue(SetStatusString(dto.getStatus()));
				cell.setCellStyle(style);

				// thiếu quantity

			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Danhsachangmuc.xlsx");
		return path;
	}

	public ExportPxkDTO YesSynStockTransDetaill(CommonDTO dto) {
		ExportPxkDTO data = new ExportPxkDTO();
		data.setTotalMonney(0D);
		List<stockListDTO> stockList = constructionDAO.YesSynStockTransDetaill(dto.getObjectId(), dto.getSynType());
		data.setStockList(stockList);
		double totalMonney = 0;
		if (stockList != null & !stockList.isEmpty()) {
			long count = 1;
			for (stockListDTO stock : stockList) {
				stock.setStt(count++);
				if (stock.getTotal1() != null) {
					totalMonney = stock.getTotal1() + totalMonney;
				}
			}
			data.setTotalMonney(totalMonney);
		}
		return data;
	}

	public DataListDTO getListCatTask(WorkItemDetailDTO obj) {
		List<WorkItemDetailDTO> ls = constructionDAO.doSearchCatTask(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public DataListDTO doSearchPerformer(SysUserDetailCOMSDTO obj, Long sysGroupId, HttpServletRequest request) {
		List<SysUserDetailCOMSDTO> ls = new ArrayList<SysUserDetailCOMSDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.WORK_PROGRESS, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty())
			ls = constructionDAO.doSearchPerformer(obj, groupIdList);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	public String downloadFileImportTP(String string) throws Exception {
		String folderParam = defaultSubFolderUpload;
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + string));
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
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + string);

		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + string);
		return path;
	}

	public List<ConstructionMerchandiseDTO> importFileThauPhu(String fileInput, String path) throws Exception {
		List<ConstructionMerchandiseDTO> workLst = new ArrayList<ConstructionMerchandiseDTO>();
		File f = new File(fileInput);
		XSSFWorkbook workbook = new XSSFWorkbook(f);
		XSSFSheet sheet = workbook.getSheetAt(0);

		DataFormatter formatter = new DataFormatter();
		DecimalFormat df = new DecimalFormat("#.###");
		DecimalFormat longf = new DecimalFormat("#");
		boolean isExistError = false;
		int count = 0;
		for (Row row : sheet) {
			count++;
			if (count >= 3 && !ValidateUtils.checkIfRowIsEmpty(row)) {
				boolean checkColumn1 = true;
				boolean checkColumn3 = true;
				boolean checkColumn4 = true;
				boolean checkColumn2 = true;
				// chinhpxn20180704_start
				boolean checkLength = true;
				// chinhpxn20180704_end
				// String sysGroupCode = "";
				StringBuilder errorMesg = new StringBuilder();
				ConstructionMerchandiseDTO newObj = new ConstructionMerchandiseDTO();
				for (int i = 0; i < 5; i++) {
					Cell cell = row.getCell(i);
					if (cell != null) {
						// Check format file exel
						if (cell.getColumnIndex() == 1) {
							try {
								if (StringUtils.isStringNullOrEmpty(formatter.formatCellValue(cell))) {
									checkColumn1 = false;
									// chinhpxn20180704_start
								} else if (String.valueOf(row.getCell(1)).length() > 200) {
									checkLength = false;
									checkColumn1 = false;
									// chinhpxn20180704_end
								} else {
									String nameVTTB = String.valueOf(row.getCell(1));
									newObj.setGoodsName(nameVTTB.trim());
								}
							} catch (Exception e) {
								checkColumn1 = false;
							}
							if (!checkColumn1) {
								isExistError = true;
								// chinhpxn20180704_start
								if (!checkLength) {
									errorMesg.append("\nTên VTTB không được vượt quá 2000 ký tự!");
									checkLength = true;
								} else {
									// chinhpxn20180704_end
									errorMesg.append("\nTên VTTB không hợp lệ!");
								}
							}
						} else if (cell.getColumnIndex() == 2) {
							try {
								if (StringUtils.isStringNullOrEmpty(formatter.formatCellValue(cell))) {
									newObj.setSerial("");
								} else {
									String serial = String.valueOf(row.getCell(2));
									if (serial.length() > 500) {
										checkLength = false;
										checkColumn2 = false;
									}
									newObj.setSerial(serial.trim());
								}
							} catch (Exception e) {
								newObj.setSerial("");
							}
							// chinhpxn20180704_start
							if (!checkColumn2) {
								isExistError = true;
								errorMesg.append("\nSerial không được vượt quá 500 ký tự!");
								checkLength = true;
								// chinhpxn20180704_end
							}
						} else if (cell.getColumnIndex() == 3) {
							try {
								if (StringUtils.isStringNullOrEmpty(formatter.formatCellValue(cell))) {
									checkColumn3 = false;
								} else {
									// chinhpxn20180704_start
									if (formatter.formatCellValue(cell).length() > 20) {
										checkLength = false;
										checkColumn3 = false;
									}
									newObj.setQuantity(
											Double.parseDouble(longf.format(cell.getNumericCellValue()).trim()));
								}
							} catch (Exception e) {
								checkColumn3 = false;
							}
							if (!checkColumn3) {
								isExistError = true;
								if (!checkLength) {
									errorMesg.append("\nĐộ dài Số lượng vượt quá 20 số!");
									checkLength = true;
								} else {// chinhpxn20180705_end
									errorMesg.append("\nSố lượng không hợp lệ!");
								}
							}
						} else if (cell.getColumnIndex() == 4) {
							try {
								if (StringUtils.isStringNullOrEmpty(formatter.formatCellValue(cell))) {
									checkColumn4 = false;
								} else {
									String dvt = String.valueOf(row.getCell(4));
									// chinhpxn20180704_start
									if (formatter.formatCellValue(cell).length() > 100) {
										checkLength = false;
										checkColumn4 = false;
									}
									newObj.setGoodsUnitName(dvt.trim());
								}
							} catch (Exception e) {
								checkColumn4 = false;
							}
							if (!checkColumn4) {
								isExistError = true;
								if (!checkLength) {
									errorMesg.append("\nĐộ dài Đơn vị tính vượt quá 100 ký tự!");
									checkLength = true;
								} else {// chinhpxn20180705_end

									errorMesg.append("\nĐơn vị tính không hợp lệ!");
								}
							}
							Cell cell1 = row.createCell(5);
							cell1.setCellValue(errorMesg.toString());
						}
					}
				}

				if (checkColumn1 && checkColumn3 && checkColumn4) {
					workLst.add(newObj);
				}

			}
		}
		if (isExistError) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// sheet.setColumnWidth(7, 5000);
			style.setAlignment(HorizontalAlignment.CENTER);
			Cell cell = sheet.getRow(1).createCell(5);
			cell.setCellValue("Cột lỗi");
			cell.setCellStyle(style);
			ConstructionMerchandiseDTO objErr = new ConstructionMerchandiseDTO();
			OutputStream out = new FileOutputStream(f, true);
			workbook.write(out);
			out.close();
			objErr.setErrorFilePath(UEncrypt.encryptFileUploadPath(path));
			workLst.add(objErr);
		}
		workbook.close();
		return workLst;
	}

	public Long getconstructionStatus(Long id) {
		// TODO Auto-generated method stub
		return constructionDAO.getconstructionStatus(id);
	}

	public Long saveThauPhu(ConstructionDetailDTO obj) {
		List<ConstructionMerchandiseDTO> listTP = obj.getListTP();
		constructionMerchandiseDAO.removeTP(obj.getConstructionId());
		for (ConstructionMerchandiseDTO c : listTP) {
			constructionMerchandiseDAO.saveObject(c.toModel());
		}
		return null;
	}

	public List<Long> getCatProvinCode(Long id) {
		List<Long> dat = constructionMerchandiseDAO.getCatProvinCode(id);
		return dat;
	}

	public Long cancelThauPhu(ConstructionDetailDTO obj) {
		constructionMerchandiseDAO.removeTP(obj.getConstructionId());
		return null;
	}

	public void check(ConstructionDetailDTO obj, HttpServletRequest request) {
		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE, Constant.AdResourceKey.CONSTRUCTION,
				request)) {
			throw new IllegalArgumentException("Bạn không có quyền xóa thông tin công trình");
		}
		long constructionId = constructionDAO.getProvinceIdByConstructionId(obj.getConstructionId());
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.CREATE,
				Constant.AdResourceKey.CONSTRUCTION, constructionId, request)) {
			throw new IllegalArgumentException("Bạn không có quyền xóa thông tin công trình cho trạm/ tuyến này");
		}
	}

	public void checkAdd(ConstructionDetailDTO obj, HttpServletRequest request) {
		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE, Constant.AdResourceKey.CONSTRUCTION,
				request)) {
			throw new IllegalArgumentException("Bạn không có quyền thêm mới thông tin công trình");
		}

	}

	// Hungnx_05062018_start
	public DataListDTO reportConstruction(ConstructionDetailDTO obj) throws IOException {
		List<ConstructionDetailDTO> ls = constructionDAO.reportConstruction(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	private List<String> getStationCodeLst(InputStream inputStream) throws Exception {
		List<String> stationLst = new ArrayList<String>();
		XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
		XSSFSheet sheet = workbook.getSheetAt(0);
		int count = 0;
		DataFormatter formatter = new DataFormatter();
		int countRowBlank = 0;
		for (Row row : sheet) {
			count++;
			if (count < 4)
				continue;
			if (checkIfRowIsEmpty(row)) {
				countRowBlank++;
				if (countRowBlank >= 3)
					break;
				else
					continue;
			}
			if (countRowBlank >= 3)
				break;
			countRowBlank = 0;
			String code = formatter.formatCellValue(row.getCell(0));
			stationLst.add(code.trim());
		}
		workbook.close();
		return stationLst;
	}

	public String exportConstructionReport(ConstructionDetailDTO obj, String userName) throws Exception {
		obj.setPage(null);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		String fileName = "Bao_cao_chi_tiet_cong_trinh.xlsx";
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + fileName));
		XSSFWorkbook workbook = new XSSFWorkbook(file);
		file.close();
		Calendar cal = Calendar.getInstance();
		String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
				+ cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
				+ cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		String uploadPath = folder2Upload + uploadPathReturn;
		File udir = new File(uploadPath);
		if (!udir.exists()) {
			udir.mkdirs();
		}
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + fileName);
		List<ConstructionDetailDTO> data = new ArrayList<ConstructionDetailDTO>();
		data = constructionDAO.reportConstruction(obj);

		XSSFSheet sheet = workbook.getSheetAt(0);
		XSSFRow rowDate = sheet.getRow(4);
		XSSFCell cellDate = rowDate.createCell(0);
		SimpleDateFormat formater = new SimpleDateFormat("yyyy-MMM-dd");
		String curDate = formater.format(new Date());
		XSSFCellStyle styleD = workbook.createCellStyle();
		cellDate.setCellStyle(styleD);
		styleD.setAlignment(HorizontalAlignment.CENTER);
		cellDate.setCellValue("Ngày lập báo cáo: " + curDate);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			// HuyPQ-22/08/2018-start
			XSSFCellStyle styleCenter = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleCenter.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleCenter.setAlignment(HorizontalAlignment.CENTER);
			int i = 7;
			for (ConstructionDetailDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 7));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getCode() != null) ? dto.getCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getName() != null) ? dto.getName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getCatStationHouseCode() != null) ? dto.getCatStationHouseCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue(dto.getCatContructionTypeName());
				cell.setCellStyle(style);
				// HuyPQ-22/08/2018-start
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getStartingDate() != null) ? dto.getStartingDate() : null);
				cell.setCellStyle(styleCenter);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getCompleteDate() != null) ? dto.getCompleteDate() : null);
				cell.setCellStyle(styleCenter);
				// HuyPQ-end
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue(dto.getCntContractCode());
				cell.setCellStyle(style);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue(dto.getSysGroupName());
				cell.setCellStyle(style);
				// HuyPQ-22/08/2018-start
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue(dto.getGroundPlanDate() != null ? dto.getGroundPlanDate() : null);
				cell.setCellStyle(styleCenter);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue(dto.getHandoverDate() != null ? dto.getHandoverDate() : null);
				cell.setCellStyle(styleCenter);
				// HuyPQ-end
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue(SetDataString(dto.getStatus()));
				cell.setCellStyle(style);
			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + fileName);
		return path;
	}

	public String exportPDFConstructionReport(ConstructionDetailDTO criteria) throws Exception {
		criteria.setPage(null);
		criteria.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		String sourceFileName = null;
		List<ConstructionDetailDTO> ls = constructionDAO.reportConstruction(criteria);
		sourceFileName = filePath + "/BaoCaoChiTietCongTrinh.jasper";
		if (!new File(sourceFileName).exists()) {
			return null;
		}
		String fileName = "Bao_cao_chi_tiet_cong_trinh";
		JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(ls);

		String fileNameEncrypt = null;
		try {
			String jasperPrint = JasperFillManager.fillReportToFile(sourceFileName, null, beanColDataSource);
			if (jasperPrint != null) {
				String exportPath = UFile.getFilePath(folder2Upload, defaultSubFolderUpload);

				String destFileName = exportPath + File.separatorChar + fileName + ".pdf";
				JasperExportManager.exportReportToPdfFile(jasperPrint, destFileName);

				fileNameEncrypt = UEncrypt.encryptFileUploadPath(
						exportPath.replace(folder2Upload, "") + File.separatorChar + fileName + ".pdf");
				return fileNameEncrypt;
			}
		} catch (JRException e) {
			e.printStackTrace();
		}
		return null;
	}

	public List<String> readFileStation(Attachment attachments) throws Exception {
		DataHandler dataHandler = attachments.getDataHandler();
		InputStream inputStream = dataHandler.getInputStream();
		return getStationCodeLst(inputStream);
	}

	// Hungnx_05062018_end
	
	@Override
	public DataListDTO getStationForAutoComplete(CatStationDTO obj) {
		List<CatStationDTO> ls = catStationDAO.getForAutoComplete(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}

	@Override
	@Transactional
	public Long updateDayHshc(ConstructionDetailDTO obj) throws Exception {
		try {
			long ids = constructionDAO.updateDayHshc(obj);
			return ids;
		} catch (IllegalArgumentException e) {
			throw new IllegalArgumentException("Có lỗi khi upload ảnh!!!");
		}

	}
	
	//Huypq-20181010-start
	
	private List<String> getConstructionCodeLst(InputStream inputStream) throws Exception {
		List<String> constructionCodeLst = new ArrayList<String>();
		XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
		XSSFSheet sheet = workbook.getSheetAt(0);
		int count = 0;
		DataFormatter formatter = new DataFormatter();
		int countRowBlank = 0;
		for (Row row : sheet) {
			count++;
			if (count < 4)
				continue;
			if (checkIfRowIsEmpty(row)) {
				countRowBlank++;
				if (countRowBlank >= 3)
					break;
				else
					continue;
			}
			if (countRowBlank >= 3)
				break;
			countRowBlank = 0;
			String code = formatter.formatCellValue(row.getCell(0));
			constructionCodeLst.add(code.toUpperCase().trim());
		}
		workbook.close();
		return constructionCodeLst;
	}

	public List<String> readFileConstruction(Attachment attachments) throws Exception {
		
		DataHandler dataHandler = attachments.getDataHandler();
		InputStream inputStream = dataHandler.getInputStream();
		return getConstructionCodeLst(inputStream);
	}

	public Long updateIsBuildingPermit(ConstructionDetailDTO obj) {
		try {
			obj.setIsBuildingPermit("1");
			long ids = constructionDAO.updateIsBuildingPermit(obj);
			return ids;
		} catch (IllegalArgumentException e) {
			throw new IllegalArgumentException("Có lỗi khi cập nhật!");
		}
	}

	public List<ConstructionDetailDTO> importConstructionGPXD(String fileInput) throws Exception {
		List<ConstructionDetailDTO> workLst = Lists.newArrayList();
		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
		 DataFormatter dataformatter = new DataFormatter();
	
		try {
		
			
			File f = new File(fileInput);
			XSSFWorkbook workbook = new XSSFWorkbook(f);
			XSSFSheet sheet = workbook.getSheetAt(0);
			int count = 0;
		
			for (Row row : sheet) {
				count++;

				if (count >= 4 && checkIfRowIsEmpty(row))
					continue;
				ConstructionDetailDTO obj = new ConstructionDetailDTO();
				if (count >= 4) {
					for (Cell cell : row) {

						String checkCell = dataformatter.formatCellValue(cell).toUpperCase().trim();
						obj.setCode(checkCell);
						List<ConstructionDetailDTO> listobj = constructionDAO.getCheckCodeList(obj);
					
						if (listobj.size()== 0) {
							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(0),
									constructionColName.get(3) + " không có trong hệ thống");
							errorList.add(errorDTO);
						}
						
						
					}
				}
//				if (listCheck.size() != listCheck1.size()) {
//					ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(0),
//							constructionColName.get(3) + " không có trong hệ thống");
//					errorList.add(errorDTO);
//				}
			}

			if (errorList.size() > 0) {
				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
				List<ConstructionDetailDTO> emptyArray = Lists.newArrayList();
				workLst = emptyArray;
				ConstructionDetailDTO errorContainer = new ConstructionDetailDTO();
				errorContainer.setErrorList(errorList);
				errorContainer.setMessageColumn(1); // cột dùng để in ra lỗi
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
			List<ConstructionDetailDTO> emptyArray = Lists.newArrayList();
			workLst = emptyArray;
			ConstructionDetailDTO errorContainer = new ConstructionDetailDTO();
			errorContainer.setErrorList(errorList);
			errorContainer.setMessageColumn(1); // cột dùng để in ra lỗi
			errorContainer.setFilePathError(filePathError);
			workLst.add(errorContainer);
			return workLst;
		}
	}
	
//	public Boolean isCodeExist(String code, HashMap<String,String> constructionCodeGPXDMap) {
//		String obj = constructionCodeGPXDMap.get(code);
//		if (obj != null) {
//			return true;
//		} else {
//			return false;
//		}
//	}

	//Huypq-20181010-end
	// tanqn 20181102 start
//	 	public Boolean checkConstructionTask(ConstructionTaskDetailDTO obj) {
//	 		List<ConstructionTaskDetailDTO> list = constructionDAO.checkListConstructionDTO(obj);
//	 		if(list != null && list.size() > 0) {
//	 			return true;
//	 		}
//	 		return false;
//	 	}
	 	
	//hungtd_20180711_start	 	
 	public Long UpdateConstructionTask(ConstructionDTO obj) throws ParseException {
 		try {   
 			if(obj.getListContractionId().size() < 1) {
 				constructionDAO.updateConstructionDto(obj);
 		 		constructionDAO.updateConstructionDto1(obj);
 		 		constructionDAO.updateListConstructionDTO(obj);
 			} else {
 				constructionDAO.updateRPHSHC(obj);
 		 		constructionDAO.updateListConstruction(obj);
 			}
 		
			
 		}catch(Exception ex){
 			ex.printStackTrace();
 			return null;
 		}
 		return 0l;
 	}
//hungtd_20180711_end

		
	 	//end
	//VietNT_20181206_start
	public DataListDTO getStationHouseForAutoComplete(CatStationDTO criteria) {
		List<CatStationDTO> ls = catStationDAO.getCatStationHouseForAutoComplete(criteria);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(criteria.getTotalRecord());
		data.setSize(criteria.getPageSize());
		data.setStart(1);
		return data;
	}
	//VietNT_end

 	/**hoangnh 251218 start**/
 	public String updateHandoverFull(AssignHandoverDTO request) {
		return constructionDAO.updateHandoverFull(request);
	}
 	
 	public String updateBuild(AssignHandoverDTO request) {
		return constructionDAO.updateBuild(request);
	}
 	
 	public String updateRP(AssignHandoverDTO request, String checkRP) {
		return constructionDAO.updateRP(request, checkRP);
	}
 	
 	public String updateCons(AssignHandoverDTO request) {
		return constructionDAO.updateCons(request);
	}
 	
 	public SysUserCOMSDTO getListUser(Long sysUserId){
 		return constructionDAO.getListUser(sysUserId);
 	}
 	
 	public List<CatWorkItemTypeDTO> getWorkItemByType(String type){
 		return constructionDAO.getWorkItemByType(type);
 	}
 	
 	public AssignHandoverResponse doSearchNotReceived(AssignHandoverRequest req){
 		return constructionDAO.doSearchNotReceived(req);
 	}
 	
 	public AssignHandoverResponse doSearchReceived(AssignHandoverRequest req){
 		return constructionDAO.doSearchReceived(req);
 	}
 		public String updateHandoverDate(Long id) {
		return constructionDAO.updateHandoverDate(id);
	}

 	public String updateIsFence(String name, Long id){
 		return constructionDAO.updateIsFence(name, id);
 	}
 	
 	public String updateHaveName(String name, Long id){
 		return constructionDAO.updateHaveName(name, id);
 	}
 	
 	public List<AssignHandoverDTO> doSearchAssign(AssignHandoverRequest req){
 		
 		List<AssignHandoverDTO> list = constructionDAO.doSearchAssign(req);
 		/*for(int i=0; i < list.size(); i++){
 			List<ConstructionImageInfo> doc = constructionDAO.getListDocument(list.get(i));
 			List<ConstructionImageInfo> listImageResponse = getConstructionImages(doc);
 			if(listImageResponse.size() > 0){
 				list.get(i).setConstructionImageInfo(listImageResponse);
 			}
 		}*/
 		return list;
 	}
 	
 	public List<ConstructionImageInfo> doSearchImage(Long assignHandoverId){
 		List<ConstructionImageInfo> doc = constructionDAO.getListDocument(assignHandoverId);
 		List<ConstructionImageInfo> listImageResponse = getConstructionImages(doc);
 		
 		return listImageResponse;
 	}
 	
 	public List<WorkItemDTO> getWorkItemByCode(String code){
 		return constructionDAO.getWorkItemByCode(code);
 	}
 	
 // lay danh sach ten anh va anh dinh dang base64
 	public List<ConstructionImageInfo> getConstructionImages(List<ConstructionImageInfo> lstConstructionImages) {
 		List<ConstructionImageInfo> result = new ArrayList<>();

 		for (ConstructionImageInfo constructionImage : lstConstructionImages) {
 			try {
 				String fullPath = folder2Upload + constructionImage.getImagePath();
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
 	
 	public void saveImageDB(AssignHandoverRequest req){
			// luu anh va tra ve mot list path
		List<ConstructionImageInfo> lstConstructionImages = saveConstructionImages(req.getAssignHandoverDTO().getConstructionImageInfo());

		constructionDAO.saveImagePathsDBDao(lstConstructionImages,req.getAssignHandoverDTO().getAssignHandoverId(),req);
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
 					String imagePath = UFile.writeToFileServer(inputStream, constructionImage.getImageName(),
 							input_image_sub_folder_upload, folder2Upload);
 					obj.setImagePath(imagePath);
 				} catch (Exception e) {
 					continue;
 				}
 				result.add(obj);
 			}
 		}

 		return result;
 	}
 	
 	public List<AppParamDTO> getHouseType(){
 		return constructionDAO.getHouseType();
 	}
 	
 	public List<AppParamDTO> getGroundingType(){
 		return constructionDAO.getGroundingType();
 	}
 	
 	public String updateStatusCons(AssignHandoverDTO request) {
		return constructionDAO.updateStatusCons(request);
	}
 	/**hoangnh 251218 end**/
 	//HuyPQ-start
 	public DataListDTO doSearchAcceptance(ConstructionDetailDTO obj, HttpServletRequest request){
 		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.ACCEPTANCE, request)) {
			throw new IllegalArgumentException("Bạn không có quyền ");
		}
 		List<ConstructionDetailDTO> ls = new ArrayList<ConstructionDetailDTO>();
 		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.ACCEPTANCE, request);
 		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
 		if(groupIdList!=null || !groupIdList.isEmpty()) {
 			ls = constructionDAO.doSearchAcceptance(obj,groupIdList);
 		}
 		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
 	}
 	
 	public ConstructionDetailDTO listDataDSA(ConstructionDetailDTO obj) {
 		ConstructionDetailDTO consDetailDTO = new ConstructionDetailDTO();
 		List<ConstructionDetailDTO> objDataVTA = constructionDAO.getDataVTA(obj);
 		List<ConstructionDetailDTO> objDataTBA = constructionDAO.getDataTBA(obj);
 		for(ConstructionDetailDTO a : objDataTBA) {
 			a.setConstructionId(obj.getConstructionId());
 			List<ConstructionDetailDTO> listDataMer = constructionDAO.getDataMerByGoodsId(a);
 			a.setListDataMerByGoodsId(listDataMer);
 		}
 		List<ConstructionDetailDTO> objDataVTB = constructionDAO.getDataVTB(obj);
 		List<ConstructionDetailDTO> objDataTBB = constructionDAO.getDataTBB(obj);
 		consDetailDTO.setListDataVTA(objDataVTA);
 		consDetailDTO.setListDataTBA(objDataTBA);
 		consDetailDTO.setListDataVTB(objDataVTB);
 		consDetailDTO.setListDataTBB(objDataTBB);
 		return consDetailDTO;
 	}
 	
 	public DataListDTO getWorkItemByMerchandise(ConstructionDetailDTO obj){
 		List<ConstructionDetailDTO> ls = constructionDAO.getWorkItemByMerchandise(obj);
 		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
 	}
 	
 	public DataListDTO getWorkItemByMerchandiseB(ConstructionDetailDTO obj){
 		List<ConstructionDetailDTO> ls = constructionDAO.getWorkItemByMerchandiseB(obj);
 		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
 	}
 	
 	public DataListDTO getDataNotIn(ConstructionDetailDTO obj){
 		List<Long> lstId = new ArrayList<>();
 		if(obj.getListWorkItem()!=null || obj.getListWorkItem().size()!=0) {
 			for(WorkItemDetailDTO objId : obj.getListWorkItem()) {
 				lstId.add(objId.getWorkItemId());
 			}
 		}
 		List<ConstructionDetailDTO> ls = constructionDAO.getDataNotIn(obj,lstId);
 		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
 	}
 	
 	public Long updateWorkItemMerchan(List<ConstructionMerchandiseDTO> obj) {
 		Long id = null;
 		if(null!=obj) {
 			if(obj.size()!=0) {
		 		for(ConstructionMerchandiseDTO objMer : obj) {
		 			objMer.setQuantity(objMer.getMerchandiseQuantity());
//		 			objMer.setSerial(objMer.getSerialMerchan());
		 			objMer.setType("1");
		 			objMer.setGoodsIsSerial("0");
		 			if(objMer.getConstructionMerchandiseId()==null) {
		 	 			id = constructionMerchandiseDAO.saveObject(objMer.toModel());
		 	 		} else {
		 	 			id = constructionMerchandiseDAO.updateObject(objMer.toModel());
		 	 		}
		 		}
 			}
 		}
 		return id;
 	}
 	
 	public Long updateWorkItemMerchanB(List<ConstructionMerchandiseDTO> obj) {
 		Long id = null;
 		if(null!=obj) {
 			if(obj.size()!=0) {
 				for(ConstructionMerchandiseDTO objMer : obj) {
 		 			objMer.setQuantity(objMer.getMerchandiseQuantity());
 		 			objMer.setSerial(objMer.getSerialMerchan());
 		 			objMer.setType("2");
 		 			objMer.setGoodsIsSerial("0");
 		 			if(objMer.getConstructionMerchandiseId()==null) {
 		 	 			id = constructionMerchandiseDAO.saveObject(objMer.toModel());
 		 	 		} else {
 		 	 			id = constructionMerchandiseDAO.updateObject(objMer.toModel());
 		 	 		}
 		 		}
 			}
 			
 		}
 		return id;
 	}
 	
 	public Long updateConstructionAcceptance(ConstructionDetailDTO obj, Long sysUserId) {
 		return constructionDAO.updateConstructionAcceptance(obj, sysUserId);
 	}
 	
 	public Long updateMerchandise(ConstructionMerchandiseDTO obj) {
 		Long id = null;
// 		for(ConstructionMerchandiseDTO objMer : obj) {
// 			for(WorkItemDTO work : objMer.getListDataWorkItem()) {
// 				objMer.setWorkItemId(work.getWorkItemId());
// 				objMer.setQuantity(1D);
 	 			id = constructionMerchandiseDAO.saveObject(obj.toModel());
// 			}
// 		}
 		return id;
 	}
 	
 	public void deleteConstructionMerchanse(ConstructionDetailDTO obj) {
// 		List<Long> lstMerchan = new ArrayList<>();
// 		for(ConstructionDetailDTO objMer : obj) {
// 			lstMerchan.add(objMer.getConstructionMerchandiseId());
// 		}
 		constructionDAO.deleteConstructionMerchanse(obj);
 	}
 	
 	public DataListDTO getWorkItemByConsId(ConstructionDetailDTO obj){
 		List<ConstructionDetailDTO> ls = constructionDAO.getWorkItemByConsId(obj);
 		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
 	}
 	
 	public List<ConstructionDetailDTO> getConstructionAcceptanceByConsId(ConstructionDetailDTO obj){
 		List<ConstructionDetailDTO> listSynStock = constructionDAO.getConstructionAcceptanceByConsId(obj);
 		for(ConstructionDetailDTO objMer : listSynStock) {
 			List<WorkItemDTO> mer = constructionDAO.getLstWorkItemById(objMer.getConstructionMerchandiseId());
 			objMer.setListDataWorkItem(mer);
 		}
 		return listSynStock;
 	}
 	
 	public List<ConstructionDetailDTO> getConstructionAcceptanceByConsIdCheck(ConstructionDetailDTO obj){
 		List<ConstructionDetailDTO> listSynStock = constructionDAO.getConstructionAcceptanceByConsIdCheck(obj);
 		return listSynStock;
 	}
 	
 	public List<ConstructionDetailDTO> getSynStockTransBySerial(ConstructionDetailDTO obj){
 		return constructionDAO.getSynStockTransBySerial(obj);
 	}
 	
 	public List<ConstructionDetailDTO> getConstructionAcceptanceByConsIdTBB(ConstructionDetailDTO obj){
 		List<ConstructionDetailDTO> listSynStock = constructionDAO.getConstructionAcceptanceByConsIdTBB(obj);
 		for(ConstructionDetailDTO objMer : listSynStock) {
 			List<WorkItemDTO> mer = constructionDAO.getLstWorkItemById(objMer.getConstructionMerchandiseId());
 			objMer.setListDataWorkItemTBB(mer);
 		}
 		return listSynStock;
 	}
	
	public List<DepartmentDTO> getSysGroupCheck(DepartmentDTO obj, HttpServletRequest request){
    	String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.APPROVED,
				Constant.AdResourceKey.ACCEPTANCE, request);
 		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
    	return departmentDAO.getSysGroupCheck(obj,groupIdList);
    }
 	//HuyPQ-end
 	
 	/**Hoangnh start 15022019**/
 	public void saveImageConstructionTaskDaily(List<ConstructionImageInfo> req,ConstructionTaskDailyDTO dto, Long id){
		// luu anh va tra ve mot list path
		List<ConstructionImageInfo> lstConstructionImages = saveConstructionTaskDailyImages(req);
	
		constructionDAO.saveImagePathConstructionTaskDaily(lstConstructionImages, dto, id);
	}
 	
 // Luu danh sach anh gui ve va lay ra duong dan
  	public List<ConstructionImageInfo> saveConstructionTaskDailyImages(List<ConstructionImageInfo> lstConstructionImages) {
  		List<ConstructionImageInfo> result = new ArrayList<>();
  		for (ConstructionImageInfo constructionImage : lstConstructionImages) {
  			if (constructionImage.getStatus() == 0) {
  				ConstructionImageInfo obj = new ConstructionImageInfo();
  				obj.setImageName(constructionImage.getImageName());
  				obj.setLatitude(constructionImage.getLatitude());
  				obj.setLongtitude(constructionImage.getLongtitude());
  				InputStream inputStream = ImageUtil.convertBase64ToInputStream(constructionImage.getBase64String());
  				try {
  					String imagePath = UFile.writeToFileServer(inputStream, constructionImage.getImageName(),
  							input_image_sub_folder_upload, folder2Upload);

  					obj.setImagePath(imagePath);
  					LOGGER.warn("imagePath :" + imagePath);
  				} catch (Exception e) {
  					continue;
  				}
  				result.add(obj);
  			}
  		}

  		return result;
  	}
  	
 	public ConstructionTaskDailyDTO checkExits(ConstructionTaskDailyDTO req){
 		ConstructionTaskDailyDTO dto = constructionDAO.checkExits(req);
 		return dto;
 	}
 	public void checkDocs(Long object, String type){
 		List<UtilAttachDocumentDTO> list = constructionDAO.checkDocs(object, type);
 		if(list.size() > 0){
 			for(UtilAttachDocumentDTO dto : list){
 				LOGGER.debug("Xóa ảnh trước khi update");
 				constructionDAO.removeDocs(dto.getUtilAttachDocumentId());
 	 		}
 		}
 	}
 	
 	public List<ConstructionImageInfo> imageConstructionTaskDaily(Long constructionTaskDailyId){
 		List<ConstructionImageInfo> doc = constructionDAO.imageConstructionTaskDaily(constructionTaskDailyId);
 		List<ConstructionImageInfo> listImageResponse = getConstructionImages(doc);
 		
 		return listImageResponse;
 	}
 	/**Hoangnh start 15022019**/
}