package com.viettel.aio.rest;

import com.viettel.aio.business.WorkItemQuotaBusinessImpl;
import com.viettel.aio.dto.WorkItemQuotaDTO;
import com.viettel.cat.constant.Constants;
import com.viettel.coms.business.KpiLogBusinessImpl;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.sql.Timestamp;
import java.util.List;
//import com.viettel.erp.constant.ApplicationConstants;
//import com.viettel.service.base.dto.ActionListDTO;
//import com.viettel.erp.utils.ExportExcel;
//import com.viettel.erp.utils.FilterUtilities;

/**
 * @author hailh10
 */

public class WorkItemQuotaRsServiceImpl implements WorkItemQuotaRsService {

	protected final Logger log = Logger.getLogger(WorkItemQuotaRsService.class);
	@Autowired
	WorkItemQuotaBusinessImpl workItemQuotaBusinessImpl;

	/*@Autowired
	CatConstructionTypeBusinessImpl catConstructionTypeBusinessImpl;

	@Autowired
	CatWorkItemTypeBusinessImpl catWorkItemTypeBusinessImpl;

	@Autowired
	SysGroupBusinessImpl sysGroupBusinessImpl;

	@Autowired
	CatTaskBusinessImpl catTaskBusinessImpl;

	@Autowired
	TaskQuotaBusinessImpl taskQuotaBusinessImpl;*/

	@Autowired
	private KpiLogBusinessImpl kpiLogBusinessImpl;

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

