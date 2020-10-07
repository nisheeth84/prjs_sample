package com.viettel.aio.rest;

import com.viettel.aio.business.CntConstrWorkItemTaskBusinessImpl;
import com.viettel.aio.dto.CntAppendixJobDTO;
import com.viettel.aio.dto.CntConstrWorkItemTaskDTO;
import com.viettel.cat.constant.Constants;
import com.viettel.coms.business.ConstructionBusinessImpl;
import com.viettel.coms.business.KpiLogBusinessImpl;
import com.viettel.coms.business.WorkItemBusinessImpl;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import viettel.passport.client.UserToken;

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

public class CntConstrWorkItemTaskRsServiceImpl implements CntConstrWorkItemTaskRsService {

    protected final Logger log = Logger.getLogger(CntConstrWorkItemTaskRsService.class);
    @Autowired
    CntConstrWorkItemTaskBusinessImpl cntConstrWorkItemTaskBusinessImpl;

    @Context
    HttpServletRequest request;

    @Autowired
    private UserRoleBusinessImpl userRoleBusinessImpl;

    @Autowired
    private ConstructionBusinessImpl constructionBusinessImpl;

    @Autowired
    private WorkItemBusinessImpl workItemBusinessImpl;
	
	/*@Autowired
	private CatTaskBusinessImpl catTaskBusinessImpl;
	
	@Autowired
	private CatUnitBusinessImpl catUnitBusinessImpl;
	
	@Autowired
	private CommonBusinessImpl commonBusinessImpl;
	
	@Autowired
	AppParamBusinessImpl appParamBusinessImpl;*/

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

    @Autowired
    private KpiLogBusinessImpl kpiLogBusinessImpl;

