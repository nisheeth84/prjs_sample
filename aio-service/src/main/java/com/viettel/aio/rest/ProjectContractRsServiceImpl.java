package com.viettel.aio.rest;

import com.viettel.aio.business.ProjectContractBusinessImpl;
import com.viettel.aio.dto.ProjectContractDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.List;

public class ProjectContractRsServiceImpl implements ProjectContractRsService {

	@Context
	HttpServletRequest request;
	protected final Logger log = Logger.getLogger(CntContractRsService.class);
	@Autowired
	ProjectContractBusinessImpl projectContractBusinessImpl;
//	@Autowired
//	private KpiLogBusinessImpl kpiLogBusinessImpl;
//	@Autowired
//	private UserRoleBusinessImpl userRoleBusinessImpl;
//	@Autowired
//	UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl;
//
//	@Override
//	public Response update(ProjectContractDTO obj) {
//
//		// HuyPq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_PROJECT_CONTRACT);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.PROJECT_CONTRACT.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//		// huy-end
//
//		ProjectContractDTO originObj = (ProjectContractDTO) projectContractBusinessImpl
//				.getOneById(obj.getProjectContractId());
//		obj.setUpdatedUserId(objUser.getSysUserId());
//		obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
//
//		if (originObj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			Long id = 0l;
//			try {
//				boolean isUpdate = false;
//				if (!obj.getCode().equalsIgnoreCase(originObj.getCode())) {
//					ProjectContractDTO check = projectContractBusinessImpl.findByCode(obj
//							.getCode());
//					if (check != null) {
//						return Response.status(Response.Status.CONFLICT).build();
//					} else {
//						isUpdate = true;
//					}
//				} else {
//					isUpdate = true;
//				}
//				if (isUpdate) {
//					obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
//					id = projectContractBusinessImpl.update(obj);
//
//					UtilAttachDocumentDTO fileSearch = new UtilAttachDocumentDTO();
//					fileSearch.setObjectId(obj.getProjectContractId());
//					fileSearch.setType(Constants.FILETYPE.PROJECT_CONTRACT);
//					List <UtilAttachDocumentDTO> fileLst =utilAttachDocumentBusinessImpl.doSearch(fileSearch);
//					if(fileLst != null) {
//						for(UtilAttachDocumentDTO file : fileLst){
//							if(file != null){
//								utilAttachDocumentBusinessImpl.delete(file);
//							}
//						}
//					}
//					if(obj.getFileLst() != null) {
//						for(UtilAttachDocumentDTO file : obj.getFileLst()){
//							file.setObjectId(obj.getProjectContractId());
//							file.setType(Constants.FILETYPE.PROJECT_CONTRACT);
//							file.setDescription(Constants.FileDescription.get(file.getType()));
//							file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//							file.setCreatedUserId(obj.getUpdatedUserId());
//							file.setStatus("1");
//							utilAttachDocumentBusinessImpl.save(file);
//						}
//					}
//				}
//			} catch(Exception e) {
//				kpiLogDTO.setReason(e.toString());
//			}
//			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//			kpiLogDTO.setTransactionCode(obj.getCode());
//			if (id == 0l) {
//				kpiLogDTO.setStatus("0");
//				kpiLogBusinessImpl.save(kpiLogDTO);
//				return Response.status(Response.Status.BAD_REQUEST).build();
//			} else {
//				kpiLogDTO.setStatus("1");
//				kpiLogBusinessImpl.save(kpiLogDTO);
//				return Response.ok(obj).build();
//			}
//		}
//	}
//
//	@Override
//	public Response add(ProjectContractDTO obj) {
//
//		// HuyPq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_PROJECT_CONTRACT);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.PROJECT_CONTRACT.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//		// huy-end
//
//		ProjectContractDTO existing = (ProjectContractDTO) projectContractBusinessImpl
//				.findByCode(obj.getCode());
//		Long id = 0l;
//		if (existing != null) {
//			return Response.status(Response.Status.CONFLICT).build();
//		} else {
//			try {
//				obj.setCreatedUserId(objUser.getSysUserId());
//				obj.setCreatedGroupId(objUser.getVpsUserInfo()
//						.getDepartmentId());
//				obj.setStatus(1L);
//				obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//				id = projectContractBusinessImpl.save(obj);
//				obj.setProjectContractId(id);
//				for(UtilAttachDocumentDTO file : obj.getFileLst()){
//					file.setObjectId(id);
//					file.setType(Constants.FILETYPE.PROJECT_CONTRACT);
//					file.setDescription(Constants.FileDescription.get(file.getType()));
//					file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//					file.setStatus("1");
//					utilAttachDocumentBusinessImpl.save(file);
//				}
//			} catch (Exception e) {
//				e.printStackTrace();
//				kpiLogDTO.setReason(e.toString());
//			}
//			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//			kpiLogDTO.setTransactionCode(obj.getCode());
//			if (id == 0l) {
//				kpiLogDTO.setStatus("0");
//				kpiLogBusinessImpl.save(kpiLogDTO);
//				return Response.status(Response.Status.BAD_REQUEST).build();
//			} else {
//				kpiLogDTO.setStatus("1");
//				kpiLogBusinessImpl.save(kpiLogDTO);
//				return Response.ok(obj).build();
//			}
//		}
//	}
//
//	@Override
//	public Response delete(ProjectContractDTO cnt) {
//
//		// HuyPq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_PROJECT_CONTRACT);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.PROJECT_CONTRACT.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//		// huy-end
//
//		ProjectContractDTO obj = (ProjectContractDTO) projectContractBusinessImpl
//				.getOneById(cnt.getProjectContractId());
//
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			obj.setUpdatedUserId(objUser.getSysUserId());
//			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
//			obj.setStatus(0L);
//			obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
//			Long id=0l;
//			try {
//				id=projectContractBusinessImpl.update(obj);
//			} catch(Exception e) {
//				e.printStackTrace();
//				kpiLogDTO.setReason(e.toString());
//			}
//
//			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//			kpiLogDTO.setTransactionCode(obj.getCode());
//			if (id == 0l) {
//				kpiLogDTO.setStatus("0");
//			} else {
//				kpiLogDTO.setStatus("1");
//			}
//			kpiLogBusinessImpl.save(kpiLogDTO);
//			return Response.ok(Response.Status.NO_CONTENT).build();
//		}
//	}
//
//	@Override
//	public Response doSearch(ProjectContractDTO obj) {
//
//		// HuyPq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_PROJECT_CONTRACT);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.PROJECT_CONTRACT.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//		// huy-end
//
//		List<ProjectContractDTO> ls = projectContractBusinessImpl.doSearch(obj);
//		if (ls == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			DataListDTO data = new DataListDTO();
//			data.setData(ls);
//			data.setTotal(obj.getTotalRecord());
//			data.setSize(ls.size());
//			data.setStart(1);
//			//huypq-start
//			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//			kpiLogDTO.setTransactionCode(obj.getKeySearch());
//			kpiLogDTO.setStatus("1");
//			kpiLogBusinessImpl.save(kpiLogDTO);
//			return Response.ok(data).build();
//			//huy-end
//		}
//	}

	@Override
	public Response getForAutoComplete(ProjectContractDTO obj) {
		List<ProjectContractDTO> results = projectContractBusinessImpl.getForAutoComplete(obj);
		return Response.ok(results).build();
	}

}
