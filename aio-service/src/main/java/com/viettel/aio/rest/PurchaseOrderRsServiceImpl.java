
package com.viettel.aio.rest;

import com.viettel.aio.business.PurchaseOrderBusinessImpl;
import com.viettel.aio.dto.PurchaseOrderDTO;
import com.viettel.coms.business.UtilAttachDocumentBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.List;
//import com.viettel.ims.constant.ApplicationConstants;
//import com.viettel.service.base.dto.ActionListDTO;
//import com.viettel.utils.ExportExcel;
//import com.viettel.utils.FilterUtilities;

/**
 * @author hailh10
 */
 
public class PurchaseOrderRsServiceImpl implements PurchaseOrderRsService {

	protected final Logger log = Logger.getLogger(PurchaseOrderRsService.class);
	@Autowired
	PurchaseOrderBusinessImpl purchaseOrderBusinessImpl;
	
//	@Autowired
//	SysGroupBusinessImpl sysGroupBusinessImpl;
//
//	@Autowired
//	CatPartnerBusinessImpl catPartnerBusinessImpl;
//
//	@Autowired
//	private KpiLogBusinessImpl kpiLogBusinessImpl;
//
//	@Autowired
//	private SysUserBusinessImpl sysUserBusinessImpl;
	
	@Value("${folder_upload}")
	private String folder2Upload;
	
	@Value("${folder_upload2}")
	private String folderUpload;

	@Value("${folder_upload}")
	private String folderTemp;

	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;
	
	@Value("${input_sub_folder_upload}")
	private String inputFileFolderUpload;
	
	@Value("${temp_sub_folder_upload}")
	private String tempFileFolderUpload;

