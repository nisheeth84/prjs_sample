package com.viettel.aio.rest;

import com.viettel.aio.business.CatTaskBusinessImpl;
import com.viettel.cat.dto.CatTaskDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author hailh10
 */
 
public class CatTaskRsServiceImpl implements CatTaskRsService {

	protected final Logger log = Logger.getLogger(CatTaskRsService.class);
	@Autowired
	CatTaskBusinessImpl catTaskBusinessImpl;
	
	@Override
	public Response doSearch(CatTaskDTO obj) {
		List<CatTaskDTO> ls = catTaskBusinessImpl.doSearch(obj);
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
//
//	@Override
//	public Response getById(Long id) {
//		CatTaskDTO obj = (CatTaskDTO) catTaskBusinessImpl.getById(id);
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(obj).build();
//		}
//	}
//
//	@Override
//	public Response update(CatTaskDTO obj) {
//		CatTaskDTO originObj = (CatTaskDTO) catTaskBusinessImpl.getOneById(obj.getCatTaskId());
//
//		if (originObj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//
//				if (!obj.getCode().equalsIgnoreCase(originObj.getCode())) {
//					CatTaskDTO check = catTaskBusinessImpl.findByCode(obj.getCode());
//					if (check != null) {
//						return Response.status(Response.Status.CONFLICT).build();
//					} else {
//						return doUpdate(obj);
//					}
//				} else {
//					return doUpdate(obj);
//				}
//
//		}
//
//	}
//
//	private Response doUpdate(CatTaskDTO obj) {
//		obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
////		obj.setUpdatedby(catTaskBusinessImpl.getSessionInfo().getUserId());
//
//		Long id = catTaskBusinessImpl.update(obj);
//		if (id == 0l) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(obj).build();
//		}
//	}
//
//	@Override
//	public Response add(CatTaskDTO obj) {
//		CatTaskDTO existing = (CatTaskDTO) catTaskBusinessImpl.findByCode(obj.getCode());
//		if (existing != null) {
//			return Response.status(Response.Status.CONFLICT).build();
//		} else {
//			obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//			obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
//			Long id = catTaskBusinessImpl.save(obj);
//			obj.setCatTaskId(id);
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
//		CatTaskDTO obj = (CatTaskDTO) catTaskBusinessImpl.getOneById(id);
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			obj.setStatus("0");
//			obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
//			catTaskBusinessImpl.update(obj);
//			return Response.ok(Response.Status.NO_CONTENT).build();
//		}
//	}
//
//
	@Override
	public Response findByAutoComplete(CatTaskDTO obj) {
		List<CatTaskDTO> results = catTaskBusinessImpl.getForAutoComplete(obj);
		return Response.ok(results).build();
	}
}