    @Override
    public Response doSearch(CntConstrWorkItemTaskDTO obj) {

        // HuyPq-start
//        KpiLogDTO kpiLogDTO = new KpiLogDTO();
//        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_CONSTRUCTION_INFORMATION);
//        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
//        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        List<CntConstrWorkItemTaskDTO> ls = cntConstrWorkItemTaskBusinessImpl.doSearch(obj);
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(obj.getTotalRecord());
            data.setSize(ls.size());
            data.setStart(1);
            //huypq-start
//            kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//            kpiLogDTO.setTransactionCode(obj.getKeySearch());
//            kpiLogDTO.setStatus("1");
//            kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.ok(data).build();
            //huy-end
        }
    }

    //hienvd: Add 8/7/2019
    @Override
    public Response doSearchAppendixJob(CntAppendixJobDTO obj) {
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_CONSTRUCTION_INFORMATION);
        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        List<CntAppendixJobDTO> ls = cntConstrWorkItemTaskBusinessImpl.doSearchAppendixJob(obj);
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(obj.getTotalRecord());
            data.setSize(ls.size());
            data.setStart(1);
            kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
            kpiLogDTO.setTransactionCode(obj.getKeySearch());
            kpiLogDTO.setStatus("1");
            kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.ok(data).build();
        }
    }

    @Override
    public Response getConstructionTask(CntConstrWorkItemTaskDTO criteria) {

        // HuyPq-start
//        KpiLogDTO kpiLogDTO = new KpiLogDTO();
//        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_IMPLEMENTATION_PROGRESS);
//        kpiLogDTO.setDescription(
//                Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.IMPLEMENTATION_PROGRESS.toString()));
//        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        List<CntConstrWorkItemTaskDTO> ls = cntConstrWorkItemTaskBusinessImpl.getConstructionTask(criteria);
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(criteria.getTotalRecord());
            data.setSize(ls.size());
            data.setStart(1);
            //huypq-start
//            kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//            kpiLogDTO.setTransactionCode(criteria.getKeySearch());
//            kpiLogDTO.setStatus("1");
//            kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.ok(data).build();
            // huy-end
        }
    }

    @Override
    public Response getConstructionWorkItem(CntConstrWorkItemTaskDTO criteria) {
        // HuyPq-start
//        KpiLogDTO kpiLogDTO = new KpiLogDTO();
//        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_IMPLEMENTATION_PROGRESS);
//        kpiLogDTO.setDescription(
//                Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.IMPLEMENTATION_PROGRESS.toString()));
//        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        List<CntConstrWorkItemTaskDTO> ls = cntConstrWorkItemTaskBusinessImpl.getConstructionWorkItem(criteria);
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(criteria.getTotalRecord());
            data.setSize(ls.size());
            data.setStart(1);
            //huypq-start
//            kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//            kpiLogDTO.setTransactionCode(criteria.getKeySearch());
//            kpiLogDTO.setStatus("1");
//            kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.ok(data).build();
            //huy-end
        }
    }

    @Override
    public Response addOS(CntConstrWorkItemTaskDTO obj) {
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_CONSTRUCTION_INFORMATION);
        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));

        if (obj.getType() == 0l) {
            CntConstrWorkItemTaskDTO idCheckObj = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.getIdForCntContractOut(obj);
            if (idCheckObj != null) {
                if (idCheckObj.getCntContractId() != null) {
                    if (!idCheckObj.getCntContractId().toString().equalsIgnoreCase(obj.getCntContractId().toString())) {
                        return Response.status(Response.Status.NOT_ACCEPTABLE).build();
                    }
                }
            }
        }

        CntConstrWorkItemTaskDTO existing = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.findByIdentityKey(obj);
        UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");

        if (existing != null) {
            return Response.status(Response.Status.CONFLICT).build();
        } else {
            obj.setCreatedUserId(objUser.getSysUserId());
            obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
            obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
            obj.setStatus(1L);
            Long id = 0l;
            try {
                id = cntConstrWorkItemTaskBusinessImpl.save(obj);
            } catch (Exception e) {
                kpiLogDTO.setReason(e.toString());
            }
            obj.setCntConstrWorkItemTaskId(id);
            kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
            String constructionIds = String.valueOf(obj.getConstructionCode());
            kpiLogDTO.setTransactionCode(constructionIds);
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
    public Response importCntConstructionOS(Attachment attachments, HttpServletRequest request) throws Exception {

        //HuyPQ-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.IMPORT_CONSTRUCTION_INFORMATION);
        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        //huy-end

        String contractId = UString.getSafeFileName(request.getParameter("contractId"));
        String cntContractParentId = UString.getSafeFileName(request.getParameter("cntContractParentId"));
        String contractType = UString.getSafeFileName(request.getParameter("contractType"));
        String folderParam = UString.getSafeFileName(request.getParameter("folder"));
        String filePathReturn;
        String filePath;

        if (UString.isNullOrWhitespace(cntContractParentId)) {
            cntContractParentId = "-1";
        }

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
                //hienvd: END 7/9/2019
                List<CntConstrWorkItemTaskDTO> result = cntConstrWorkItemTaskBusinessImpl.importCntConstructionOS(folderUpload + filePath, Long.parseLong(contractId), Long.parseLong(cntContractParentId), Long.parseLong(contractType));
                if (result != null && !result.isEmpty() && (result.get(0).getErrorList() == null || result.get(0).getErrorList().size() == 0)) {
                    int rowNum = 1;
                    HashMap<String, String> cntConstrWorkItemTaskMap = new HashMap<String, String>();
                    List<CntConstrWorkItemTaskDTO> cntConstrWorkItemTaskLst = cntConstrWorkItemTaskBusinessImpl.doSearch(new CntConstrWorkItemTaskDTO());
                    try {
                        for (CntConstrWorkItemTaskDTO cntConstrWorkItemTask : cntConstrWorkItemTaskLst) {
                            String constructionIdTemp = cntConstrWorkItemTask.getConstructionId().toString();
                            String workItemIdTemp = null;
                            String catTaskIdTemp = null;
                            if (cntConstrWorkItemTask.getWorkItemId() != null)
                                workItemIdTemp = cntConstrWorkItemTask.getWorkItemId().toString();
                            if (cntConstrWorkItemTask.getCatTaskId() != null)
                                catTaskIdTemp = cntConstrWorkItemTask.getCatTaskId().toString();
                            String keyTemp = constructionIdTemp;
                            if (workItemIdTemp != null) keyTemp = keyTemp + "|" + workItemIdTemp;
                            if (catTaskIdTemp != null) keyTemp = keyTemp + "|" + catTaskIdTemp;
                            keyTemp = keyTemp + "|" + cntConstrWorkItemTask.getCntContractId().toString();
                            cntConstrWorkItemTaskMap.put(keyTemp, cntConstrWorkItemTask.getCntConstrWorkItemTaskId().toString());
                        }
                    } catch (Exception e) {
                        throw new IllegalArgumentException(e.toString());
                    }

                    for (CntConstrWorkItemTaskDTO obj : result) {
                        if (obj != null) {


//								CntConstrWorkItemTaskDTO existing = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.findByIdentityKey(obj);
                            String constructionTemp = obj.getConstructionId().toString();
                            String keyTemp = constructionTemp;
                            String workItemIdTemp = null;
                            if (obj.getWorkItemId() != null) {
                                workItemIdTemp = obj.getWorkItemId().toString();
                                keyTemp = keyTemp + "|" + workItemIdTemp;
                            }
                            String catTaskIdTemp = null;
                            if (obj.getCatTaskId() != null) {
                                catTaskIdTemp = obj.getCatTaskId().toString();
                                keyTemp = keyTemp + "|" + catTaskIdTemp;
                            }

                            String isExist = cntConstrWorkItemTaskMap.get(keyTemp + "|" + contractId.toString());
                            if (isExist != null) {
//									return Response.status(Response.Status.CONFLICT).build();
                                kpiLogDTO.setStatus("0");
                                continue;
                            }
                            obj.setCreatedUserId(objUser.getSysUserId());
                            obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
                            obj.setStatus(1L);
                            obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
                            obj.setCntContractId(Long.parseLong(contractId));


                            Long id = 0l;
                            try {
                                id = cntConstrWorkItemTaskBusinessImpl.save(obj);
                            } catch (Exception e) {
                                kpiLogDTO.setReason(e.toString());
                            }
                            kpiLogDTO.setStatus("1");

                            cntConstrWorkItemTaskMap.put(isExist, id.toString());
                            rowNum++;
                        }
                    }
                    kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
                    kpiLogDTO.setTransactionCode(null);
                    kpiLogBusinessImpl.save(kpiLogDTO);
                    return Response.ok(result).build();
                } else if (result == null || result.isEmpty()) {
                    kpiLogDTO.setStatus("0");
                    kpiLogBusinessImpl.save(kpiLogDTO);
                    return Response.ok().entity(Response.Status.NO_CONTENT).build();
                } else {
                    kpiLogDTO.setStatus("1");
//					kpiLogBusinessImpl.save(kpiLogDTO);
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
    public Response getConstructionByContractId(
            CntConstrWorkItemTaskDTO criteria) throws Exception {
        List<CntConstrWorkItemTaskDTO> ls = cntConstrWorkItemTaskBusinessImpl.getConstructionByContractId(criteria);
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(criteria.getTotalRecord());
            data.setSize(ls.size());
            data.setStart(1);
            return Response.ok(data).build();
        }
    }

    @Override
    public Response exportExcelTemplate(String fileName) throws Exception {
        String strReturn = cntConstrWorkItemTaskBusinessImpl.exportExcelTemplate(fileName);
        return Response.ok(Collections.singletonMap("fileName", strReturn))
                .build();
    }



    @Override
    public Response downloadFile(HttpServletRequest request) throws Exception {
        String fileName = UEncrypt.decryptFileUploadPath(request.getQueryString());
        File file = new File(folderTemp + File.separatorChar + fileName);
        InputStream ExcelFileToRead = new FileInputStream(folder2Upload + File.separatorChar + fileName);
        if (!file.exists()) {
            file = new File(folderUpload + File.separatorChar + fileName);
            if (!file.exists()) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }

        }
        int lastIndex = fileName.lastIndexOf(File.separatorChar);
        String fileNameReturn = fileName.substring(lastIndex + 1);

        return Response.ok((Object) file)
                .header("Content-Disposition", "attachment; filename=\"" + fileNameReturn + "\"").build();
    }
    @Override
    public Response delete(CntConstrWorkItemTaskDTO cnt) {
        // HuyPq-start
//        KpiLogDTO kpiLogDTO = new KpiLogDTO();
//        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_CONSTRUCTION_INFORMATION);
//        kpiLogDTO.setDescription(
//                Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        CntConstrWorkItemTaskDTO obj = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.getOneById(cnt.getCntConstrWorkItemTaskId());
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            //lấy thông tin chưa sysgroupid
            UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");
            obj.setUpdatedUserId(objUser.getSysUserId());
            obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());

            obj.setStatus(0l);
            obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
            Long result = 0l;
            try {
                result = cntConstrWorkItemTaskBusinessImpl.update(obj);
            } catch(Exception e) {
//                kpiLogDTO.setReason(e.toString());
            }
//            kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
            String constrWorkItemTaskId = String.valueOf(obj.getCntConstrWorkItemTaskId());
//            kpiLogDTO.setTransactionCode(constrWorkItemTaskId);
//            if (result == 0l) {
//                kpiLogDTO.setStatus("0");
//            } else {
//                kpiLogDTO.setStatus("1");
//            }
//            kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }


}

	
	/*@Override
	public Response doSearchForTab(CntConstrWorkItemTaskDTO obj) {
		List<CntConstrWorkItemTaskDTO> ls = cntConstrWorkItemTaskBusinessImpl.doSearchForTab(obj);
		if (ls == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			DataListDTO data = new DataListDTO();
			data.setData(ls);
			data.setTotal(obj.getTotalRecord());
			data.setSize(ls.size());
			data.setStart(1);
			return Response.ok(data).build();
		}
	}
	
	@Override
	public Response getById(Long id) {
		CntConstrWorkItemTaskDTO obj = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.getById(id);
		if (obj == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			return Response.ok(obj).build();
		}
	}

	@Override
	public Response update(CntConstrWorkItemTaskDTO obj) {
		
		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_CONSTRUCTION_INFORMATION);
		kpiLogDTO.setDescription(
				Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end
		
		if(obj.getType() == 0l) {
			CntConstrWorkItemTaskDTO idCheckObj = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.getIdForCntContractOut(obj);
			if(idCheckObj != null) {
				if(idCheckObj.getCntContractId() != null) {
					if(!idCheckObj.getCntContractId().toString().equalsIgnoreCase(obj.getCntContractId().toString())) {
						return Response.status(Response.Status.NOT_ACCEPTABLE).build();
					}
				}
			}
		}
		
		CntConstrWorkItemTaskDTO originObj = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.getOneById(obj.getCntConstrWorkItemTaskId());
		
		if (originObj == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			//lấy thông tin chưa sysgroupid
			UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");
			obj.setUpdatedUserId(objUser.getSysUserId());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
			boolean check1 = !String.valueOf(obj.getConstructionId()).equalsIgnoreCase(String.valueOf(originObj.getConstructionId()));
			boolean check2 = !String.valueOf(obj.getCatTaskId()).equalsIgnoreCase(String.valueOf(originObj.getCatTaskId()) );
			boolean check3 = !String.valueOf(obj.getWorkItemId()).equalsIgnoreCase(String.valueOf(originObj.getWorkItemId()));
			// if one check is false -> add
			Long id=0l;
			
			try {
			if (check1 || check2 ||
					check3 ) {
				CntConstrWorkItemTaskDTO check = cntConstrWorkItemTaskBusinessImpl.findByIdentityKey(obj);
				if (check != null) {
					return Response.status(Response.Status.CONFLICT).build();
				} else {
					id =  doUpdate(obj);
				}
			} else {
				id = doUpdate(obj);
			}
			} catch(Exception e) {
				kpiLogDTO.setReason(e.toString());
			}
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			kpiLogDTO.setTransactionCode(obj.getConstructionCode());
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
	// HuyPq-start
	private Long doUpdate(CntConstrWorkItemTaskDTO obj) {
		obj.setUpdatedDate(new Timestamp(System.currentTimeMillis())); 
		
		return cntConstrWorkItemTaskBusinessImpl.update(obj);
	}
	//huy-end
	@Override
	public Response add(CntConstrWorkItemTaskDTO obj) {

		// HuyPq-start
				KpiLogDTO kpiLogDTO = new KpiLogDTO();
				kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_CONSTRUCTION_INFORMATION);
				kpiLogDTO.setDescription(
						Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
				KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
				kpiLogDTO.setCreateUserId(objUser.getSysUserId());
				kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
				// huy-end
		
		if(obj.getType() == 0l) {
			CntConstrWorkItemTaskDTO idCheckObj = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.getIdForCntContractOut(obj);
			if(idCheckObj != null) {
				if(idCheckObj.getCntContractId() != null) {
					if(!idCheckObj.getCntContractId().toString().equalsIgnoreCase(obj.getCntContractId().toString())) {
						return Response.status(Response.Status.NOT_ACCEPTABLE).build();
					}
				}
			}
		}
	
		CntConstrWorkItemTaskDTO existing = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.findByIdentityKey(obj);
		UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");

		if (existing != null) {
			return Response.status(Response.Status.CONFLICT).build();
		} else {
			obj.setCreatedUserId(objUser.getSysUserId());
			obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
			obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
			obj.setStatus(1L);
			Long id=0l;
			try {
				id = cntConstrWorkItemTaskBusinessImpl.save(obj);
			} catch(Exception e) {
				kpiLogDTO.setReason(e.toString());
			}
			obj.setCntConstrWorkItemTaskId(id);
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			String constructionIds=String.valueOf(obj.getConstructionCode());
			kpiLogDTO.setTransactionCode(constructionIds);
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
	public Response delete(CntConstrWorkItemTaskDTO cnt) {
		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_CONSTRUCTION_INFORMATION);
		kpiLogDTO.setDescription(
				Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end
		
		CntConstrWorkItemTaskDTO obj = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.getOneById(cnt.getCntConstrWorkItemTaskId());
		if (obj == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			//lấy thông tin chưa sysgroupid
			UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");
			obj.setUpdatedUserId(objUser.getSysUserId());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
			
			obj.setStatus(0l);
			obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
			Long result = 0l;
			try {
				result = cntConstrWorkItemTaskBusinessImpl.update(obj);
			} catch(Exception e) {
				kpiLogDTO.setReason(e.toString());
			}
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			String constrWorkItemTaskId = String.valueOf(obj.getCntConstrWorkItemTaskId());
			kpiLogDTO.setTransactionCode(constrWorkItemTaskId);
			if (result == 0l) {
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
		String result = cntConstrWorkItemTaskBusinessImpl.delete( ids, CntConstrWorkItemTaskBO.class.getName() ,"CNT_CONSTR_WORK_ITEM_TASK_ID");
		
		if(result ==  ParamUtils.SUCCESS ){
			 return Response.ok().build();
		} else {
			 return Response.status(Response.Status.EXPECTATION_FAILED).build();
		}
	}

	@Override
	public Response findByAutoComplete(CntConstrWorkItemTaskDTO obj) {
		List<CntConstrWorkItemTaskDTO> results = cntConstrWorkItemTaskBusinessImpl.getForAutoComplete(obj);
		if (obj.getIsSize()){
			CntConstrWorkItemTaskDTO moreObject = new CntConstrWorkItemTaskDTO();
			moreObject.setCntConstrWorkItemTaskId(0l);;
			
			results.add(moreObject);
		}
		return Response.ok(results).build();
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

		}*/