	@Value("${allow.file.ext}")
	private String allowFileExt;
	@Value("${allow.folder.dir}")
	private String allowFolderDir;

	
	@Context HttpServletRequest request;
	@Autowired
	private UserRoleBusinessImpl userRoleBusinessImpl;
	@Autowired
	private UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl;
	
//	@Override
//	public Response doSearch(PurchaseOrderDTO obj) {
//
//		// HuyPq-start
////		KpiLogDTO kpiLogDTO = new KpiLogDTO();
////		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_PURCHASE_ORDER);
////		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.PURCHASE_ORDER.toString()));
////		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
////		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
////		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//		// huy-end
//
//		List<PurchaseOrderDTO> ls = purchaseOrderBusinessImpl.doSearch(obj);
//		if (ls == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			DataListDTO data = new DataListDTO();
//			data.setData(ls);
//			data.setTotal(obj.getTotalRecord());
//			data.setSize(obj.getPageSize());
//			data.setStart(1);
//			//huypq-start
////			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
////			kpiLogDTO.setTransactionCode(obj.getKeySearch());
////			kpiLogDTO.setStatus("1");
////			kpiLogBusinessImpl.save(kpiLogDTO);
//			return Response.ok(data).build();
//			//huy-end
//		}
//	}
	
//	@Override
//	public Response getById(Long id) {
//		PurchaseOrderDTO obj = (PurchaseOrderDTO) purchaseOrderBusinessImpl.getById(id);
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(obj).build();
//		}
//	}
//
//	@Override
//	public Response update(PurchaseOrderDTO obj) {
//
//		// HuyPq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_PURCHASE_ORDER);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.PURCHASE_ORDER.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//		// huy-end
//		PurchaseOrderDTO originObj = (PurchaseOrderDTO) purchaseOrderBusinessImpl.getOneById(obj.getPurchaseOrderId());
//
//		if (originObj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			Long id = 0l;
//			try {
//				obj.setUpdatedUserId(objUser.getSysUserId());
//				obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
//
//				if (!obj.getCode().equalsIgnoreCase(originObj.getCode())) {
//					obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
//					PurchaseOrderDTO check = purchaseOrderBusinessImpl
//							.findByCode(obj.getCode());
//					if (check != null) {
//						return Response.status(Response.Status.CONFLICT).build();
//					} else {
//						id = doUpdate(obj);
//					}
//				} else {
//					id = doUpdate(obj);
//				}
//			} catch(Exception e) {
//				kpiLogDTO.setReason(e.toString());
//			}
//			kpiLogDTO.setTransactionCode(obj.getCode());
//			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//			if (id == 0l) {
//				kpiLogDTO.setStatus("0");
//				kpiLogBusinessImpl.save(kpiLogDTO);
//				return Response.status(Response.Status.BAD_REQUEST).build();
//			} else {
//				kpiLogDTO.setStatus("1");
//				kpiLogBusinessImpl.save(kpiLogDTO);
//				return Response.ok(obj).build();
//			}
//		}
//
//	}
//
//	private Long doUpdate(PurchaseOrderDTO obj) {
//		obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
//
//		UtilAttachDocumentDTO fileSearch = new UtilAttachDocumentDTO();
//		fileSearch.setObjectId(obj.getPurchaseOrderId());
//		fileSearch.setType(Constants.FILETYPE.PURCHASE_ORDER);
//		List <UtilAttachDocumentDTO> fileLst =utilAttachDocumentBusinessImpl.doSearch(fileSearch);
//		if(fileLst != null)
//			for(UtilAttachDocumentDTO file : fileLst){
//				if(file != null){
//					utilAttachDocumentBusinessImpl.delete(file);
//				}
//			}
//
//		if(obj.getFileLst() != null)
//			for(UtilAttachDocumentDTO file : obj.getFileLst()){
//				file.setObjectId(obj.getPurchaseOrderId());
//				file.setType(Constants.FILETYPE.PURCHASE_ORDER);
//				file.setDescription(Constants.FileDescription.get(file.getType()));
//				file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//				file.setCreatedUserId(obj.getUpdatedUserId());
//				file.setStatus("1");
//				utilAttachDocumentBusinessImpl.save(file);
//			}
//		return purchaseOrderBusinessImpl.update(obj);
//	}
//
//	@Override
//	public Response add(PurchaseOrderDTO obj) {
//
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_PURCHASE_ORDER);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.PURCHASE_ORDER.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//
//		PurchaseOrderDTO existing = (PurchaseOrderDTO) purchaseOrderBusinessImpl.findByCode(obj.getCode());
//		Long id = 0l;
//
//		if (existing != null) {
//			return Response.status(Response.Status.CONFLICT).build();
//		} else {
//			try{
//				obj.setCreatedUserId(objUser.getSysUserId());
//				obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
//				obj.setStatus(1L);
//
//				obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//				id = purchaseOrderBusinessImpl.save(obj);
//				for(UtilAttachDocumentDTO file : obj.getFileLst()){
//					file.setObjectId(id);
//					file.setType(Constants.FILETYPE.PURCHASE_ORDER);
//					file.setDescription(Constants.FileDescription.get(file.getType()));
//					file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//					file.setStatus("1");
//					utilAttachDocumentBusinessImpl.save(file);
//				}
////				obj.setPurchaseOrderId(id);
//			}catch(Exception e){
//				kpiLogDTO.setReason(e.toString());
//				e.printStackTrace();
//			}
//			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//			kpiLogDTO.setTransactionCode(obj.getCode());
//			if (id == 0l) {
//				kpiLogDTO.setStatus("0");
//				kpiLogBusinessImpl.save(kpiLogDTO);
//				return Response.status(Response.Status.BAD_REQUEST).build();
//			} else {
//				kpiLogDTO.setStatus("1");
//				kpiLogBusinessImpl.save(kpiLogDTO);
//				return Response.ok(obj).build();
//			}
//		}
//	}
//
//	@Override
//	public Response delete(Long id) {
//
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_PURCHASE_ORDER);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.PURCHASE_ORDER.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//
//		PurchaseOrderDTO obj = (PurchaseOrderDTO) purchaseOrderBusinessImpl.getOneById(id);
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			obj.setUpdatedUserId(objUser.getSysUserId());
//			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
//			obj.setStatus(0L);
//			Long result = 0l;
//			try {
//				result = purchaseOrderBusinessImpl.update(obj);
//			} catch(Exception e) {
//				kpiLogDTO.setReason(e.toString());
//			}
//			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//			kpiLogDTO.setTransactionCode(obj.getCode());
//			if (result == 0l) {
//				kpiLogDTO.setStatus("0");
//			} else {
//				kpiLogDTO.setStatus("1");
//			}
//			kpiLogBusinessImpl.save(kpiLogDTO);
//			return Response.ok(Response.Status.NO_CONTENT).build();
//		}
//	}
//
//	@Override
//	public Response deleteList(List<Long> ids){
//		String result = purchaseOrderBusinessImpl.delete( ids, PurchaseOrderBO.class.getName() ,"PURCHASE_ORDER_ID");
//
//		if(result ==  ParamUtils.SUCCESS ){
//			 return Response.ok().build();
//		} else {
//			 return Response.status(Response.Status.EXPECTATION_FAILED).build();
//		}
//	}

	
	@Override
	public Response getForAutoComplete(PurchaseOrderDTO obj) {
		List<PurchaseOrderDTO> results = purchaseOrderBusinessImpl.getForAutoComplete(obj);
		return Response.ok(results).build();
	}

	
