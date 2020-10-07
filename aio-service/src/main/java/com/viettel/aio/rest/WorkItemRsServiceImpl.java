package com.viettel.aio.rest;

import com.viettel.aio.business.WorkItemBusinessImpl;
import com.viettel.aio.dto.WorkItemDTO;

import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author hailh10
 */
 
public class WorkItemRsServiceImpl implements WorkItemRsService {

	protected final Logger log = Logger.getLogger(WorkItemRsService.class);
	@Autowired
	WorkItemBusinessImpl workItemBusinessImpl;
	
	@Override
	public Response doSearch(WorkItemDTO obj) {
		List<WorkItemDTO> ls = workItemBusinessImpl.doSearch(obj);
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
	public Response findByAutoComplete(WorkItemDTO obj) {
		List<WorkItemDTO> results = workItemBusinessImpl.getForAutoComplete(obj);
		if (obj.getIsSize()){
			WorkItemDTO moreObject = new WorkItemDTO();
			moreObject.setWorkItemId(0l);;
			
			results.add(moreObject);
		}
		return Response.ok(results).build();
	}
//	@Override
//	public Response getFileDrop() {
//		// Hieunn
//		// get list filedrop form APP_PARAM with PAR_TYPE =
//		// 'SHIPMENT_DOCUMENT_TYPE' and Status=1
//		return Response.ok(workItemBusinessImpl.getFileDrop()).build();
//	}
//
//	@Override
//	public Response getForAutoCompleteWorkItemHTCT(CatWorkItemTypeHTCTDTO obj) {
//		List<CatWorkItemTypeHTCTDTO> results = workItemBusinessImpl.getForAutoCompleteWorkItemHTCT(obj);
//		if (obj.getIsSize()){
//			CatWorkItemTypeHTCTDTO moreObject = new CatWorkItemTypeHTCTDTO();
//
//			results.add(moreObject);
//		}
//		return Response.ok(results).build();
//	}
//
//
//	@Override
//	public Response getForAutoCompleteCatTaskHTCT(CatTaskHTCTDTO obj) {
//		List<CatTaskHTCTDTO> results = workItemBusinessImpl.getForAutoCompleteCatTaskHTCT(obj);
//		if (obj.getIsSize()){
//			CatTaskHTCTDTO moreObject = new CatTaskHTCTDTO();
//
//			results.add(moreObject);
//		}
//		return Response.ok(results).build();
//	}
//
//
//	@Override
//	public Response doSearchWorkItemHTCT(CatWorkItemTypeHTCTDTO obj) {
//		List<CatWorkItemTypeHTCTDTO> ls = workItemBusinessImpl.doSearchWorkItemHTCT(obj);
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
//
//	@Override
//	public Response doSearchTaskHTCT(CatTaskHTCTDTO obj) {
//		List<CatTaskHTCTDTO> ls = workItemBusinessImpl.doSearchTaskHTCT(obj);
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
//
//	@Override
//	public Response doSearchProvince(CatTaskHTCTDTO obj) {
//		List<CatTaskHTCTDTO> ls = workItemBusinessImpl.doSearchProvince(obj);
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
//
//	@Override
//	public Response getForAutoCompleteProvince(CatTaskHTCTDTO obj) {
//		List<CatTaskHTCTDTO> results = workItemBusinessImpl.getForAutoCompleteProvince(obj);
//		if (obj.getIsSize()){
//			CatTaskHTCTDTO moreObject = new CatTaskHTCTDTO();
//
//			results.add(moreObject);
//		}
//		return Response.ok(results).build();
//	}
//
//
//	@Override
//	public Response doSearchProjectHTCT(ProjectEstimatesDTO obj) {
//		List<ConstructionProjectDTO> ls = workItemBusinessImpl.doSearchProjectHTCT(obj);
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
//
//	@Override
//	public Response getForAutoCompleteProjectHTCT(ProjectEstimatesDTO obj) {
//		List<ConstructionProjectDTO> results = workItemBusinessImpl.getForAutoCompleteProjectHTCT(obj);
//		if (obj.getIsSize()){
//			ConstructionProjectDTO moreObject = new ConstructionProjectDTO();
//
//			results.add(moreObject);
//		}
//		return Response.ok(results).build();
//	}
//
//	@Override
//	public Response doSearchConstrHTCT(ProjectEstimatesDTO obj) {
//		List<ProjectEstimatesDTO> ls = workItemBusinessImpl.doSearchConstrHTCT(obj);
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
//
//	@Override
//	public Response getForAutoCompleteConstrHTCT(ProjectEstimatesDTO obj) {
//		List<ProjectEstimatesDTO> results = workItemBusinessImpl.getForAutoCompleteConstrHTCT(obj);
//		if (obj.getIsSize()){
//			ProjectEstimatesDTO moreObject = new ProjectEstimatesDTO();
//
//			results.add(moreObject);
//		}
//		return Response.ok(results).build();
//	}
		
}
