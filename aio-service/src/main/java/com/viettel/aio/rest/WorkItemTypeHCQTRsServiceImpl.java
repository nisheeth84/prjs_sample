package com.viettel.aio.rest;

import com.viettel.aio.business.WorkItemTypeHCQTBusinessImpl;
import com.viettel.aio.dto.WorkItemTypeHCQTDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;

/**
 * @author HIENVD
 */

public class WorkItemTypeHCQTRsServiceImpl implements WorkItemTypeHCQTRsService {

	protected final Logger log = Logger.getLogger(WorkItemTypeHCQTRsService.class);
	@Autowired
	WorkItemTypeHCQTBusinessImpl workItemTypeBusinessImpl;

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

	@Override
	public Response doSearch(WorkItemTypeHCQTDTO obj) {
		List<WorkItemTypeHCQTDTO> ls = workItemTypeBusinessImpl.doSearch(obj);
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
	public Response findByAutoComplete(WorkItemTypeHCQTDTO obj) {
		List<WorkItemTypeHCQTDTO> results = workItemTypeBusinessImpl.getForAutoComplete(obj);
		if (obj.getIsSize()){
			WorkItemTypeHCQTDTO moreObject = new WorkItemTypeHCQTDTO();
			moreObject.setWorkItemTypeId(0l);;
			results.add(moreObject);
		}
		return Response.ok(results).build();
	}

	@Override
	public Response doSearchWorkItemType(WorkItemTypeHCQTDTO obj) {
		DataListDTO data = workItemTypeBusinessImpl.doSearchWorkItemType(obj);
		return Response.ok(data).build();
	}

	@Override
	public Response saveWorkItemType(WorkItemTypeHCQTDTO obj) {
		Long ids = workItemTypeBusinessImpl.saveWorkItemType(obj);
		if (ids == 0l) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			return Response.ok(Response.Status.CREATED).build();
		}
	}

	@Override
	public Response updateWorkItemType(WorkItemTypeHCQTDTO obj) {
		Long ids = workItemTypeBusinessImpl.updateWorkItemType(obj);
		if (ids == 0l) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			return Response.ok(Response.Status.CREATED).build();
		}
	}

	@Override
	public Response deleteWorkItemType(WorkItemTypeHCQTDTO obj) {
		Long ids = workItemTypeBusinessImpl.deleteWorkItemType(obj);
		if (ids == 0l) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			return Response.ok(Response.Status.CREATED).build();
		}
	}

	@Override
	public Response getAutoCompleteWorkItemType(WorkItemTypeHCQTDTO obj) {
		List<WorkItemTypeHCQTDTO> data = workItemTypeBusinessImpl.getAutoCompleteWorkItemType(obj);
		return Response.ok(data).build();
	}
	
//	@Override
//	public Response doSearch(WorkItemTypeHcqtDTO obj) {
//		List<WorkItemTypeHcqtDTO> ls = workItemTypeHcqtBusinessImpl.doSearch(obj);
//		if (ls == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			DataListDTO data = new DataListDTO();
//			data.setData(ls);
//			data.setTotal(obj.getTotalRecord());
//			data.setSize(obj.getPageSize());
//			data.setStart(1);
//			return Response.ok(data).build();
//		}
//	}
//
//	@Override
//	public Response findByAutoComplete(WorkItemTypeHcqtDTO obj) {
//		List<WorkItemTypeHcqtDTO> results = workItemTypeHcqtBusinessImpl.getForAutoComplete(obj);
//		if (obj.getIsSize()){
//			WorkItemTypeHcqtDTO moreObject = new WorkItemTypeHcqtDTO();
//			moreObject.setWorkItemTypeId(0l);;
//			results.add(moreObject);
//		}
//		return Response.ok(results).build();
//	}

	@Override
	public Response checkValidateWorkItemType(WorkItemTypeHCQTDTO obj) {
		List<WorkItemTypeHCQTDTO> results = workItemTypeBusinessImpl.checkValidateWorkItemType(obj);
		return Response.ok(results).build();
	}

	private boolean isFolderAllowFolderSave(String folderDir) {
		return UString.isFolderAllowFolderSave(folderDir, allowFolderDir);

	}

	private boolean isExtendAllowSave(String fileName) {
		return UString.isExtendAllowSave(fileName, allowFileExt);
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
	public Response importWorkItemTypeHCQT(Attachment attachments, HttpServletRequest request) throws Exception {
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
		MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
		String fileName = UFile.getFileName(multivaluedMap);
		if (!isExtendAllowSave(fileName)) {
			throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
		}
//		 write & upload file to server
		try (InputStream inputStream = dataHandler.getInputStream();) {
			filePath = UFile.writeToFileTempServerATTT2(inputStream, fileName, folderParam, folderUpload);
			filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
		} catch (Exception ex) {
			throw new BusinessException("Loi khi save file", ex);
		}

		try {
			List<WorkItemTypeHCQTDTO> result = workItemTypeBusinessImpl.importWorkItemTypeHCQTPackage(folderUpload + filePath);
			if(result != null && !result.isEmpty() && (result.get(0).getErrorList()==null || result.get(0).getErrorList().size() == 0)){
				for (WorkItemTypeHCQTDTO obj : result) {
					obj.setStatus(1L);
					Long id = 0l;
					id = workItemTypeBusinessImpl.save(obj);
				}
				return Response.ok(result).build();
			}else if (result == null || result.isEmpty()) {
				return Response.ok().entity(Response.Status.NO_CONTENT).build(); }
			else{
				return Response.ok(result).build();
			}

		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}

	}


}
