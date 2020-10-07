package com.viettel.aio.rest;

import com.viettel.aio.business.CatUnitBusinessImpl;
import com.viettel.aio.dto.CatUnitDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;
//import com.viettel.erp.constant.ApplicationConstants;
//import com.viettel.service.base.dto.ActionListDTO;
//import com.viettel.cat.utils.ExportExcel;
//import com.viettel.utils.FilterUtilities;

/**
 * @author hailh10
 */

public class CatUnitRsServiceImpl implements CatUnitRsService {

	protected final Logger log = Logger.getLogger(CatUnitRsService.class);
	@Autowired
	CatUnitBusinessImpl catUnitBusinessImpl;

	@Override
	public Response doSearch(CatUnitDTO obj) {
		List<CatUnitDTO> ls = catUnitBusinessImpl.doSearch(obj);
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
//
//	@Override
//	public Response getById(Long id) {
//		CatUnitDTO obj = (CatUnitDTO) catUnitBusinessImpl.getById(id);
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(obj).build();
//		}
//	}
//
//	@Override
//	public Response update(CatUnitDTO obj) {
//		CatUnitDTO originObj = (CatUnitDTO) catUnitBusinessImpl.getOneById(obj
//				.getCatUnitId());
//
//		if (originObj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//
//			if (!obj.getCode().equalsIgnoreCase(originObj.getCode())) {
//				CatUnitDTO check = catUnitBusinessImpl.findByCode(obj.getCode());
//				if (check != null) {
//					return Response.status(Response.Status.CONFLICT).build();
//				} else {
//					return doUpdate(obj);
//				}
//			} else {
//				return doUpdate(obj);
//			}
//
//		}
//
//	}
//
//	private Response doUpdate(CatUnitDTO obj) {
//		Long id = catUnitBusinessImpl.update(obj);
//		if (id == 0l) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(obj).build();
//		}
//	}
//
//	@Override
//	public Response add(CatUnitDTO obj) {
//		CatUnitDTO existing = (CatUnitDTO) catUnitBusinessImpl.findByCode(obj
//				.getCode());
//		if (existing != null) {
//			return Response.status(Response.Status.CONFLICT).build();
//		} else {
//			Long id = catUnitBusinessImpl.save(obj);
//			obj.setCatUnitId(id);
//			if (id == 0l) {
//				return Response.status(Response.Status.BAD_REQUEST).build();
//			} else {
//				return Response.ok(obj).build();
//			}
//		}
//	}
//
//	@Override
//	public Response delete(Long id) {
//		CatUnitDTO obj = (CatUnitDTO) catUnitBusinessImpl.getOneById(id);
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			obj.setStart(0);
//			catUnitBusinessImpl.update(obj);
//			return Response.ok(Response.Status.NO_CONTENT).build();
//		}
//	}
//
//	@Override
//	public Response deleteList(List<Long> ids) {
//		String result = catUnitBusinessImpl.delete(ids,
//				CatUnitBO.class.getName(), "CAT_UNIT_ID");
//		if (result == ParamUtils.SUCCESS) {
//			return Response.ok().build();
//		} else {
//			return Response.status(Response.Status.EXPECTATION_FAILED).build();
//		}
//	}

	@Override
	public Response getForAutoComplete(CatUnitDTO obj) {
		return Response.ok(catUnitBusinessImpl.getForAutoComplete(obj)).build();
	}

//	@Override
//	public Response getForComboBox(CatUnitDTO obj) {
//		return Response.ok(catUnitBusinessImpl.getForComboBox(obj)).build();
//	}

	
}
