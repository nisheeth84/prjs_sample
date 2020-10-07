package com.viettel.aio.rest;

import com.viettel.aio.business.WorkItemHCQTBusiness;
import com.viettel.aio.dto.WorkItemHCQTDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HIENVD
 */

public class WorkItemHCQTRsServiceImpl implements WorkItemHCQTRsService {

    protected final Logger log = Logger.getLogger(WorkItemRsService.class);
    @Autowired
    WorkItemHCQTBusiness workItemHCQTBusinessImpl;
    @Value("${folder_upload}")
    private String folderTemp;

    @Value("${folder_upload}")
    private String folder2Upload;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;
    @Value("${allow.folder.dir}")
    private String allowFolderDir;

//	@Autowired
//	private UserRoleBusinessImpl userRoleBusinessImpl;

    @Context
    HttpServletRequest request;

    @Override
    public Response doSearch(WorkItemHCQTDTO obj) {
		List<WorkItemHCQTDTO> ls = workItemHCQTBusinessImpl.doSearch(obj);
		if (ls == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			DataListDTO data = new DataListDTO();
			data.setData(ls);
			data.setTotal(obj.getTotalRecord());
			data.setSize(obj.getPageSize());
			data.setStart(1);
			return Response.ok(data).build();
		}
    }

    @Override
    public Response findByAutoComplete(WorkItemHCQTDTO obj) {
        List<WorkItemHCQTDTO> results = workItemHCQTBusinessImpl.getForAutoComplete(obj);
        if (obj.getIsSize()) {
            WorkItemHCQTDTO moreObject = new WorkItemHCQTDTO();
            moreObject.setWorkItemId(0l);
            results.add(moreObject);
        }
        return Response.ok(results).build();
    }

    //	@Override
//	public Response doSearchWorkItem(WorkItemHCQTDTO obj) {
//		DataListDTO data = workItemHCQTBusinessImpl.doSearchWorkItem(obj);
//		return Response.ok(data).build();
//	}
//
//	@Override
//	public Response saveWorkItem(WorkItemHCQTDTO obj) {
//		Long ids = workItemHCQTBusinessImpl.saveWorkItem(obj);
//		if (ids == 0l) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(Response.Status.CREATED).build();
//		}
//	}
//
//	@Override
//	public Response updateWorkItem(WorkItemHCQTDTO obj) {
//		Long ids = workItemHCQTBusinessImpl.updateWorkItem(obj);
//		if (ids == 0l) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(Response.Status.CREATED).build();
//		}
//	}
//
//	@Override
//	public Response deleteWorkItem(WorkItemHCQTDTO obj) {
//		Long ids = workItemHCQTBusinessImpl.deleteWorkItem(obj);
//		if (ids == 0l) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(Response.Status.CREATED).build();
//		}
//	}
//
//	@Override
//	public Response getAutoCompleteWorkItem(WorkItemHCQTDTO obj) {
//		List<WorkItemHCQTDTO> data = workItemHCQTBusinessImpl.getAutoCompleteWorkItem(obj);
//		return Response.ok(data).build();
//	}
//
//	@Override
//	public Response checkWorkItemExit(WorkItemHCQTDTO obj) {
//		List<WorkItemHCQTDTO> data = workItemHCQTBusinessImpl.checkWorkItemExit(obj);
//		return Response.ok(data).build();
//	}
//
////	@Override
////    public Response doSearch(WorkItemHCQTDTO obj) {
////		List<WorkItemHCQTDTO> ls = workItemHcqtBusinessImpl.doSearch(obj);
////		if (ls == null) {
////			return Response.status(Response.Status.BAD_REQUEST).build();
////		} else {
////			DataListDTO data = new DataListDTO();
////			data.setData(ls);
////			data.setTotal(obj.getTotalRecord());
////			data.setSize(obj.getPageSize());
////			data.setStart(1);
////			return Response.ok(data).build();
////		}
////    }
////
//    @Override
//    public Response findByAutoComplete(WorkItemHCQTDTO obj) {
//        List<WorkItemHCQTDTO> results = workItemHCQTBusinessImpl.getForAutoComplete(obj);
//        if (obj.getIsSize()) {
//            WorkItemHCQTDTO moreObject = new WorkItemHCQTDTO();
//            moreObject.setWorkItemId(0l);
//            ;
//            results.add(moreObject);
//        }
//        return Response.ok(results).build();
//    }
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
//
//	@Override
//	public Response downloadFile(HttpServletRequest request) throws Exception {
//		String fileName = UEncrypt.decryptFileUploadPath(request.getQueryString());
//		File file = new File(folderTemp + File.separatorChar + fileName);
//		InputStream ExcelFileToRead = new FileInputStream(folder2Upload + File.separatorChar + fileName);
//		if (!file.exists()) {
//			file = new File(folderUpload + File.separatorChar + fileName);
//			if (!file.exists()) {
//				return Response.status(Response.Status.BAD_REQUEST).build();
//			}
//		}
//		int lastIndex = fileName.lastIndexOf(File.separatorChar);
//		String fileNameReturn = fileName.substring(lastIndex + 1);
//		return Response.ok((Object) file)
//				.header("Content-Disposition", "attachment; filename=\"" + fileNameReturn + "\"").build();
//	}
//
//	@Override
//	public Response importWorkItemHCQT(Attachment attachments, HttpServletRequest request) throws Exception {
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		String folderParam = UString.getSafeFileName(request.getParameter("folder"));
//		String filePathReturn;
//		String filePath;
//		if (UString.isNullOrWhitespace(folderParam)) {
//			folderParam = defaultSubFolderUpload;
//		} else {
//			if (!isFolderAllowFolderSave(folderParam)) {
//				throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
//			}
//		}
//		DataHandler dataHandler = attachments.getDataHandler();
//		MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
//		String fileName = UFile.getFileName(multivaluedMap);
//		if (!isExtendAllowSave(fileName)) {
//			throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
//		}
////		 write & upload file to server
//		try (InputStream inputStream = dataHandler.getInputStream();) {
//			filePath = UFile.writeToFileTempServerATTT2(inputStream, fileName, folderParam, folderUpload);
//			filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
//		} catch (Exception ex) {
//			throw new BusinessException("Loi khi save file", ex);
//		}
//
//		try {
//			List<WorkItemHCQTDTO> result = workItemHCQTBusinessImpl.importWorkItemHCQTPackage(folderUpload + filePath);
//			if(result != null && !result.isEmpty() && (result.get(0).getErrorList()==null || result.get(0).getErrorList().size() == 0)){
//				for (WorkItemHCQTDTO obj : result) {
//					obj.setStatus(1L);
//					Long id = 0l;
//					id = workItemHCQTBusinessImpl.save(obj);
//				}
//				return Response.ok(result).build();
//			}else if (result == null || result.isEmpty()) {
//				return Response.ok().entity(Response.Status.NO_CONTENT).build(); }
//			else{
//				return Response.ok(result).build();
//			}
//
//		} catch (IllegalArgumentException e) {
//			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
//		}
//
//	}
//
//	//Huypq-20190827-start
//	@Override
//    public Response exportWorkItemTypeHCQT(WorkItemHCQTDTO obj) throws Exception {
//        try {
//            String strReturn = workItemHCQTBusinessImpl.exportWorkItemTypeHCQT(obj, request);
//            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
//        } catch (Exception e) {
//            log.error(e);
//        }
//        return null;
//    }
//	//Huy-end

}