//		XSSFWorkbook  wb = new XSSFWorkbook (ExcelFileToRead);
//		XSSFSheet  sheet=wb.getSheetAt(1);
//		
//		//get data
//		AppParamDTO appParamSearch = new AppParamDTO();
//		appParamSearch.setParType("MONEY_TYPE");
//		List<AppParamDTO> moneyTypeLst = appParamBusinessImpl.doSearch(appParamSearch);
//		
//		
//		//write construction data to excel file
//		ConstructionDTO constrSearch = new ConstructionDTO();
//		List<ConstructionDTO> constrLst= constructionBusinessImpl.doSearch(constrSearch);
//		
//		WorkItemDTO wkSearch =  new WorkItemDTO();
//		List<WorkItemDTO> workItemLst = workItemBusinessImpl.doSearch(wkSearch);
//		
//		CatTaskDTO taskSearch = new CatTaskDTO();
//		List<CatTaskDTO> taskLst = catTaskBusinessImpl.doSearch(taskSearch);
////		sheet.setColumnWidth(0, 18000);
//		
//		CellStyle style = wb.createCellStyle(); //Create new style
//        style.setWrapText(true); //Set wordwrap
//        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
//        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
//        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
//        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
//
//		
//		int rowOrder = 1;
//		for (ConstructionDTO constructionDTO : constrLst) {
//			if(constructionDTO != null){
//				XSSFRow row = sheet.createRow(rowOrder);
//				row.setHeight((short)300);
//				XSSFCell  nameCell = row.createCell(0);
//				nameCell.setCellStyle(style);
//				nameCell.setCellValue(constructionDTO.getName());
//				XSSFCell  idCell = row.createCell(1);
//				idCell.setCellStyle(style);
//				idCell.setCellValue(constructionDTO.getCode());
//				
//				
////				write work item data to excel file
////				WorkItemDTO wkSearch =  new WorkItemDTO();
////				wkSearch.setConstructionId(constructionDTO.getConstructionId());
////				List<WorkItemDTO> workItemLst = workItemBusinessImpl.doSearch(wkSearch);
////				if(workItemLst.size()>0)
//				int workItemCount = 0;
//				for (WorkItemDTO workItemDTO : workItemLst) {
//					if(workItemDTO.getConstructionId() != null)
//					if(workItemDTO.getConstructionId().toString().equals(constructionDTO.getConstructionId().toString()))
//					workItemCount++;
//				}
//				int workItemCount2 = 0;
//				for (WorkItemDTO workItemDTO : workItemLst) {
//					if(workItemDTO.getConstructionId() != null)
//					if(workItemDTO.getConstructionId().toString().equals(constructionDTO.getConstructionId().toString())){
//						workItemCount2++;
//						row = sheet.createRow(rowOrder);
//						row.setHeight((short)300);
//						nameCell = row.createCell(0);
//						nameCell.setCellStyle(style);
//						nameCell.setCellValue(constructionDTO.getName());
//						idCell = row.createCell(1);
//						idCell.setCellStyle(style);
//						idCell.setCellValue(constructionDTO.getCode());
//						XSSFCell workItemNameCell = row.createCell(2);
//						workItemNameCell.setCellStyle(style);
//						workItemNameCell.setCellValue(workItemDTO.getName());
//						XSSFCell workItemIdCell = row.createCell(3);
//						workItemIdCell.setCellStyle(style);
//						workItemIdCell.setCellValue(workItemDTO.getCode());
////						write task data to excel file
////						CatTaskDTO taskSearch = new CatTaskDTO();
////						taskSearch.setCatWorkItemTypeId(workItemDTO.getCatWorkItemTypeId());
////						List<CatTaskDTO> taskLst = catTaskBusinessImpl.doSearch(taskSearch);
////						if(taskLst.size()>0)
//						int catTaskCount = 0;
//						for (CatTaskDTO catTaskDTO : taskLst) {
//							if(catTaskDTO.getCatWorkItemTypeId() != null)
//							if(catTaskDTO.getCatWorkItemTypeId().toString().equals(workItemDTO.getCatWorkItemTypeId().toString()))
//							catTaskCount++;
//						}
//						int catTaskCount2 = 0;
//						for (CatTaskDTO catTaskDTO : taskLst) {
//							if(catTaskDTO.getCatWorkItemTypeId() != null)
//							if(catTaskDTO.getCatWorkItemTypeId().toString().equals(workItemDTO.getCatWorkItemTypeId().toString())){
//								catTaskCount2++;
//								row = sheet.createRow(rowOrder);
//								row.setHeight((short)300);
//								nameCell = row.createCell(0);
//								nameCell.setCellStyle(style);
//								nameCell.setCellValue(constructionDTO.getName());
//								idCell = row.createCell(1);
//								idCell.setCellStyle(style);
//								idCell.setCellValue(constructionDTO.getCode());
//								workItemNameCell = row.createCell(2);
//								workItemNameCell.setCellStyle(style);
//								workItemNameCell.setCellValue(workItemDTO.getName());
//								workItemIdCell = row.createCell(3);
//								workItemIdCell.setCellStyle(style);
//								workItemIdCell.setCellValue(workItemDTO.getCode());
//								XSSFCell catTaskNameCell = row.createCell(4);
//								catTaskNameCell.setCellStyle(style);
//								catTaskNameCell.setCellValue(catTaskDTO.getName());
//								XSSFCell catTaskIdCell = row.createCell(5);
//								catTaskIdCell.setCellStyle(style);
//								catTaskIdCell.setCellValue(catTaskDTO.getCode());
//								if(catTaskCount2 != catTaskCount) rowOrder++;
//							}
//							
//						}
//						if(workItemCount2 != workItemCount) rowOrder++;
//					}
//					
//				}
//			}
//			rowOrder++;
//		}
//
//
//		
////		write task data to excel file
//		rowOrder = 1;
//		for (AppParamDTO moneyType : moneyTypeLst) {
//			if(moneyType != null){
//				XSSFRow row = sheet.getRow(rowOrder);
//				if(row == null){
//					row = sheet.createRow(rowOrder);
//				}
//				XSSFCell nameCell = row.createCell(9);
//				nameCell.setCellValue(moneyType.getName());
//				nameCell.setCellStyle(style);
//				XSSFCell idCell = row.createCell(10);
//				idCell.setCellStyle(style);
//				idCell.setCellValue(moneyType.getCode());
//				rowOrder++;
//			}
//		}
//		FileOutputStream fileOut = new FileOutputStream(folder2Upload + File.separatorChar + fileName);
//
//		//write this workbook to an Outputstream.
//		wb.write(fileOut);
//		fileOut.flush();
//		fileOut.close();

