package com.viettel.aio.rest;

import com.viettel.aio.business.*;
import com.viettel.aio.dto.*;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

public class AIOLookupCustomerRsServiceImpl implements AIOLookupCustomerRsService{
	
	protected final Logger LOGGER = Logger.getLogger(AIOLookupCustomerRsServiceImpl.class);
	
	@Autowired
	private AIOLookupCustomerBusinessImpl aioLookupCustomerBusiness;

	@Autowired
	private AIORequestBHSCBusinessImpl aioRequestWarrantyBusiness;
	
	@Autowired
	private UserRoleBusinessImpl userRoleBusinessImpl;

	@Autowired
	private SendSmsEmailBusinessImpl sendSmsEmailBusinessImpl;
	
	@Context
    private HttpServletRequest request;

	private Response buildErrorResponse(String message) {
		return Response.ok().entity(Collections.singletonMap("error", message)).build();
	}

	@Override
	public Response doSearch(AIOContractDTO obj) {

		DataListDTO data = new DataListDTO();
		if (obj != null) {
			data = aioLookupCustomerBusiness.doSearch(obj);
		} else {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}
		return Response.ok(data).build();
	}
	
	@Override
	public Response viewDetail(Long id) {
		AIOContractDTO dto = aioLookupCustomerBusiness.viewDetail(id);
		if(dto == null){
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			return Response.ok(dto).build();
		}
	}

	@Override
	public Response doSearchContractDetail(AIOCustomerDTO obj) {
		DataListDTO data = new DataListDTO();
		if (obj != null) {
			data = aioLookupCustomerBusiness.doSearchContractDetail(obj);
		} else {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}
		return Response.ok(data).build();
	}

	@Override
	public Response doSearchVTTBDetail(AIOCustomerDTO obj) {
		DataListDTO data = new DataListDTO();
		if (obj != null) {
			data = aioLookupCustomerBusiness.doSearchVTTBDetail(obj);
		} else {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}
		return Response.ok(data).build();
	}

	@Override
	public Response viewDetailVTTB(AIOCustomerDTO obj) {
		AIOCustomerDTO dto = aioLookupCustomerBusiness.viewDetailVTTB(obj);
		if(dto == null){
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			return Response.ok(dto).build();
		}
	}

	@Override
	public Response createRequestWarranty(AIORequestBHSCDTO obj) {
		try {

			KttsUserSession session = userRoleBusinessImpl.getUserSession(request);
			Long sysUserId = session.getVpsUserInfo().getSysUserId();
			obj.setCreatedUser(sysUserId);
			aioRequestWarrantyBusiness.createRequestWarranty(obj);
			return Response.ok(Response.Status.OK).build();
		} catch (BusinessException e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse("Có lỗi xảy ra!");
		}
	}
}
