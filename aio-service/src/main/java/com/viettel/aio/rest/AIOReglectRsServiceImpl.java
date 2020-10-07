package com.viettel.aio.rest;

import com.viettel.aio.business.AIOEmployeeManagerBusinessImpl;
import com.viettel.aio.business.AIOReglectManagerBusiness;
import com.viettel.aio.business.AIOReglectManagerBusinessImpl;
import com.viettel.aio.dto.*;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
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

public class AIOReglectRsServiceImpl implements AIOReglectRsService {

	protected final Logger log = Logger.getLogger(AIOReglectRsServiceImpl.class);

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
	private AIOReglectManagerBusinessImpl aioReglectManagerBusiness;

	@Autowired
	private UserRoleBusinessImpl userRoleBusiness;

	private Response buildErrorResponse(String message) {
		return Response.ok().entity(Collections.singletonMap("error", message)).build();
	}

	@Override
    public Response doSearch(AIOReglectDTO obj) {

		String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE, Constant.AdResourceKey.CONTRACT, request);
		DataListDTO data = new DataListDTO();
		if (StringUtils.isNotEmpty(sysGroupIdStr)) {
			data = aioReglectManagerBusiness.doSearch(obj);
		} else {
			data.setData(new ArrayList());
			data.setSize(0);
			data.setTotal(0);
			data.setStart(1);
		}
		return Response.ok(data).build();
    }

	@Override
	public Response getReglectDetail(Long id) {
		try {
			List<AIOReglectDetailDTO> data = aioReglectManagerBusiness.getReglectDetail(id);
			return Response.ok(data).build();
		} catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse("Có lỗi xảy ra!");
		}
	}

	@Override
	public Response getListContractCustomer(Long idCustomer) {
		List<AIOContractDTO> data = aioReglectManagerBusiness.getListContractCustomer(idCustomer);
		return Response.ok(data).build();
	}

	@Override
	public Response submitAdd(AIOReglectDTO obj) {
		try {
			KttsUserSession session = userRoleBusiness.getUserSession(request);
			SysUserCOMSDTO user = session.getVpsUserInfo();
			aioReglectManagerBusiness.submitAdd(obj, user);
			return Response.ok(Response.Status.OK).build();
		} catch (BusinessException e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse("Có lỗi xảy ra!");
		}
	}

	@Override
    public Response updatePerformer(AIOReglectDetailDTO obj) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            aioReglectManagerBusiness.updatePerformer(obj, user);
            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

	@Override
	public Response getDataAddForm() {
		try {
			List<AppParamDTO> data = aioReglectManagerBusiness.getDataAddForm();
			return Response.ok(data).build();
		} catch (BusinessException e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse("Có lỗi xảy ra!");
		}
	}

	@Override
	public Response getListCustomer(AIOCustomerDTO dto) {
		try {
			List<AIOCustomerDTO> data = aioReglectManagerBusiness.getListCustomer(dto);
			return Response.ok(data).build();
		} catch (BusinessException e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse("Có lỗi xảy ra!");
		}
	}
}