//		int lastIndex = fileName.lastIndexOf(File.separatorChar);
//		String fileNameReturn = fileName.substring(lastIndex + 1);
//
//		return Response.ok((Object) file)
//				.header("Content-Disposition", "attachment; filename=\"" + fileNameReturn + "\"").build();


    /*@Override
    public Response importCntConstruction(Attachment attachments,
            HttpServletRequest request) throws Exception {

        //HuyPQ-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.IMPORT_CONSTRUCTION_INFORMATION);
        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
        KttsUserSession objUser=userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        //huy-end

        String contractId = UString.getSafeFileName(request.getParameter("contractId"));
        String cntContractParentId = UString.getSafeFileName(request.getParameter("cntContractParentId"));
        String contractType = UString.getSafeFileName(request.getParameter("contractType"));
        String folderParam = UString.getSafeFileName(request.getParameter("folder"));
//		String typeHTCT = UString.getSafeFileName(request.getParameter("typeHTCT"));
        String filePathReturn;
        String filePath;

        if (UString.isNullOrWhitespace(cntContractParentId)) {
            cntContractParentId = "-1";
        }

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
                List<CntConstrWorkItemTaskDTO> result = cntConstrWorkItemTaskBusinessImpl.importCntConstruction(folderUpload + filePath,Long.parseLong(contractId),
                        Long.parseLong(cntContractParentId), Long.parseLong(contractType));
                if(result != null && !result.isEmpty() && (result.get(0).getErrorList()==null || result.get(0).getErrorList().size() == 0)){
                        int rowNum = 1;

                        HashMap<String, String> cntConstrWorkItemTaskMap = new HashMap<String, String>();
                        List<CntConstrWorkItemTaskDTO> cntConstrWorkItemTaskLst = cntConstrWorkItemTaskBusinessImpl.doSearch(new CntConstrWorkItemTaskDTO());
                        try {
                            for (CntConstrWorkItemTaskDTO cntConstrWorkItemTask : cntConstrWorkItemTaskLst) {
                                String constructionIdTemp = cntConstrWorkItemTask.getConstructionId().toString();
                                String workItemIdTemp = null;
                                String catTaskIdTemp = null;
                                if(cntConstrWorkItemTask.getWorkItemId() != null)
                                    workItemIdTemp = cntConstrWorkItemTask.getWorkItemId().toString();
                                if(cntConstrWorkItemTask.getCatTaskId() != null)
                                    catTaskIdTemp = cntConstrWorkItemTask.getCatTaskId().toString();
                                String keyTemp = constructionIdTemp;
                                if(workItemIdTemp != null) keyTemp = keyTemp + "|" + workItemIdTemp;
                                if(catTaskIdTemp != null) keyTemp = keyTemp + "|" + catTaskIdTemp;
                                keyTemp = keyTemp + "|" + cntConstrWorkItemTask.getCntContractId().toString();
                                cntConstrWorkItemTaskMap.put(keyTemp, cntConstrWorkItemTask.getCntConstrWorkItemTaskId().toString());
                            }
                        } catch(Exception e) {
                            throw new IllegalArgumentException(e.toString());
                        }

                        for (CntConstrWorkItemTaskDTO obj : result) {
                            if(obj != null){


//								CntConstrWorkItemTaskDTO existing = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.findByIdentityKey(obj);
                                String constructionTemp = obj.getConstructionId().toString();
                                String keyTemp = constructionTemp;
                                String workItemIdTemp = null;
                                if(obj.getWorkItemId() != null) {
                                    workItemIdTemp = obj.getWorkItemId().toString();
                                    keyTemp = keyTemp + "|" + workItemIdTemp;
                                }
                                String catTaskIdTemp = null;
                                if(obj.getCatTaskId() != null) {
                                    catTaskIdTemp = obj.getCatTaskId().toString();
                                    keyTemp = keyTemp + "|" + catTaskIdTemp;
                                }

                                String isExist = cntConstrWorkItemTaskMap.get(keyTemp +"|"+contractId.toString());
                                if (isExist != null) {
//									return Response.status(Response.Status.CONFLICT).build();
                                    kpiLogDTO.setStatus("0");
                                    continue;
                                }
                                obj.setCreatedUserId(objUser.getSysUserId());
                                obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
                                obj.setStatus(1L);
                                obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
                                obj.setCntContractId(Long.parseLong(contractId));



                                Long id = 0l;
                                try {
                                    id=cntConstrWorkItemTaskBusinessImpl.save(obj);
                                } catch(Exception e) {
                                    kpiLogDTO.setReason(e.toString());
                                }
                                kpiLogDTO.setStatus("1");

                                cntConstrWorkItemTaskMap.put(isExist, id.toString());
                                rowNum++;
                            }
                        }
                        kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
                        kpiLogDTO.setTransactionCode(null);
                        kpiLogBusinessImpl.save(kpiLogDTO);
                    return Response.ok(result).build();
                }else if (result == null || result.isEmpty()) {
                    kpiLogDTO.setStatus("0");
                    kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
                    kpiLogDTO.setTransactionCode(null);
                    kpiLogBusinessImpl.save(kpiLogDTO);
                    return Response.ok().entity(Response.Status.NO_CONTENT).build(); }
                else{
                    kpiLogDTO.setStatus("1");
//					kpiLogBusinessImpl.save(kpiLogDTO);
                    return Response.ok(result).build();
                }
            } catch (Exception e) {
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }

        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }
    */


    /*
    public Response getTaskProgress(CntConstrWorkItemTaskDTO criteria){
        List<CntConstrWorkItemTaskDTO> ls = cntConstrWorkItemTaskBusinessImpl.getTaskProgress(criteria);
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(criteria.getTotalRecord());
            data.setSize(ls.size());
            data.setStart(1);
            return Response.ok(data).build();
        }
    }

    @Override
    public Response doSearchContractProgress(CntContractDTO criteria){

        // HuyPq-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_RP_CONTRACT_PROGRESS);
        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.RP_CONTRACT_PROGRESS.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        List<CntConstrWorkItemTaskDTO> ls = cntConstrWorkItemTaskBusinessImpl.doSearchContractProgress(criteria);
        if (ls == null) {
            kpiLogDTO.setStatus("0");
            kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(criteria.getTotalRecord());
            data.setSize(ls.size());
            data.setStart(1);
            //huypq-start
            kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
            kpiLogDTO.setTransactionCode(criteria.getKeySearch());
            kpiLogDTO.setStatus("1");
            kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.ok(data).build();
            //huy-end
        }
    }

    @Override
    public Response doSearchContractProgressDetail(CntContractDTO criteria){
        List<CntConstrWorkItemTaskDTO> ls = cntConstrWorkItemTaskBusinessImpl.doSearchContractProgressDetail(criteria);
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(criteria.getTotalRecord());
            data.setSize(ls.size());
            data.setStart(1);
            return Response.ok(data).build();
        }
    }

    @Override
    public Response exportContractProgress(CntContractDTO criteria) throws Exception {

        //HuyPQ-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.EXPORT_RP_CONTRACT_PROGRESS);
        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.RP_CONTRACT_PROGRESS.toString()));
        KttsUserSession objUser=userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        //huy-end

        criteria.setPage(null);
        criteria.setPageSize(null);
        List<CntConstrWorkItemTaskDTO> ls = cntConstrWorkItemTaskBusinessImpl.doSearchContractProgress(criteria);
        if (ls == null) {
            kpiLogDTO.setStatus("0");
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            List<CntConstrWorkItemTaskDTO> lsDetail = cntConstrWorkItemTaskBusinessImpl.doSearchContractProgressDetail(criteria);
            String fileNameEncrypt = commonBusinessImpl.exportExcelTemplate(criteria.getFileNameCntProgress());
            String fileName = UEncrypt.decryptFileUploadPath(fileNameEncrypt);
            File file = new File(folderTemp + File.separatorChar + fileName);
            if (!file.exists()) {
                file = new File(folderUpload + File.separatorChar + fileName);
                if (!file.exists()) {
                    kpiLogDTO.setStatus("0");
                    return Response.status(Response.Status.BAD_REQUEST).build();
                }
            }
            kpiLogDTO.setStatus("1");
            XSSFWorkbook  wb = new XSSFWorkbook (new FileInputStream(file));
//			fill sheet general
            XSSFSheet sheet = wb.getSheetAt(0);
            XSSFSheet sheetDetail = wb.getSheetAt(1);
            int begin = 7;
            XSSFRow rowDate = sheet.getRow(4);
            XSSFCell cellDate = rowDate.createCell(0);
            SimpleDateFormat formater = new SimpleDateFormat("dd/MM/yyyy");
            String curDate = formater.format(new Date());
            XSSFCellStyle style = wb.createCellStyle();
            cellDate.setCellStyle(style);
            style.setAlignment(HorizontalAlignment.CENTER);
            cellDate.setCellValue("Ngày lập báo cáo: "+ curDate);
            String status = null;
            for (int i = 0; i < ls.size(); i++) {
                if (ls.get(i).getStatus() != null) {
                    status = Constants.CONSTRUCTION_STATUS.get(ls.get(i).getStatus().intValue());
                }
                String completeValue = null;
                if (null != ls.get(i).getCompleteValue()) {
                    completeValue = ls.get(i).getCompleteValue() + "%";
                }
                XSSFRow row = sheet.createRow(begin);
                XSSFCell cellSTT = row.createCell(0);
                cellSTT.setCellValue(begin - 6);
                XSSFCell cellContractCode = row.createCell(1);
                cellContractCode.setCellValue(ls.get(i).getCntContractCode());
                XSSFCell cellStation = row.createCell(2);
                cellStation.setCellValue(ls.get(i).getCatStationCode());
                XSSFCell cellConstrCode = row.createCell(3);
                cellConstrCode.setCellValue(ls.get(i).getConstructionCode());
                XSSFCell cellConstrStatus = row.createCell(4);
                cellConstrStatus.setCellValue(status);
                XSSFCell cellConstrCV = row.createCell(5);
                cellConstrCV.setCellValue(completeValue);
                begin++;
            }
//			Fill sheet contract detail
            begin = 7;
            XSSFRow rowDateDT = sheetDetail.getRow(4);
            XSSFCell cellDateDT = rowDateDT.createCell(0);
            cellDateDT.setCellStyle(style);
            cellDateDT.setCellValue("Ngày lập báo cáo: "+ curDate);
            for (int i = 0; i < lsDetail.size(); i++) {
                String cellContractInValue = null;
                if (null != lsDetail.get(i).getListContractIn()) {
                    cellContractInValue = String.join(",", lsDetail.get(i).getListContractIn());
                }
                if (lsDetail.get(i).getStatus() != null) {
                    status = Constants.CONSTRUCTION_STATUS.get(lsDetail.get(i).getStatus().intValue());
                }
                String completeValue = null;
                if (null != lsDetail.get(i).getCompleteValue()) {
                    completeValue = lsDetail.get(i).getCompleteValue() + "%";
                }
                String completeValueWork = null;
                if (null != lsDetail.get(i).getCompleteValueWorkItem()) {
                    completeValueWork = lsDetail.get(i).getCompleteValueWorkItem() + "%";
                }
                XSSFRow rowD = sheetDetail.createRow(begin);
                XSSFCell cellSTTD = rowD.createCell(0);
                cellSTTD.setCellValue(begin - 6);
                XSSFCell cellContractCodeD = rowD.createCell(1);
                cellContractCodeD.setCellValue(lsDetail.get(i).getCntContractCode());
                XSSFCell cellStation1 = rowD.createCell(2);
                cellStation1.setCellValue(lsDetail.get(i).getCatStationCode());
                XSSFCell cellConstrCode1 = rowD.createCell(3);
                cellConstrCode1.setCellValue(lsDetail.get(i).getConstructionCode());
                XSSFCell cellConstrStatus1 = rowD.createCell(4);
                cellConstrStatus1.setCellValue(status);
                XSSFCell cellConstrCV1 = rowD.createCell(5);
                cellConstrCV1.setCellValue(completeValue);
                XSSFCell cellWorkItem = rowD.createCell(6);
                cellWorkItem.setCellValue(lsDetail.get(i).getWorkItemName());
                XSSFCell cellSys = rowD.createCell(7);
                cellSys.setCellValue(lsDetail.get(i).getSysGroupName());
                XSSFCell cellContractIn = rowD.createCell(8);
                cellContractIn.setCellValue(cellContractInValue);
                XSSFCell cellCVWork = rowD.createCell(9);
                cellCVWork.setCellValue(completeValueWork);
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





    @Override
    public Response exportContractProgressPDF(CntContractDTO criteria) throws Exception {
        List<CntConstrWorkItemTaskDTO> ls = null;
        criteria.setPage(null);
        criteria.setPageSize(null);
        if (criteria.getReportContract() == 1) {
            ls = cntConstrWorkItemTaskBusinessImpl.doSearchContractProgress(criteria);
        } else {
            ls = cntConstrWorkItemTaskBusinessImpl.doSearchContractProgressDetail(criteria);
        }
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        String sourceFileName = null;
        if (criteria.getReportContract() == 1) {
            sourceFileName = filePath + "/BaoCaoTienDoHopDong.jasper";
        } else {
            sourceFileName = filePath + "/BaoCaoTienDoHopDongChiTiet.jasper";
        }
        if (!new File(sourceFileName).exists()) {
            log.error("hnx file jasper is not exist!!");
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(
                ls);

        String fileNameEncrypt = null;
        try {
            String jasperPrint = JasperFillManager.fillReportToFile(
                    sourceFileName, null, beanColDataSource);
            if (jasperPrint != null) {
                // JasperExportManager.exportReportToPdfFile( rs,
                // "D://BaoCaoHD.pdf");
                fileNameEncrypt = commonBusinessImpl.exportPDFTemplate(
                        jasperPrint, criteria.getFileNameCntProgress());
            }
        } catch (JRException e) {
            e.printStackTrace();
        }
        return Response.ok(Collections.singletonMap("fileName", fileNameEncrypt)).build();
    }


*/

	
	/*
	@Override
	public Response updateOS(CntConstrWorkItemTaskDTO obj) {
		if (!VpsPermissionChecker.hasPermission(Constants.OperationKey.CREATE, Constants.AdResourceKey.CONSTRUCTION,
                request)) {
            throw new IllegalArgumentException("Bạn không có quyền bổ sung công trình vào hợp đồng !");
        }
		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_CONSTRUCTION_INFORMATION);
		kpiLogDTO.setDescription(
				Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end
		
		if(obj.getType() == 0l) {
			CntConstrWorkItemTaskDTO idCheckObj = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.getIdForCntContractOut(obj);
			if(idCheckObj != null) {
				if(idCheckObj.getCntContractId() != null) {
					if(!idCheckObj.getCntContractId().toString().equalsIgnoreCase(obj.getCntContractId().toString())) {
						return Response.status(Response.Status.NOT_ACCEPTABLE).build();
					}
				}
			}
		}
		
		CntConstrWorkItemTaskDTO originObj = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.getOneById(obj.getCntConstrWorkItemTaskId());
		
		if (originObj == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			//lấy thông tin chưa sysgroupid
			UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");
			obj.setUpdatedUserId(objUser.getSysUserId());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
			boolean check1 = !String.valueOf(obj.getConstructionId()).equalsIgnoreCase(String.valueOf(originObj.getConstructionId()));
			boolean check2 = !String.valueOf(obj.getCatTaskId()).equalsIgnoreCase(String.valueOf(originObj.getCatTaskId()) );
			boolean check3 = !String.valueOf(obj.getWorkItemId()).equalsIgnoreCase(String.valueOf(originObj.getWorkItemId()));
			// if one check is false -> add
			Long id=0l;
			
			try {
			if (check1 || check2 || check3 ) {
				CntConstrWorkItemTaskDTO check = cntConstrWorkItemTaskBusinessImpl.findByIdentityKey(obj);
				if (check != null) {
					return Response.status(Response.Status.CONFLICT).build();
				} else {
					id =  doUpdate(obj);
				}
			} else {
				id = doUpdate(obj);
			}
			} catch(Exception e) {
				kpiLogDTO.setReason(e.toString());
			}
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			kpiLogDTO.setTransactionCode(obj.getConstructionCode());
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
	

	*//**
 * Hoangnh end 28012019
 **//*
 */

	/*
	//hienvd: End

	//hienvd: START 9/9/2019
	@Override
	public Response importCntConstructionOSTypeHTCT(Attachment attachments,
											HttpServletRequest request) throws Exception {

		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.IMPORT_CONSTRUCTION_INFORMATION);
		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));

		String contractId = UString.getSafeFileName(request.getParameter("contractId"));
		String cntContractParentId = UString.getSafeFileName(request.getParameter("cntContractParentId"));
		String contractType = UString.getSafeFileName(request.getParameter("contractType"));
		String folderParam = UString.getSafeFileName(request.getParameter("folder"));
		String filePathReturn;
		String filePath;
		if (UString.isNullOrWhitespace(cntContractParentId)) {
			cntContractParentId = "-1";
		}
		if (UString.isNullOrWhitespace(folderParam)) {
			folderParam = defaultSubFolderUpload;
		} else {
			if (!isFolderAllowFolderSave(folderParam)) {
				throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
			}
		}
		DataHandler dataHandler = attachments.getDataHandler();
		MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
		String fileName = UFile.getFileName(multivaluedMap);
		if (!isExtendAllowSave(fileName)) {
			throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
		}
		try (InputStream inputStream = dataHandler.getInputStream();) {
			filePath = UFile.writeToFileTempServerATTT2(inputStream, fileName, folderParam, folderUpload);
			filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
		} catch (Exception ex) {
			throw new BusinessException("Loi khi save file", ex);
		}
		try {
			try {
				List<CntConstrWorkItemTaskDTO> result = cntConstrWorkItemTaskBusinessImpl.importCntConstructionOSTypeHTCT(folderUpload + filePath,Long.parseLong(contractId),Long.parseLong(cntContractParentId), Long.parseLong(contractType));
				if(result != null && !result.isEmpty() && (result.get(0).getErrorList()==null || result.get(0).getErrorList().size() == 0)){
					int rowNum = 1;
					HashMap<String, String> cntConstrWorkItemTaskMap = new HashMap<String, String>();
					List<CntConstrWorkItemTaskDTO> cntConstrWorkItemTaskLst = cntConstrWorkItemTaskBusinessImpl.doSearch(new CntConstrWorkItemTaskDTO());
					try {
						for (CntConstrWorkItemTaskDTO cntConstrWorkItemTask : cntConstrWorkItemTaskLst) {
							String constructionIdTemp = cntConstrWorkItemTask.getConstructionId().toString();
							String workItemIdTemp = null;
							String catTaskIdTemp = null;
							if(cntConstrWorkItemTask.getWorkItemId() != null)
								workItemIdTemp = cntConstrWorkItemTask.getWorkItemId().toString();
							if(cntConstrWorkItemTask.getCatTaskId() != null)
								catTaskIdTemp = cntConstrWorkItemTask.getCatTaskId().toString();
							String keyTemp = constructionIdTemp;
							if(workItemIdTemp != null) keyTemp = keyTemp + "|" + workItemIdTemp;
							if(catTaskIdTemp != null) keyTemp = keyTemp + "|" + catTaskIdTemp;
							keyTemp = keyTemp + "|" + cntConstrWorkItemTask.getCntContractId().toString();
							cntConstrWorkItemTaskMap.put(keyTemp, cntConstrWorkItemTask.getCntConstrWorkItemTaskId().toString());
						}
					} catch(Exception e) {
						throw new IllegalArgumentException(e.toString());
					}

					for (CntConstrWorkItemTaskDTO obj : result) {
						if(obj != null){
							String constructionTemp = obj.getConstructionId().toString();
							String keyTemp = constructionTemp;
							String workItemIdTemp = null;
							if(obj.getWorkItemId() != null) {
								workItemIdTemp = obj.getWorkItemId().toString();
								keyTemp = keyTemp + "|" + workItemIdTemp;
							}
							String catTaskIdTemp = null;
							if(obj.getCatTaskId() != null) {
								catTaskIdTemp = obj.getCatTaskId().toString();
								keyTemp = keyTemp + "|" + catTaskIdTemp;
							}

							String isExist = cntConstrWorkItemTaskMap.get(keyTemp +"|"+contractId.toString());
							if (isExist != null) {
								kpiLogDTO.setStatus("0");
								continue;
							}
							obj.setCreatedUserId(objUser.getSysUserId());
							obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
							obj.setStatus(1L);
							obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
							obj.setCntContractId(Long.parseLong(contractId));
							Long id = 0l;
							try {
								id=cntConstrWorkItemTaskBusinessImpl.save(obj);
							} catch(Exception e) {
								kpiLogDTO.setReason(e.toString());
							}
							kpiLogDTO.setStatus("1");

							cntConstrWorkItemTaskMap.put(isExist, id.toString());
							rowNum++;
						}
					}
					kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
					kpiLogDTO.setTransactionCode(null);
					kpiLogBusinessImpl.save(kpiLogDTO);
					return Response.ok(result).build();
				}else if (result == null || result.isEmpty()) {
					kpiLogDTO.setStatus("0");
					kpiLogBusinessImpl.save(kpiLogDTO);
					return Response.ok().entity(Response.Status.NO_CONTENT).build(); }
				else{
					kpiLogDTO.setStatus("1");
					return Response.ok(result).build();
				}
			} catch (Exception e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
			}

		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}
	//hienvd: END
	
	//Huypq-20190919-start
	@Override
	public Response importCntConstructionHTCT(Attachment attachments,
			HttpServletRequest request) throws Exception {
		
		//HuyPQ-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.IMPORT_CONSTRUCTION_INFORMATION);
		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
		KttsUserSession objUser=userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		//huy-end
		
		String contractId = UString.getSafeFileName(request.getParameter("contractId"));
		String cntContractParentId = UString.getSafeFileName(request.getParameter("cntContractParentId"));
		String contractType = UString.getSafeFileName(request.getParameter("contractType"));
		String folderParam = UString.getSafeFileName(request.getParameter("folder"));
		//Huypq-20190917-start
		String typeHTCT = UString.getSafeFileName(request.getParameter("typeHTCT"));
		//huy-end
		String filePathReturn;
		String filePath;
		
		if (UString.isNullOrWhitespace(cntContractParentId)) {
			cntContractParentId = "-1";
		}
		
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
				List<CntConstrWorkItemTaskDTO> result = cntConstrWorkItemTaskBusinessImpl.importCntConstructionHTCT(folderUpload + filePath,Long.parseLong(contractId),
						Long.parseLong(cntContractParentId), Long.parseLong(contractType), Long.parseLong(typeHTCT));
				if(result != null && !result.isEmpty() && (result.get(0).getErrorList()==null || result.get(0).getErrorList().size() == 0)){
						int rowNum = 1;
						
						HashMap<String, String> cntConstrWorkItemTaskMap = new HashMap<String, String>();
						List<CntConstrWorkItemTaskDTO> cntConstrWorkItemTaskLst = cntConstrWorkItemTaskBusinessImpl.doSearch(new CntConstrWorkItemTaskDTO());
						try {
							for (CntConstrWorkItemTaskDTO cntConstrWorkItemTask : cntConstrWorkItemTaskLst) {
								String constructionIdTemp = cntConstrWorkItemTask.getConstructionId().toString();
								String workItemIdTemp = null;
								String catTaskIdTemp = null;
								if(cntConstrWorkItemTask.getWorkItemId() != null)
									workItemIdTemp = cntConstrWorkItemTask.getWorkItemId().toString();
								if(cntConstrWorkItemTask.getCatTaskId() != null)
									catTaskIdTemp = cntConstrWorkItemTask.getCatTaskId().toString();
								String keyTemp = constructionIdTemp;
								if(workItemIdTemp != null) keyTemp = keyTemp + "|" + workItemIdTemp;
								if(catTaskIdTemp != null) keyTemp = keyTemp + "|" + catTaskIdTemp;
								keyTemp = keyTemp + "|" + cntConstrWorkItemTask.getCntContractId().toString();
								cntConstrWorkItemTaskMap.put(keyTemp, cntConstrWorkItemTask.getCntConstrWorkItemTaskId().toString());
							}
						} catch(Exception e) {
							throw new IllegalArgumentException(e.toString());
						}
						
						for (CntConstrWorkItemTaskDTO obj : result) {
							if(obj != null){
								
								
//								CntConstrWorkItemTaskDTO existing = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.findByIdentityKey(obj);
								String constructionTemp = obj.getConstructionId().toString();
								String keyTemp = constructionTemp;
								String workItemIdTemp = null;
								if(obj.getWorkItemId() != null) {
									workItemIdTemp = obj.getWorkItemId().toString();
									keyTemp = keyTemp + "|" + workItemIdTemp;
								}
								String catTaskIdTemp = null;
								if(obj.getCatTaskId() != null) {
									catTaskIdTemp = obj.getCatTaskId().toString();
									keyTemp = keyTemp + "|" + catTaskIdTemp;
								}
								
								String isExist = cntConstrWorkItemTaskMap.get(keyTemp +"|"+contractId.toString());
								if (isExist != null) {
//									return Response.status(Response.Status.CONFLICT).build();
									kpiLogDTO.setStatus("0");
									continue;
								} 
								obj.setCreatedUserId(objUser.getSysUserId());
								obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
								obj.setStatus(1L);
								obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
								obj.setCntContractId(Long.parseLong(contractId));
								
								
								
								Long id = 0l;
								try {
									id=cntConstrWorkItemTaskBusinessImpl.save(obj);
								} catch(Exception e) {
									kpiLogDTO.setReason(e.toString());
								}
								kpiLogDTO.setStatus("1");
								
								cntConstrWorkItemTaskMap.put(isExist, id.toString());
								rowNum++;
							}
						}
						kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
						kpiLogDTO.setTransactionCode(null);
						kpiLogBusinessImpl.save(kpiLogDTO);
					return Response.ok(result).build();
				}else if (result == null || result.isEmpty()) {
					kpiLogDTO.setStatus("0");
					kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
					kpiLogDTO.setTransactionCode(null);
					kpiLogBusinessImpl.save(kpiLogDTO);
					return Response.ok().entity(Response.Status.NO_CONTENT).build(); }
				else{
					kpiLogDTO.setStatus("1");
//					kpiLogBusinessImpl.save(kpiLogDTO);
					return Response.ok(result).build();
				}
			} catch (Exception e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
			}

		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}
	//Huy-end
	
	//Huypq-20190924-start
	@Override
	public Response addHTCT(CntConstrWorkItemTaskDTO obj) {

		// HuyPq-start
				KpiLogDTO kpiLogDTO = new KpiLogDTO();
				kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_CONSTRUCTION_INFORMATION);
				kpiLogDTO.setDescription(
						Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
				KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
				kpiLogDTO.setCreateUserId(objUser.getSysUserId());
				kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
				// huy-end
		
		if(obj.getType() == 0l) {
			CntConstrWorkItemTaskDTO idCheckObj = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.getIdForCntContractOutHTCT(obj);
			if(idCheckObj != null) {
				if(idCheckObj.getCntContractId() != null) {
					if(!idCheckObj.getCntContractId().toString().equalsIgnoreCase(obj.getCntContractId().toString())) {
						return Response.status(Response.Status.NOT_ACCEPTABLE).build();
					}
				}
			}
		}
	
		CntConstrWorkItemTaskDTO existing = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.findByIdentityKey(obj);
		UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");

		if (existing != null) {
			return Response.status(Response.Status.CONFLICT).build();
		} else {
			obj.setCreatedUserId(objUser.getSysUserId());
			obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
			obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
			obj.setStatus(1L);
			Long id=0l;
			try {
				id = cntConstrWorkItemTaskBusinessImpl.save(obj);
			} catch(Exception e) {
				kpiLogDTO.setReason(e.toString());
			}
			obj.setCntConstrWorkItemTaskId(id);
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			String constructionIds=String.valueOf(obj.getConstructionCode());
			kpiLogDTO.setTransactionCode(constructionIds);
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
	public Response updateHTCT(CntConstrWorkItemTaskDTO obj) {
		
		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_CONSTRUCTION_INFORMATION);
		kpiLogDTO.setDescription(
				Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end
		
		if(obj.getType() == 0l) {
			CntConstrWorkItemTaskDTO idCheckObj = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.getIdForCntContractOutHTCT(obj);
			if(idCheckObj != null) {
				if(idCheckObj.getCntContractId() != null) {
					if(!idCheckObj.getCntContractId().toString().equalsIgnoreCase(obj.getCntContractId().toString())) {
						return Response.status(Response.Status.NOT_ACCEPTABLE).build();
					}
				}
			}
		}
		
		CntConstrWorkItemTaskDTO originObj = (CntConstrWorkItemTaskDTO) cntConstrWorkItemTaskBusinessImpl.getOneById(obj.getCntConstrWorkItemTaskId());
		
		if (originObj == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			//lấy thông tin chưa sysgroupid
			UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");
			obj.setUpdatedUserId(objUser.getSysUserId());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
			boolean check1 = !String.valueOf(obj.getConstructionId()).equalsIgnoreCase(String.valueOf(originObj.getConstructionId()));
			boolean check2 = !String.valueOf(obj.getCatTaskId()).equalsIgnoreCase(String.valueOf(originObj.getCatTaskId()) );
			boolean check3 = !String.valueOf(obj.getWorkItemId()).equalsIgnoreCase(String.valueOf(originObj.getWorkItemId()));
			// if one check is false -> add
			Long id=0l;
			
			try {
			if (check1 || check2 ||
					check3 ) {
				CntConstrWorkItemTaskDTO check = cntConstrWorkItemTaskBusinessImpl.findByIdentityKey(obj);
				if (check != null) {
					return Response.status(Response.Status.CONFLICT).build();
				} else {
					id =  doUpdate(obj);
				}
			} else {
				id = doUpdate(obj);
			}
			} catch(Exception e) {
				kpiLogDTO.setReason(e.toString());
			}
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			kpiLogDTO.setTransactionCode(obj.getConstructionCode());
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
	}*/
//Huy-end


