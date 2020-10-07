package com.viettel.aio.rest;

import com.viettel.aio.business.CatTaskHCQTBusinessImpl;
import com.viettel.aio.dto.CatTaskHCQTDTO;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
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

public class CatTaskHCQTRsServiceImpl implements CatTaskHCQTRsService {

	protected final Logger log = Logger.getLogger(CatTaskHCQTRsServiceImpl.class);
	@Autowired
	CatTaskHCQTBusinessImpl catTaskHCQTBusiness;
	@Autowired
	private UserRoleBusinessImpl userRoleBusinessImpl;

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

	@Context
	HttpServletRequest request;
	
    @Override
    public Response doSearch(CatTaskHCQTDTO obj) {
		List<CatTaskHCQTDTO> ls = catTaskHCQTBusiness.doSearch(obj);
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
	public Response findByAutoComplete(CatTaskHCQTDTO obj) {
		List<CatTaskHCQTDTO> results = catTaskHCQTBusiness.getForAutoComplete(obj);
		if (obj.getIsSize()){
            CatTaskHCQTDTO moreObject = new CatTaskHCQTDTO();
			moreObject.setWorkItemId(0l);;
			results.add(moreObject);
		}
		return Response.ok(results).build();
	}
	
//	@Override
//	public Response doSearchCatTask(CatTaskHCQTDTO obj) {
//		DataListDTO data = catTaskHCQTBusiness.doSearchCatTask(obj);
//		return Response.ok(data).build();
//	}
//
//	@Override
//	public Response saveCatTask(CatTaskHCQTDTO obj) {
//		Long ids = catTaskHCQTBusiness.saveWorkItemTask(obj);
//		if (ids == 0l) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(Response.Status.CREATED).build();
//		}
//	}
//
//	@Override
//	public Response updateWorkItemTask(CatTaskHCQTDTO obj) {
//		Long ids = catTaskHCQTBusiness.updateWorkItemTask(obj);
//		if (ids == 0l) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(Response.Status.CREATED).build();
//		}
//	}
//
//	@Override
//	public Response deleteWorkItemTask(CatTaskHCQTDTO obj) {
//		Long ids = catTaskHCQTBusiness.deleteWorkItemTask(obj);
//		if (ids == 0l) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(Response.Status.CREATED).build();
//		}
//	}
//
//	@Override
//	public Response checkCatTaskExit(CatTaskHCQTDTO obj) {
//		List<CatTaskHCQTDTO> data = catTaskHCQTBusiness.checkCatTaskExit(obj);
//		return Response.ok(data).build();
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
//	public Response importCatTaskHCQT(Attachment attachments, HttpServletRequest request) throws Exception {
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
//			List<CatTaskHCQTDTO> result = catTaskHCQTBusiness.importCatTaskHCQTPackage(folderUpload + filePath);
//			if(result != null && !result.isEmpty() && (result.get(0).getErrorList()==null || result.get(0).getErrorList().size() == 0)){
//				for (CatTaskHCQTDTO obj : result) {
//					obj.setStatus(1L);
//					Long id = 0l;
//					id = catTaskHCQTBusiness.save(obj);
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
//	// Huypq-20190827-start
//	@Override
//	public Response exportTaskHCQT(CatTaskHCQTDTO obj) throws Exception {
//		try {
//			String strReturn = catTaskHCQTBusiness.exportTaskHCQT(obj, request);
//			return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
//		} catch (Exception e) {
//			log.error(e);
//		}
//		return null;
//	}
}
