package com.viettel.aio.rest;

import com.viettel.aio.dto.ConstructionDTO;
import com.viettel.aio.business.ConstructionBusinessImpl;

import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author hailh10
 */
 
public class ConstructionRsServiceImpl implements ConstructionRsService {

	protected final Logger log = Logger.getLogger(ConstructionRsService.class);
	@Autowired
	ConstructionBusinessImpl constructionBusinessImpl;
	
	@Override
	public Response doSearch(ConstructionDTO obj) {
		List<ConstructionDTO> ls = constructionBusinessImpl.doSearch(obj);
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
//		ConstructionDTO obj = (ConstructionDTO) constructionBusinessImpl.getById(id);
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(obj).build();
//		}
//	}
//
//
//
	@Override
	public Response findByAutoComplete(ConstructionDTO obj) {
		List<ConstructionDTO> results = constructionBusinessImpl.getForAutoComplete(obj);
		if (obj.getIsSize()){
			ConstructionDTO moreObject = new ConstructionDTO();
			moreObject.setConstructionId(0l);;
			results.add(moreObject);
		}
		return Response.ok(results).build();
	}
	
//	@Override
//	public Response getForAutoCompleteHTCT(ConstructionDTO obj) {
//		List<ConstructionDTO> results = constructionBusinessImpl.getForAutoCompleteHTCT(obj);
//		if (obj.getIsSize()){
//			ConstructionDTO moreObject = new ConstructionDTO();
//			moreObject.setConstructionId(0l);;
//			results.add(moreObject);
//		}
//		return Response.ok(results).build();
//	}
//	@Override
//	public Response doSearchHTCT(ConstructionDTO obj) {
//		List<ConstructionDTO> ls = constructionBusinessImpl.doSearchHTCT(obj);
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
//	public Response getForAutoCompleteIn(ConstructionDTO obj) {
//		List<ConstructionDTO> results = constructionBusinessImpl.getForAutoCompleteIn(obj);
////		if (obj.getIsSize()){
////			ConstructionDTO moreObject = new ConstructionDTO();
////			moreObject.setConstructionId(0l);;
////			results.add(moreObject);
////		}
//		return Response.ok(results).build();
//	}
//
//	@Override
//	public Response doSearchIn(ConstructionDTO obj) {
//		List<ConstructionDTO> ls = constructionBusinessImpl.doSearchIn(obj);
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
//	//Huypq-20190923-start
//	@Override
//	public Response doSearchInHTCT(ConstructionDTO obj) {
//		List<ConstructionDTO> ls = constructionBusinessImpl.doSearchInHTCT(obj);
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
//	public Response getForAutoCompleteInHTCT(ConstructionDTO obj) {
//		List<ConstructionDTO> results = constructionBusinessImpl.getForAutoCompleteInHTCT(obj);
//		return Response.ok(results).build();
//	}
//	//huy-end
}