	@Override
	public Response doSearch(WorkItemQuotaDTO obj) {
		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_WORK_ITEM_QUOTA);
		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.WORK_ITEM_QUOTA.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end
		List<WorkItemQuotaDTO> ls = workItemQuotaBusinessImpl.doSearch(obj);
		if (ls == null) {
			kpiLogDTO.setStatus("0");
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			DataListDTO data = new DataListDTO();
			data.setData(ls);
			data.setTotal(obj.getTotalRecord() / 3);
			data.setSize(obj.getPageSize());
			data.setStart(1);
			//huypq-start
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			kpiLogDTO.setTransactionCode(obj.getKeySearch());
			kpiLogDTO.setStatus("1");
			kpiLogBusinessImpl.save(kpiLogDTO);
			//huypq-end
			return Response.ok(data).build();
		}
	}

	/*@Override
	public Response getById(Long id) {
		WorkItemQuotaDTO obj = (WorkItemQuotaDTO) workItemQuotaBusinessImpl.getById(id);
		if (obj == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			return Response.ok(obj).build();
		}
	}


	@Override
	public Response update(WorkItemQuotaDTO obj) {
		Long id = 0l;
		List<Long> ids = new ArrayList<Long>();
		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_WORK_ITEM_QUOTA);
		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.WORK_ITEM_QUOTA.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end
		if(obj.getQuotaType() == 1l) {
			List<Long> workItemQuotaIdLst = obj.getWorkItemQuotaIdLst();
			int i = 0;
			while (i < 3) {
				obj.setWorkItemQuotaId(workItemQuotaIdLst.get(i));
				if(i==0) {
					obj.setPrice(obj.getPrice3());
					obj.setWorkDay(obj.getWorkDay3());
					obj.setType(3l);
				}
				if(i==1) {
					obj.setPrice(obj.getPrice2());
					obj.setWorkDay(obj.getWorkDay2());
					obj.setType(2l);
				}
				if(i==2) {
					obj.setPrice(obj.getPrice1());
					obj.setWorkDay(obj.getWorkDay1());
					obj.setType(1l);
				}

				WorkItemQuotaDTO originObj = (WorkItemQuotaDTO) workItemQuotaBusinessImpl.getOneById(obj.getWorkItemQuotaId());
				if (originObj == null) {
					return Response.status(Response.Status.BAD_REQUEST).build();
				} else {
					obj.setUpdatedUserId(objUser.getSysUserId());
					obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
					obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
					try {
						id = workItemQuotaBusinessImpl.update(obj);
						if(id == 0l) break;
						ids.add(id);
					} catch(Exception e) {
						e.printStackTrace();
						kpiLogDTO.setReason(e.toString());
					}
					kpiLogDTO.setEndTime(new Date());
					kpiLogDTO.setTransactionCode(String.valueOf(obj.getWorkItemQuotaId()));

					if (id == 0l) {
						kpiLogDTO.setStatus("0");
						kpiLogBusinessImpl.save(kpiLogDTO);
						return Response.status(Response.Status.BAD_REQUEST).build();
					} else {
						kpiLogDTO.setStatus("1");
						kpiLogBusinessImpl.save(kpiLogDTO);

					}
				}
				i++;
				return Response.ok(ids).build();
			}
		} else {
			WorkItemQuotaDTO originObj = (WorkItemQuotaDTO) workItemQuotaBusinessImpl.getOneById(obj.getWorkItemQuotaId());

			if (originObj == null) {
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {


				obj.setUpdatedUserId(objUser.getSysUserId());
				obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
				obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));


				try {
					id = workItemQuotaBusinessImpl.update(obj);
				} catch(Exception e) {
					e.printStackTrace();
					kpiLogDTO.setReason(e.toString());
				}
				kpiLogDTO.setEndTime(new Date());
				kpiLogDTO.setTransactionCode(String.valueOf(obj.getWorkItemQuotaId()));

				if (id == 0l) {
					kpiLogDTO.setStatus("0");
					kpiLogBusinessImpl.save(kpiLogDTO);
					return Response.status(Response.Status.BAD_REQUEST).build();
				} else {
					kpiLogDTO.setStatus("1");
					kpiLogBusinessImpl.save(kpiLogDTO);
					return Response.ok(ids).build();
				}
			}
		}

		if (id == 0l) {
			kpiLogDTO.setStatus("0");
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			if(obj.getQuotaType() == 1l) {
				kpiLogDTO.setStatus("1");
				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.ok(ids).build();
			} else {
				kpiLogDTO.setStatus("1");
				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.ok(obj).build();
			}

		}

	}



	@Override
	public Response add(WorkItemQuotaDTO obj) {

		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_WORK_ITEM_QUOTA);
		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.WORK_ITEM_QUOTA.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end
		List<Long> ids = new ArrayList<Long>();
		Long id = 0l;

		WorkItemQuotaDTO existing = null;

		if(obj.getQuotaType() == 1l) {
			List<Double> priceLst = obj.getPriceLst();
			List<Double> workDayLst = obj.getWorkDayLst();
			List<Long> typeLst = obj.getTypeLst();
			int i = 0;
			while (i < 3) {

				if(i==0) {
					obj.setPrice(obj.getPrice1());
					obj.setWorkDay(obj.getWorkDay1());
					obj.setType(1l);
				}
				if(i==1) {
					obj.setPrice(obj.getPrice2());
					obj.setWorkDay(obj.getWorkDay2());
					obj.setType(2l);
				}
				if(i==2) {
					obj.setPrice(obj.getPrice3());
					obj.setWorkDay(obj.getWorkDay3());
					obj.setType(3l);
				}

				existing = (WorkItemQuotaDTO) workItemQuotaBusinessImpl.findByUniqueKey(obj);
				if (existing != null) {
					return Response.status(Response.Status.CONFLICT).build();
				} else {
					obj.setCreatedUserId(objUser.getSysUserId());
					obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
					obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
					obj.setStatus(1l);
					try {
						id = workItemQuotaBusinessImpl.save(obj);
						if (id == 0l) break;
						ids.add(id);
					} catch(Exception e) {
						e.printStackTrace();
						kpiLogDTO.setReason(e.toString());
					}

					kpiLogDTO.setEndTime(new Date());
					kpiLogDTO.setTransactionCode(String.valueOf(obj.getWorkItemQuotaId()));

					if (id == 0l) {
						kpiLogDTO.setStatus("0");
						kpiLogBusinessImpl.save(kpiLogDTO);
						return Response.status(Response.Status.BAD_REQUEST).build();
					} else {
						kpiLogDTO.setStatus("1");
						kpiLogBusinessImpl.save(kpiLogDTO);

					}
				}
				i++;
				return Response.ok(ids).build();
			}

		}

		else {
			existing = (WorkItemQuotaDTO) workItemQuotaBusinessImpl.findByUniqueKeyForMoney(obj);
			if (existing != null) {

				return Response.status(Response.Status.CONFLICT).build();
			} else {
				obj.setCreatedUserId(objUser.getSysUserId());
				obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
				obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
				obj.setStatus(1l);
				try {
					id = workItemQuotaBusinessImpl.save(obj);
				} catch(Exception e) {
					kpiLogDTO.setReason(e.toString());
				}
				kpiLogDTO.setEndTime(new Date());
				kpiLogDTO.setTransactionCode(obj.getSysGroupName());

				if (id == 0l) {
					kpiLogDTO.setStatus("0");
					kpiLogBusinessImpl.save(kpiLogDTO);
					return Response.status(Response.Status.BAD_REQUEST).build();
				} else {
					kpiLogDTO.setStatus("1");
					kpiLogBusinessImpl.save(kpiLogDTO);
					return Response.ok(ids).build();
				}
			}
		}


		if (id == 0l) {
			kpiLogDTO.setStatus("0");
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			kpiLogDTO.setStatus("1");
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.ok(ids).build();
		}

	}

	@Override
	public Response delete(Long id) {

		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_WORK_ITEM_QUOTA);
		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.WORK_ITEM_QUOTA.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end

		WorkItemQuotaDTO obj = (WorkItemQuotaDTO) workItemQuotaBusinessImpl.getOneById(id);

		if (obj == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			//lấy thông tin chưa sysgroupid
			obj.setUpdatedUserId(objUser.getSysUserId());
			//sysgroup id
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
			obj.setStatus(0L);
			obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
			Long idDel = 0l;
			try {
				idDel = workItemQuotaBusinessImpl.update(obj);
			} catch(Exception e) {
				kpiLogDTO.setReason(e.toString());
			}
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			kpiLogDTO.setTransactionCode(String.valueOf(obj.getWorkItemQuotaId()));
			if (idDel == 0l) {
				kpiLogDTO.setStatus("0");
			} else {
				kpiLogDTO.setStatus("1");
			}
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.ok(Response.Status.NO_CONTENT).build();
		}
	}

	@Override
	public Response deleteList(List<Long> ids){
		String result = workItemQuotaBusinessImpl.delete( ids, WorkItemQuotaBO.class.getName() ,"WORK_ITEM_QUOTA_ID");

		if(result ==  ParamUtils.SUCCESS ){
			return Response.ok().build();
		} else {
			return Response.status(Response.Status.EXPECTATION_FAILED).build();
		}
	}



	@Override
	public Response findByAutoComplete(WorkItemQuotaDTO obj) {
		List<WorkItemQuotaDTO> results = workItemQuotaBusinessImpl.getForAutoComplete(obj);
		if (obj.getIsSize()){
			WorkItemQuotaDTO moreObject = new WorkItemQuotaDTO();
			moreObject.setWorkItemQuotaId(0l);;
			results.add(moreObject);
		}
		return Response.ok(results).build();
	}

	@Override
	public Response delete(WorkItemQuotaDTO obj) {
		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_WORK_ITEM_QUOTA);
		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.WORK_ITEM_QUOTA.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end
		Long id = 0l;
		List<WorkItemQuotaDTO> oldList = workItemQuotaBusinessImpl.doSearchForDelete(obj);
		for (WorkItemQuotaDTO workItemQuotaDTO : oldList) {
			if(workItemQuotaDTO !=null)
			{
				workItemQuotaDTO.setUpdatedUserId(objUser.getSysUserId());
				workItemQuotaDTO.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
				workItemQuotaDTO.setUpdatedDate(new Date());
				workItemQuotaDTO.setStatus(0L);
				try {
					id = workItemQuotaBusinessImpl.update(workItemQuotaDTO);
				} catch(Exception e) {
					e.printStackTrace();
					kpiLogDTO.setReason(e.toString());
				}
				kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
				kpiLogDTO.setTransactionCode(String.valueOf(obj.getWorkItemQuotaId()));
				if (id == 0l) {
					kpiLogDTO.setStatus("0");
				} else {
					kpiLogDTO.setStatus("1");
				}
				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.ok(Response.Status.NO_CONTENT).build();
			}
		}

		if(id==0l){
			kpiLogDTO.setStatus("0");
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			kpiLogDTO.setStatus("1");
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.ok().build();
		}
	}



	@Override
	public Response downloadFile(HttpServletRequest request) throws Exception {
		String fileName = UEncrypt.decryptFileUploadPath(request.getQueryString());
		File file = new File(folderTemp + File.separatorChar + fileName);
		InputStream ExcelFileToRead = new FileInputStream(folder2Upload + File.separatorChar + fileName);
		if (!file.exists()) {
			file = new File(folderUpload + File.separatorChar + fileName);
			if (!file.exists()) {
				//				logger.warn("File {} is not found", fileName);
				return Response.status(Response.Status.BAD_REQUEST).build();
			}

		}

		XSSFWorkbook  wb = new XSSFWorkbook (ExcelFileToRead);
		XSSFSheet  sheet=wb.getSheetAt(1);

		CellStyle style = wb.createCellStyle(); //Create new style
		style.setWrapText(true); //Set wordwrap
		style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		style.setBorderTop(HSSFCellStyle.BORDER_THIN);
		style.setBorderRight(HSSFCellStyle.BORDER_THIN);
		style.setBorderLeft(HSSFCellStyle.BORDER_THIN);

		//get data
		SysGroupDTO groupSearch = new SysGroupDTO();
		List<String> levelList = new ArrayList<String>();
		levelList.add("1");
		levelList.add("2");
		groupSearch.setGroupLevelLst(levelList);
		CatConstructionTypeDTO cstSearch = new CatConstructionTypeDTO();

		List<SysGroupDTO> groupLst= sysGroupBusinessImpl.doSearch(groupSearch);
		List<CatConstructionTypeDTO> cstTypeLst = catConstructionTypeBusinessImpl.doSearch(cstSearch);

		//write susGroup data to excel file
		int rowOrder = 1;
		for (SysGroupDTO sysGroupDTO : groupLst) {
			if(sysGroupDTO != null){
				XSSFRow row = sheet.createRow(rowOrder);
				XSSFCell  nameCell = row.createCell(0);
				nameCell.setCellStyle(style);
				nameCell.setCellValue(sysGroupDTO.getName());
				XSSFCell  idCell = row.createCell(1);
				idCell.setCellStyle(style);
				idCell.setCellValue(sysGroupDTO.getCode());
				rowOrder++;
			}
		}
		//		write ConstructionType data to excel file
		rowOrder = 1;
		for (CatConstructionTypeDTO catConstructionTypeDTO : cstTypeLst) {
			if(catConstructionTypeDTO != null){
				XSSFRow row = sheet.getRow(rowOrder);
				if(row == null){
					row = sheet.createRow(rowOrder);
				}
				XSSFCell nameCell = row.createCell(3);
				nameCell.setCellStyle(style);
				nameCell.setCellValue(catConstructionTypeDTO.getName());
				XSSFCell idCell = row.createCell(4);
				idCell.setCellStyle(style);
				idCell.setCellValue(catConstructionTypeDTO.getCode());


				//				write WorkItemType data to excel file
				CatWorkItemTypeDTO wItemTypeSearch =  new CatWorkItemTypeDTO();
				wItemTypeSearch.setCatConstructionTypeId(catConstructionTypeDTO.getCatConstructionTypeId());
				List<CatWorkItemTypeDTO> wItemTypeLst = catWorkItemTypeBusinessImpl.doSearch(wItemTypeSearch);
				for (CatWorkItemTypeDTO catWorkItemTypeDTO : wItemTypeLst) {
					if(catWorkItemTypeDTO != null){
						row = sheet.getRow(rowOrder);
						if(row == null){
							row = sheet.createRow(rowOrder);
						}
						nameCell = row.createCell(3);
						nameCell.setCellStyle(style);
						nameCell.setCellValue(catConstructionTypeDTO.getName());
						idCell = row.createCell(4);
						idCell.setCellStyle(style);
						idCell.setCellValue(catConstructionTypeDTO.getCode());

						XSSFCell CatWorkItemNameCell = row.createCell(5);
						CatWorkItemNameCell.setCellStyle(style);
						CatWorkItemNameCell.setCellValue(catWorkItemTypeDTO.getName());
						XSSFCell CatWorkItemIdCell = row.createCell(6);
						CatWorkItemIdCell.setCellStyle(style);
						CatWorkItemIdCell.setCellValue(catWorkItemTypeDTO.getCode());
						rowOrder++;
					}
				}
			}
			rowOrder++;
		}

		String filePath = UFile.getFilePath(folder2Upload, tempFileFolderUpload);
		FileOutputStream fileOut = new FileOutputStream(folderUpload + File.separatorChar + fileName);
		//write this workbook to an Outputstream.
		wb.write(fileOut);
		fileOut.flush();
		fileOut.close();

		int lastIndex = fileName.lastIndexOf(File.separatorChar);
		String fileNameReturn = fileName.substring(lastIndex + 1);

		return Response.ok((Object) file)
				.header("Content-Disposition", "attachment; filename=\"" + fileNameReturn + "\"").build();
	}

	@Override
	public Response importWorkItemQuota(Attachment attachments,
			HttpServletRequest request) throws Exception {
		KttsUserSession objUser=userRoleBusinessImpl.getUserSession(request);
		//HuyPQ-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.IMPORT_WORK_ITEM_QUOTA);
		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.WORK_ITEM_QUOTA.toString()));
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		//huy-end
		String folderParam = UString.getSafeFileName(request.getParameter("folder"));
		Long quotaType = Long.parseLong(UString.getSafeFileName(request.getParameter("quotaType")));
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
			filePath = UFile.writeToFileTempServerATTT2(inputStream, fileName, folderParam, folderUpload);
			filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
		} catch (Exception ex) {
			throw new BusinessException("Loi khi save file", ex);
		}

		try {

			try {
				List<WorkItemQuotaDTO> result = workItemQuotaBusinessImpl.importWorkItemQuota(folderUpload + filePath, quotaType);
				if(result != null && !result.isEmpty() && (result.get(0).getErrorList()==null || result.get(0).getErrorList().size() == 0)){
//					if(quotaType == 1l) {
						List<Long> typeLst = new ArrayList<Long>();
						typeLst.add(1l);
						typeLst.add(2l);
						typeLst.add(3l);

						HashMap<String, String> workItemQuotaMap = new HashMap<String, String>();
						WorkItemQuotaDTO searchWorkItemQuotaObj = new WorkItemQuotaDTO();
						searchWorkItemQuotaObj.setStatus(1l);
						searchWorkItemQuotaObj.setQuotaType(1l);

						List<WorkItemQuotaDTO> workItemQuotaLst = workItemQuotaBusinessImpl.doSearchForCheckExist(searchWorkItemQuotaObj);
						for (WorkItemQuotaDTO workItemQuotaDTO : workItemQuotaLst) {
							workItemQuotaMap.put(workItemQuotaDTO.getSysGroupId().toString() + "|"
												+ workItemQuotaDTO.getCatConstructionTypeId().toString() + "|"
												+ workItemQuotaDTO.getCatWorkItemTypeId().toString() + "|"
												+ workItemQuotaDTO.getType().toString(),
												workItemQuotaDTO.getWorkItemQuotaId().toString());
						}
						for (WorkItemQuotaDTO obj : result) {
							String existing;
							String checkExist;
							List<Double> priceLst = obj.getPriceLst();
							List<Double> workDayLst = obj.getWorkDayLst();
							int i = 0;
							List<Long> ids = new ArrayList<Long>();
							Long catWorkItemTypeId = obj.getCatWorkItemTypeId();
							Long id = -1l;
							while (i < 3) {
								obj.setType(typeLst.get(i));
								checkExist = obj.getSysGroupId().toString() + "|" + obj.getCatConstructionTypeId().toString() + "|"
										+ obj.getCatWorkItemTypeId().toString() + "|" + obj.getType().toString();
								existing = workItemQuotaMap.get(checkExist);
								if (existing != null) {
									kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
									kpiLogDTO.setTransactionCode(obj.getCatWorkItemTypeId()+"|"+obj.getPrice());
									kpiLogDTO.setStatus("0");
									i++;
									continue;
								} else {
									obj.setPrice(priceLst.get(i));
									obj.setWorkDay(workDayLst.get(i));
									obj.setCreatedUserId(objUser.getSysUserId());
									obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
									obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
									obj.setStatus(1l);
//									obj.setQuotaType(quotaType);
									obj.setQuotaType(1l);
									try {
										id = workItemQuotaBusinessImpl.save(obj);
										workItemQuotaMap.put(checkExist, id.toString());
									} catch(Exception e) {
										e.printStackTrace();
										kpiLogDTO.setReason(e.toString());
									}
									kpiLogDTO.setStatus("1");
									if(i==0) {
										ids.add(id);
										ids.add(id+1);
										ids.add(id+2);
									}
								}
								i++;
							}

							CatTaskDTO catTaskSearch = new CatTaskDTO();
							catTaskSearch.setCatWorkItemTypeId(catWorkItemTypeId);
							catTaskSearch.setStatus("1");
							List<CatTaskDTO> catTaskLst = catTaskBusinessImpl.doSearch(catTaskSearch);
							for (CatTaskDTO catTask : catTaskLst) {
								if(catTask != null) {
									for (int j=0; j<ids.size(); j++) {
										TaskQuotaDTO taskQuota = new TaskQuotaDTO();
										taskQuota.setCode(catTask.getCode());
										taskQuota.setName(catTask.getName());
										taskQuota.setWorkItemQuotaId(ids.get(j));
										taskQuota.setStatus(1l);
										taskQuota.setCreatedDate(new Timestamp(System.currentTimeMillis()));
										taskQuota.setCreatedUserId(objUser.getSysUserId());
										taskQuota.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
										taskQuota.setType(Long.valueOf(j+1));
										taskQuotaBusinessImpl.save(taskQuota);
									}
								}
							}
						}
						kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
						kpiLogDTO.setTransactionCode(null);
						kpiLogBusinessImpl.save(kpiLogDTO);
//					} else {
//						for (WorkItemQuotaDTO obj : result) {
//							if(obj != null){
//								WorkItemQuotaDTO existing;
//								if(quotaType == 1l)
//									existing = (WorkItemQuotaDTO) workItemQuotaBusinessImpl.findByUniqueKey(obj);
//								else existing = (WorkItemQuotaDTO) workItemQuotaBusinessImpl.findByUniqueKeyForMoney(obj);
//								if (existing != null) {
//									continue;
//								}
//								obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
//								obj.setCreatedUserId(objUser.getSysUserId());
//								obj.setQuotaType(quotaType);
//								obj.setStatus(1L);
//								obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//								workItemQuotaBusinessImpl.save(obj);
//								//chinhpxn 12042018
//								//get catTask and save to TaskQuota
//								if(quotaType == 1l) {
//									CatTaskDTO catTaskSearch = new CatTaskDTO();
//									catTaskSearch.setCatWorkItemTypeId(obj.getCatWorkItemTypeId());
//									catTaskSearch.setStatus("1");
//									List<CatTaskDTO> catTaskLst = catTaskBusinessImpl.doSearch(catTaskSearch);
//									for (CatTaskDTO catTask : catTaskLst) {
//										if(catTask != null) {
//											TaskQuotaDTO taskQuota = new TaskQuotaDTO();
//											taskQuota.setCode(catTask.getCode());
//											taskQuota.setName(catTask.getName());
//											taskQuota.setWorkItemQuotaId(workItemQuotaBusinessImpl.findByUniqueKey(obj).getWorkItemQuotaId());
//											taskQuota.setStatus(1l);
//											taskQuota.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//											taskQuota.setCreatedUserId(objUser.getSysUserId());
//											taskQuota.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
//											taskQuotaBusinessImpl.save(taskQuota);
//										}
//									}
//								}
//								//end chinhpxn
//							}
//						}
//					}


					return Response.ok(result).build();
				}else if (result == null || result.isEmpty()) {
					return Response.ok().entity(Response.Status.NO_CONTENT).build(); }
				else{
					return Response.ok(result).build();
				}
			} catch (Exception e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
			}

		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}


	private boolean isFolderAllowFolderSave(String folderDir) {
		return UString.isFolderAllowFolderSave(folderDir, allowFolderDir);

	}

	private boolean isExtendAllowSave(String fileName) {
		return UString.isExtendAllowSave(fileName, allowFileExt);
	}

	@Override
	public Response findByUniqueKeyForEdit(WorkItemQuotaDTO obj) {
		WorkItemQuotaDTO data = workItemQuotaBusinessImpl.findByUniqueKeyForEdit(obj);
		if (data == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			return Response.ok(data).build();
		}

	}
*/

}
