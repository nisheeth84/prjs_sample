package com.viettel.aio.rest;

import com.viettel.aio.business.CntContractTaskXNXDBusinessImpl;
import com.viettel.aio.dto.CntContractTaskXNXDDTO;
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
import javax.ws.rs.core.Context;
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
 
public class CntContractTaskXNXDRsServiceImpl implements CntContractTaskXNXDRsService {

	protected final Logger log = Logger.getLogger(CntConstrWorkItemTaskRsService.class);
	@Autowired
	CntContractTaskXNXDBusinessImpl cntContractTaskXNXDBusiness;
	
	@Context
	HttpServletRequest request;

	@Autowired
	private UserRoleBusinessImpl userRoleBusinessImpl;

//	@Autowired
//	private ConstructionBusinessImpl constructionBusinessImpl;
//
//	@Autowired
//	private WorkItemBusinessImpl workItemBusinessImpl;
//
//	@Autowired
//	private CatTaskBusinessImpl catTaskBusinessImpl;
//
//	@Autowired
//	private CatUnitBusinessImpl catUnitBusinessImpl;
//
//	@Autowired
//	private CommonBusinessImpl commonBusinessImpl;
//
//	@Autowired
//	AppParamBusinessImpl appParamBusinessImpl;
	
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

//	@Autowired
//	private KpiLogBusinessImpl kpiLogBusinessImpl;

	//hienvd: Add 8/7/2019
	@Override
	public Response doSearchPLHD(CntContractTaskXNXDDTO obj) {
		List<CntContractTaskXNXDDTO> ls = cntContractTaskXNXDBusiness.doSearchPLHD(obj);
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

//	@Override
//	public Response addJobPLHD(CntContractTaskXNXDDTO obj) {
//		cntContractTaskXNXDBusiness.addPLHD(obj);
//		return Response.ok(obj).build();
//	}
//
//	@Override
//	public Response checkValidatePLHD(CntContractTaskXNXDDTO criteria) {
//		boolean count  = cntContractTaskXNXDBusiness.checkValidatePLHD(criteria);
//			return Response.ok(count).build();
//
//	}
//
//	@Override
//	public Response removeJobPLHD(CntContractTaskXNXDDTO obj) {
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			cntContractTaskXNXDBusiness.removePLHD(obj);
//			return Response.ok(Response.Status.NO_CONTENT).build();
//		}
//
//	}
//
//	@Override
//	public Response updateJobPLHD(CntContractTaskXNXDDTO obj) {
//
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			cntContractTaskXNXDBusiness.updatePLHD(obj);
//			return Response.ok(Response.Status.NO_CONTENT).build();
//		}
//	}


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



	private boolean isFolderAllowFolderSave(String folderDir) {
		return UString.isFolderAllowFolderSave(folderDir, allowFolderDir);

	}

	private boolean isExtendAllowSave(String fileName) {
		return UString.isExtendAllowSave(fileName, allowFileExt);
	}


	@Override
	public Response importCntJobPLHD(Attachment attachments, HttpServletRequest request) throws Exception {
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		String folderParam = UString.getSafeFileName(request.getParameter("folder"));
		Long cntContractIdIp = Long.parseLong(UString.getSafeFileName(request.getParameter("cntContractId")));
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
			List<CntContractTaskXNXDDTO> result = cntContractTaskXNXDBusiness.importCntJobPLHDPackage(folderUpload + filePath, cntContractIdIp);
			if(result != null && !result.isEmpty() && (result.get(0).getErrorList()==null || result.get(0).getErrorList().size() == 0)){
				for (CntContractTaskXNXDDTO obj : result) {
					 cntContractTaskXNXDBusiness.addPLHD(obj);
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
	
//	//tatph-10/10/2019-start
//	@Override
//	public Response exportContentPLHD(CntContractTaskXNXDDTO obj) {
//		try {
//			String strReturn = cntContractTaskXNXDBusiness.exportContentPLHD(obj, request);
//			return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
//		} catch (Exception e) {
//			log.error(e);
//		}
//		return null;
//	}
//	//tatph-end
}
