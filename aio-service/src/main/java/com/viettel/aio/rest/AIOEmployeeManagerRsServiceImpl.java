package com.viettel.aio.rest;

import com.viettel.aio.business.AIOEmployeeManagerBusinessImpl;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.dto.AIOStaffPlainDTO;
import com.viettel.aio.dto.AIOStaffPlanDetailDTO;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class AIOEmployeeManagerRsServiceImpl implements AIOEmployeeManagerRsService{

	protected final Logger log = Logger.getLogger(AIOEmployeeManagerRsServiceImpl.class);
	
	@Value("${folder_upload2}")
	private String folderUpload;

	@Value("${folder_upload}")
	private String folderTemp;

	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;

	@Value("${allow.file.ext}")
	private String allowFileExt;
	
	@Value("${allow.folder.dir}")
	private String allowFolderDir;

	@Context
	private HttpServletRequest request;
	
	@Autowired
	private AIOEmployeeManagerBusinessImpl aioEmployeeManagerBusiness;

	@Autowired
	private UserRoleBusinessImpl userRoleBusiness;
	
	@Override
    public Response doSearch(AIOStaffPlainDTO obj) {
		String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE, Constant.AdResourceKey.STAFF_PLAN, request);
		DataListDTO data = new DataListDTO();
		if (StringUtils.isNotEmpty(sysGroupIdStr)) {
			data = aioEmployeeManagerBusiness.doSearch(obj, sysGroupIdStr);
		} else {
			data.setData(new ArrayList());
			data.setSize(0);
			data.setTotal(0);
			data.setStart(1);
		}
		return Response.ok(data).build();
    }

	@Override
	public Response exportDetailToExcel(AIOStaffPlainDTO obj) {
		String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE, Constant.AdResourceKey.STAFF_PLAN, request);
		DataListDTO data = new DataListDTO();
		if (StringUtils.isNotEmpty(sysGroupIdStr)) {
			data = aioEmployeeManagerBusiness.exportDetailToExcel(obj, sysGroupIdStr);
		} else {
			data.setData(new ArrayList());
			data.setSize(0);
			data.setTotal(0);
			data.setStart(1);
		}
		return Response.ok(data).build();
	}
	
	@Override
    public Response getDetailByMonthPlanId(AIOStaffPlainDTO obj) {
        DataListDTO data = new DataListDTO();
        data = aioEmployeeManagerBusiness.getDetailByMonthPlanId(obj);
        return Response.ok(data).build();
    }

	@Override
	public Response getDetailByStaffPlanId(AIOStaffPlainDTO obj) {
		DataListDTO data = new DataListDTO();
		data = aioEmployeeManagerBusiness.getDetailByStaffPlanId(obj);
		return Response.ok(data).build();
	}

	@Override
	public Response getMonthlyTargetsByStaffId(AIOStaffPlainDTO obj) {
		String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE, Constant.AdResourceKey.STAFF_PLAN, request);
		DataListDTO data = new DataListDTO();
		if (StringUtils.isNotEmpty(sysGroupIdStr)) {
			data = aioEmployeeManagerBusiness.getMonthlyTargetsByStaffId(obj, sysGroupIdStr);
		} else {
			data.setData(new ArrayList());
			data.setSize(0);
			data.setTotal(0);
			data.setStart(1);
		}
		return Response.ok(data).build();
	}

	@Override
    public Response exportFileBM(AIOStaffPlainDTO obj) throws Exception {
        try {
			String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE, Constant.AdResourceKey.STAFF_PLAN, request);
			List<String> sysGroupIdsPermission = ConvertData.convertStringToList(sysGroupIdStr, ",");
			if (sysGroupIdsPermission.size() != 1) {
				throw new BusinessException(AIOErrorType.NOT_AUTHORIZE.msg + " tạo chỉ tiêu NV");
			}
			obj.setSysGroupIdsPermission(sysGroupIdsPermission);

			String strReturn = aioEmployeeManagerBusiness.exportFileBM(obj,request);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
		} catch (BusinessException e) {
			e.printStackTrace();
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		} catch (Exception e) {
			e.printStackTrace();
			return Response.ok().entity(Collections.singletonMap("error", "Có lỗi xảy ra")).build();
		}
    }


	private boolean isFolderAllowFolderSave(String folderDir) {
		return UString.isFolderAllowFolderSave(folderDir, allowFolderDir);

	}

	private boolean isExtendAllowSave(String fileName) {
		return UString.isExtendAllowSave(fileName, allowFileExt);
	}

	@Override
	public Response importExcel(Attachment attachments, HttpServletRequest request) throws Exception {
		try {
			String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE, Constant.AdResourceKey.STAFF_PLAN, request);
			List<String> sysGroupIdsPermission = ConvertData.convertStringToList(sysGroupIdStr, ",");
			if (sysGroupIdsPermission.size() != 1) {
				throw new BusinessException(AIOErrorType.NOT_AUTHORIZE.msg + " tạo chỉ tiêu NV");
			}

			String folderParam = UString.getSafeFileName(request.getParameter("folder"));
			String monthYear = request.getParameter("monthYear");
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
			InputStream inputStream = dataHandler.getInputStream();
			filePath = UFile.writeToFileServerATTT2(inputStream, fileName, folderParam, folderUpload);
			List<AIOStaffPlanDetailDTO> list = aioEmployeeManagerBusiness.doImportExcel(
					folderUpload + filePath, sysGroupIdsPermission, request);
			return Response.ok(list).build();
		} catch (BusinessException e) {
			e.printStackTrace();
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		} catch (Exception e) {
			e.printStackTrace();
			return Response.ok().entity(Collections.singletonMap("error", "Có lỗi xảy ra")).build();
		}
	}

	@Override
	public Response insertMonthPlan(AIOStaffPlainDTO obj) {
		try {
			KttsUserSession session = userRoleBusiness.getUserSession(request);
			Long sysUserId = session.getVpsUserInfo().getSysUserId();
			String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE, Constant.AdResourceKey.STAFF_PLAN, request);
			List<String> sysGroupIdsPermission = ConvertData.convertStringToList(sysGroupIdStr, ",");
			if (sysGroupIdsPermission.size() != 1) {
				throw new BusinessException(AIOErrorType.NOT_AUTHORIZE.msg + " tạo chỉ tiêu NV");
			}
			obj.setSysGroupIdsPermission(sysGroupIdsPermission);

			aioEmployeeManagerBusiness.insertMonthPlan(obj, sysUserId);
			return Response.ok(Response.Status.OK).build();
		} catch (BusinessException e) {
			e.printStackTrace();
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		} catch (Exception e) {
			e.printStackTrace();
			return Response.ok().entity(Collections.singletonMap("error", "Có lỗi xảy ra")).build();
		}
	}
	@Override
	public Response searchColumnsConfigService() {
		DataListDTO data = new DataListDTO();
		data = aioEmployeeManagerBusiness.searchColumnsConfigService();
		return Response.ok(data).build();
	}
	@Override
	public Response updateMonthPlan(AIOStaffPlainDTO obj) {
		try {
			KttsUserSession session = userRoleBusiness.getUserSession(request);
			Long sysUserId = session.getVpsUserInfo().getSysUserId();

			String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE, Constant.AdResourceKey.STAFF_PLAN, request);
			List<String> sysGroupIdsPermission = ConvertData.convertStringToList(sysGroupIdStr, ",");
			if (sysGroupIdsPermission.size() != 1) {
				throw new BusinessException(AIOErrorType.NOT_AUTHORIZE.msg + " tạo chỉ tiêu NV");
			}

			aioEmployeeManagerBusiness.updateMonthPlan(obj, sysUserId);
			return Response.ok(Response.Status.OK).build();
		} catch (BusinessException e) {
			e.printStackTrace();
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		} catch (Exception e) {
			e.printStackTrace();
			return Response.ok().entity(Collections.singletonMap("error", "Có lỗi xảy ra")).build();
		}
	}

	@Override
	public Response getAllSysGroupByCode(AIOStaffPlanDetailDTO obj) {
		return Response.ok(aioEmployeeManagerBusiness.getAllSysGroupByCode(obj,request)).build();
	}

	@Override
	public Response getAllSysUserByName(AIOStaffPlanDetailDTO obj) {

		return Response.ok(aioEmployeeManagerBusiness.getAllSysUserByName(obj,request)).build();
	}

	@Override
	public void removerMonthPlan(AIOStaffPlainDTO obj) {
		// TODO Auto-generated method stub
		aioEmployeeManagerBusiness.removerStaffPlan(obj);
	}

	@Override
	public Response checkDataMonthPlan(AIOStaffPlainDTO obj) {
		// TODO Auto-generated method stub
		return Response.ok(aioEmployeeManagerBusiness.checkDataMonthPlan(obj)).build();
	}

	//
//	@Override
//	public Response doSearchChart(AIOMonthPlanDetailDTO obj) {
//		// TODO Auto-generated method stub
//		return Response.ok(aioEmployeeManagerBusiness.doSearchChart(obj)).build();
//	}
//
//	@Override
//	public Response getAutoCompleteSysGroupLevel(AIOMonthPlanDetailDTO obj) {
//		// TODO Auto-generated method stub
//		return Response.ok(aioEmployeeManagerBusiness.getAutoCompleteSysGroupLevel(obj)).build();
//	}
//
//	@Override
//	public Response doSearchChartLine(AIOMonthPlanDetailDTO obj) {
//		// TODO Auto-generated method stub
//		return Response.ok(aioEmployeeManagerBusiness.doSearchChartLine(obj)).build();
//	}
//
	@Override
	public Response getAioMonthPlanDTO(Long id) {
		// TODO Auto-generated method stub
		return Response.ok(aioEmployeeManagerBusiness.getAioMonthPlanDTO(id)).build();
	}

	@Override
	public Response validateNewEdit(AIOStaffPlanDetailDTO obj) {
		return Response.ok(aioEmployeeManagerBusiness.validateNewEdit(obj)).build();
	}
}
