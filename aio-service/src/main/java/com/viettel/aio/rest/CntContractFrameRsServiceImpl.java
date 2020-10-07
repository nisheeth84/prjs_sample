package com.viettel.aio.rest;

import com.viettel.aio.business.CntContractFrameBusinessImpl;
import com.viettel.aio.dto.CntContractDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author hailh10
 */

public class CntContractFrameRsServiceImpl implements CntContractFrameRsService {

	@Context
	HttpServletRequest request;
	protected final Logger log = Logger
			.getLogger(CntContractFrameRsService.class);
	@Autowired
	CntContractFrameBusinessImpl cntContractFrameBusinessImpl;

//	@Autowired
//	CntContractOrderBusinessImpl CntContractOrderBusinessImpl;

//	@Autowired
//	private UserRoleBusinessImpl userRoleBusinessImpl;
//
//	@Autowired
//	private KpiLogBusinessImpl kpiLogBusinessImpl;
//
//	@Autowired
//	UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl;

//	@Override
//	public Response doSearch(CntContractDTO obj) {
//		//Huypq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_CONTRACT);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_FRAME.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//		//huy-end
//		List<CntContractDTO> ls = cntContractFrameBusinessImpl.doSearch(obj);
//		if (ls == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			DataListDTO data = new DataListDTO();
//			data.setData(ls);
//			data.setTotal(obj.getTotalRecord());
//			data.setSize(ls.size());
//			data.setStart(1);
//			//HuyPq-start
//			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//			kpiLogDTO.setTransactionCode(obj.getKeySearch());
//			kpiLogDTO.setStatus("1");
//			kpiLogBusinessImpl.save(kpiLogDTO);
//			return Response.ok(data).build();
//			//huy-end
//		}
//
//	}
//
//	@Override
//	public Response getById(Long id) {
//		CntContractDTO obj = (CntContractDTO) cntContractFrameBusinessImpl
//				.getById(id);
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(obj).build();
//		}
//	}
//
//	@Override
//	public Response update(CntContractDTO obj) {
//
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_CONTRACT);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//
//		CntContractDTO originObj = (CntContractDTO) cntContractFrameBusinessImpl
//				.getOneById(obj.getCntContractId());
//
//		if (originObj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			Long id = 0l;
//			try {
//			if (!obj.getCode().equalsIgnoreCase(originObj.getCode())) {
//				CntContractDTO check = cntContractFrameBusinessImpl.findByCode(obj);
//				if (check != null) {
//					return Response.status(Response.Status.CONFLICT).build();
//				} else {
//					id = doUpdate(obj);
//				}
//			} else {
//				id = doUpdate(obj);
//			}
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
//	private Long doUpdate(CntContractDTO obj) {
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
//		obj.setUpdatedUserId(objUser.getSysUserId());
//		obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
//		CntContractOrderDTO criteria = new CntContractOrderDTO();
//		criteria.setCntContractId(obj.getCntContractId());
//
//
//		UtilAttachDocumentDTO fileSearch = new UtilAttachDocumentDTO();
//		fileSearch.setObjectId(obj.getCntContractId());
//		fileSearch.setType(Constants.FILETYPE.CONTRACT_FRAME);
//		List <UtilAttachDocumentDTO> fileLst =utilAttachDocumentBusinessImpl.doSearch(fileSearch);
//
//		if(fileLst != null)
//			for(UtilAttachDocumentDTO file : fileLst){
//				if(file != null){
//					utilAttachDocumentBusinessImpl.delete(file);
//				}
//			}
//
//		if(obj.getFileLst() != null)
//			for(UtilAttachDocumentDTO file : obj.getFileLst()){
//				file.setObjectId(obj.getCntContractId());
//
//				if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
//					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_OUT);
//				else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
//					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_IN);
//				else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
//					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT);
//				else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
//					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN);
//				else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
//					file.setType(Constants.FILETYPE.CONTRACT_MATERIAL);
//				else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_FRAME)
//					file.setType(Constants.FILETYPE.CONTRACT_FRAME);
//
//				file.setDescription(Constants.FileDescription.get(file.getType()));
//				file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//				file.setCreatedUserId(obj.getUpdatedUserId());
//				file.setStatus("1");
//				utilAttachDocumentBusinessImpl.save(file);
//			}
//
//
//		return cntContractFrameBusinessImpl.update(obj);
//
////		Long id = cntContractFrameBusinessImpl.update(obj);
////		if (id == 0l) {
////			return Response.status(Response.Status.BAD_REQUEST).build();
////		} else {
////			return Response.ok(obj).build();
////		}
//	}
//
//	@Override
//	public Response add(CntContractDTO obj) {
//
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_CONTRACT);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_FRAME.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//
//		CntContractDTO existing = (CntContractDTO) cntContractFrameBusinessImpl
//				.findByCode(obj);
//		Long id = 0l;
//		if (existing != null) {
//			return Response.status(Response.Status.CONFLICT).build();
//		} else {
//			try {
//				HttpServletRequest test = request;
//				boolean check = test == null;
//				System.out.println(check);
//				obj.setCreatedUserId(objUser.getSysUserId());
//				obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
//				obj.setStatus(1L);
//				obj.setState(1L);
//				obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//				id = cntContractFrameBusinessImpl.save(obj);
//				obj.setCntContractId(id);
//
//				for(UtilAttachDocumentDTO file : obj.getFileLst()){
//					file.setObjectId(id);
//					if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
//						file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_OUT);
//					else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
//						file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_IN);
//					else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
//						file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT);
//					else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
//						file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN);
//					else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
//						file.setType(Constants.FILETYPE.CONTRACT_MATERIAL);
//					else if(obj.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_FRAME)
//						file.setType(Constants.FILETYPE.CONTRACT_FRAME);
//					file.setDescription(Constants.FileDescription.get(file.getType()));
//					file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//					file.setStatus("1");
//					utilAttachDocumentBusinessImpl.save(file);
//				}
//				obj.setCntContractId(id);
//			} catch (Exception e) {
//				kpiLogDTO.setReason(e.toString());
//				e.printStackTrace();
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
//
//		}
//	}
//
//	@Override
//	public Response delete(CntContractDTO cnt) {
//
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_CONTRACT);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_FRAME.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//
//		CntContractDTO obj = (CntContractDTO) cntContractFrameBusinessImpl
//				.getOneById(cnt.getCntContractId());
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			obj.setStatus(0L);
//			obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
//			Long id = 0l;
//			try {
//				id = cntContractFrameBusinessImpl.update(obj);
//			} catch(Exception e) {
//				kpiLogDTO.setReason(e.toString());
//			}
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
//	public Response deleteList(List<Long> ids) {
//		String result = cntContractFrameBusinessImpl.delete(ids,
//				CntContractBO.class.getName(), "CNT_CONTRACT_ID");
//
//		if (result == ParamUtils.SUCCESS) {
//			return Response.ok().build();
//		} else {
//			return Response.status(Response.Status.EXPECTATION_FAILED).build();
//		}
//	}
//
//	@Override
//	public Response findByAutoComplete(CntContractDTO obj) {
//		List<CntContractDTO> results = cntContractFrameBusinessImpl
//				.getForAutoComplete(obj);
//		if (obj.getIsSize()) {
//			CntContractDTO moreObject = new CntContractDTO();
//			moreObject.setCntContractId(0l);
//			;
//			results.add(moreObject);
//		}
//		return Response.ok(results).build();
//	}

	// hoanm1_20180303_start
	@Override
	public Response getForAutoComplete(CntContractDTO obj) {
		List<CntContractDTO> results = cntContractFrameBusinessImpl.getForAutoComplete(obj);
		return Response.ok(results).build();
	}
	// hoanm1_20180303_end
	
//	hungtd_20190114_start
//	@Override
//	public Response getForAuto(CntContractDTO obj) {
//		List<CntContractDTO> results = cntContractFrameBusinessImpl
//				.getForAuto(obj);
//		return Response.ok(results).build();
//	}
//	hungtd_20190114_end
}