//	@Override
//	public Response downloadFile(HttpServletRequest request) throws Exception {
//		String fileName = UEncrypt.decryptFileUploadPath(request.getQueryString());
//		File file = new File(folderTemp + File.separatorChar + fileName);
//		InputStream ExcelFileToRead = new FileInputStream(folder2Upload + File.separatorChar + fileName);
//		if (!file.exists()) {
//			file = new File(folderUpload + File.separatorChar + fileName);
//			if (!file.exists()) {
////				logger.warn("File {} is not found", fileName);
//				return Response.status(Response.Status.BAD_REQUEST).build();
//			}
//		}
//
//		XSSFWorkbook  wb = new XSSFWorkbook (ExcelFileToRead);
//		XSSFSheet  sheet=wb.getSheetAt(1);
//
//		//get data
//		CatPartnerDTO cstSearch = new CatPartnerDTO();
//		SysGroupDTO groupSearch = new SysGroupDTO();
//		SysUserDTO userSearch = new SysUserDTO();
//
//		CellStyle style = wb.createCellStyle(); //Create new style
//        style.setWrapText(true); //Set wordwrap
//        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
//        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
//        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
//        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
//
//		List<String> levelList = new ArrayList<String>();
//		levelList.add("1");
//		levelList.add("2");
//		groupSearch.setGroupLevelLst(levelList);
//		userSearch.setGroupLevelLst(levelList);
//		List<SysGroupDTO> groupLst= sysGroupBusinessImpl.doSearch(groupSearch);
//		List<CatPartnerDTO> partnerLst = catPartnerBusinessImpl.doSearch(cstSearch);
//		List<SysUserDTO> sysUserLst = sysUserBusinessImpl.doSearch(userSearch);
//		//write susGroup data to excel file
//		int rowOrder = 1;
//		for (SysGroupDTO sysGroupDTO : groupLst) {
//			if(sysGroupDTO != null){
//				XSSFRow row = sheet.createRow(rowOrder);
//				XSSFCell  nameCell = row.createCell(0);
//				nameCell.setCellStyle(style);
//				nameCell.setCellValue(sysGroupDTO.getName());
//				XSSFCell  idCell = row.createCell(1);
//				idCell.setCellStyle(style);
//				idCell.setCellValue(sysGroupDTO.getCode());
//				rowOrder++;
//			}
//		}
////		write ConstructionType data to excel file
//		rowOrder = 1;
//		for (CatPartnerDTO catConstructionTypeDTO : partnerLst) {
//			if(catConstructionTypeDTO != null){
//				XSSFRow row = sheet.getRow(rowOrder);
//				if(row == null){
//					row = sheet.createRow(rowOrder);
//				}
//				XSSFCell nameCell = row.createCell(3);
//				nameCell.setCellStyle(style);
//				nameCell.setCellValue(catConstructionTypeDTO.getName());
//				XSSFCell idCell = row.createCell(4);
//				idCell.setCellStyle(style);
//				idCell.setCellValue(catConstructionTypeDTO.getCode());
//				rowOrder++;
//			}
//		}
//
////		write sysUser data to excel file
//		rowOrder = 1;
//		for (SysUserDTO sysUserDTO : sysUserLst) {
//			if(sysUserDTO != null){
//				XSSFRow row = sheet.getRow(rowOrder);
//				if(row == null){
//					row = sheet.createRow(rowOrder);
//				}
//				XSSFCell  nameCell = row.createCell(6);
//				nameCell.setCellStyle(style);
//				nameCell.setCellValue(sysUserDTO.getFullName());
//				XSSFCell  idCell = row.createCell(7);
//				idCell.setCellStyle(style);
//				idCell.setCellValue(sysUserDTO.getEmployeeCode());
//				rowOrder++;
//			}
//		}
//
//		String filePath = UFile.getFilePath(folder2Upload, tempFileFolderUpload);
//		FileOutputStream fileOut = new FileOutputStream(folderUpload + File.separatorChar + fileName);
//
//		//write this workbook to an Outputstream.
//		wb.write(fileOut);
//		fileOut.flush();
//		fileOut.close();
//
//		int lastIndex = fileName.lastIndexOf(File.separatorChar);
//		String fileNameReturn = fileName.substring(lastIndex + 1);
//
//		return Response.ok((Object) file)
//				.header("Content-Disposition", "attachment; filename=\"" + fileNameReturn + "\"").build();
//	}
//
//	@Override
//	public Response importPurchaseOrder(Attachment attachments,
//			HttpServletRequest request) throws Exception {
//
//		//HuyPQ-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.IMPORT_PURCHASE_ORDER);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.PURCHASE_ORDER.toString()));
//		KttsUserSession objUser=userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//		//huy-end
//
//
//		String folderParam = UString.getSafeFileName(request.getParameter("folder"));
//		String filePathReturn;
//		String filePath;
//
//
//
//		if (UString.isNullOrWhitespace(folderParam)) {
//			folderParam = defaultSubFolderUpload;
//		} else {
//			if (!isFolderAllowFolderSave(folderParam)) {
//
//				throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
//			}
//		}
//
//		DataHandler dataHandler = attachments.getDataHandler();
//
//		// get filename to be uploaded
//		MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
//		String fileName = UFile.getFileName(multivaluedMap);
//
//		if (!isExtendAllowSave(fileName)) {
//
//			throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
//		}
//		// write & upload file to server
//		try (InputStream inputStream = dataHandler.getInputStream();) {
//			filePath = UFile.writeToFileTempServerATTT2(inputStream, fileName, folderParam, folderUpload);
//			filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
//		} catch (Exception ex) {
//
//			throw new BusinessException("Loi khi save file", ex);
//		}
//		try {
//			try {
//				List<PurchaseOrderDTO> result = purchaseOrderBusinessImpl.importPurchaseOrder(folderUpload + filePath);
//				if(result != null && !result.isEmpty() && (result.get(0).getErrorList()==null || result.get(0).getErrorList().size() == 0)){
//						for (PurchaseOrderDTO obj : result) {
//							if(obj != null){
//								PurchaseOrderDTO existing = (PurchaseOrderDTO) purchaseOrderBusinessImpl.findByCode(obj.getCode());
//								if (existing != null) {
//									kpiLogDTO.setStatus("0");
//									continue;
//								}
//								obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
//								obj.setCreatedUserId(objUser.getSysUserId());
//								obj.setStatus(1L);
//								obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//								Long id=0l;
//								try {
//									id=purchaseOrderBusinessImpl.save(obj);
//								} catch(Exception e) {
//									kpiLogDTO.setReason(e.toString());
//								}
//								kpiLogDTO.setStatus("1");
//								}
//						}
//						kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//						kpiLogDTO.setTransactionCode(null);
//						kpiLogBusinessImpl.save(kpiLogDTO);
//						return Response.ok(result).build();
//				}else if (result == null || result.isEmpty()) {
//					kpiLogDTO.setStatus("0");
//					kpiLogBusinessImpl.save(kpiLogDTO);
//					return Response.ok().entity(Response.Status.NO_CONTENT).build(); }
//				else{
//					kpiLogDTO.setStatus("1");
//					kpiLogBusinessImpl.save(kpiLogDTO);
//					return Response.ok(result).build();
//				}
//			} catch (Exception e) {
//				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
//			}
//
//		} catch (IllegalArgumentException e) {
//			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
//		}
//	}
//
//	private boolean isFolderAllowFolderSave(String folderDir) {
//		return UString.isFolderAllowFolderSave(folderDir, allowFolderDir);
//
//	}
//
//	private boolean isExtendAllowSave(String fileName) {
//		return UString.isExtendAllowSave(fileName, allowFileExt);
//	}
//
//	@Override
//	public Response findByCode(List<String> codeLst) {
//		List<PurchaseOrderDTO> updatedPurchaseOrderLst = new ArrayList<PurchaseOrderDTO>();
//		for (String code: codeLst) {
//			PurchaseOrderDTO result = purchaseOrderBusinessImpl.findByCode(code);
//			if(result != null)
//				updatedPurchaseOrderLst.add(result);
//		}
//		if(updatedPurchaseOrderLst != null)
//			return Response.ok(updatedPurchaseOrderLst).build();
//		else {
//			return Response.ok().entity(Response.Status.NO_CONTENT).build();
//		}
//	}

}
