package com.viettel.aio.rest;

import com.viettel.aio.business.InCntContractBusinessImpl;
import com.viettel.aio.dto.CntContractDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

/**
 * @author hoanm1
 */

public class InCntContractRsServiceImpl implements InCntContractRsService {

	@Context
	HttpServletRequest request;
	protected final Logger log = Logger.getLogger(CntContractRsService.class);
	@Autowired
	InCntContractBusinessImpl cntContractBusinessImpl;
	
//	@Autowired
//	CntContractOrderBusinessImpl CntContractOrderBusinessImpl;
	
//	@Autowired
//	CntContractMapBusinessImpl cntContractMapBusinessImpl;
	
//	@Autowired
//	UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl;
//	@Autowired
//	private UserRoleBusinessImpl userRoleBusinessImpl;
//	@Autowired
//	BiddingPackageBusinessImpl biddingPackageBusinessImpl;

//	@Autowired
//	private KpiLogBusinessImpl kpiLogBusinessImpl;
	
//	@Override
//	public Response doSearch(CntContractDTO obj) {
//
//		// HuyPq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_CONTRACT);
//		if (obj.getContractType() == 0)
//			kpiLogDTO.setDescription(
//					Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT.toString()));
//		else
//			kpiLogDTO.setDescription(
//					Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//		// huy-end
//
//		List<CntContractDTO> ls = cntContractBusinessImpl.doSearch(obj);
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
//
//			//huy-end
//		}
//	}
//
//	@Override
//	public Response getById(Long id) {
//		CntContractDTO obj = (CntContractDTO) cntContractBusinessImpl
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
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//		//Huypq-20181108-start
//		List<CntContractDTO> mapId = cntContractBusinessImpl.findByCodeOut(obj.getCntContractId());
//		List<Long> listID = Lists.newArrayList();
//		for(CntContractDTO value : mapId) {
//			listID.add(value.getCntContractMapId());
//		}
//		cntContractBusinessImpl.deleteContract(listID);
//		if(obj.getPurchaseLst()!=null && obj.getPurchaseLst().size()>0) {
//			List<CntContractDTO> orderMap = obj.getPurchaseLst();
//			for(CntContractDTO map : orderMap){
//				if(map!=null){
//					CntContractMapDTO cntMap = new CntContractMapDTO();
//					cntMap.setCntConstractInId(obj.getCntContractId());
//					cntMap.setCntConstractOutId(map.getCntContractId());
//					cntContractMapBusinessImpl.save(cntMap);
//				}
//			}
//		}
//		//Huypq-20181108-end
//		CntContractDTO originObj = (CntContractDTO) cntContractBusinessImpl
//				.getOneById(obj.getCntContractId());
//		obj.setUpdatedUserId(objUser.getSysUserId());
//		obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
//		if (originObj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			Long id = 0l;
//			try {
//				if (!obj.getCode().equalsIgnoreCase(originObj.getCode())) {
//					CntContractDTO check = cntContractBusinessImpl.findByCode(obj);
//					if (check != null) {
//						return Response.status(Response.Status.CONFLICT).build();
//					} else {
//						id = doUpdate(obj, originObj);
//					}
//				} else {
//					id = doUpdate(obj, originObj);
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
//
//	}
//
//	private Long doUpdate(CntContractDTO obj, CntContractDTO oldObj) {
//		obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
//		UtilAttachDocumentDTO fileSearch = new UtilAttachDocumentDTO();
//		fileSearch.setObjectId(obj.getCntContractId());
//		if(obj.getContractType()==8l) {
//			fileSearch.setType("HTCT_DV");
//		} else {
//			fileSearch.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_IN);
//		}
//		List <UtilAttachDocumentDTO> fileLst =utilAttachDocumentBusinessImpl.doSearch(fileSearch);
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
//				if(obj.getContractType()==8l) {
//					file.setType("HTCT_DV");
//					file.setDescription("File đính kèm hợp đồng đầu vào hạ tầng cho thuê");
//				} else {
//					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_IN);
//					file.setDescription(Constants.FileDescription.get(file.getType()));
//				}
//				file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//				file.setStatus("1");
//				utilAttachDocumentBusinessImpl.save(file);
//			}
//		return cntContractBusinessImpl.update(obj);
////		Long id = cntContractBusinessImpl.update(obj);
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
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//
//		CntContractDTO existing = (CntContractDTO) cntContractBusinessImpl
//				.findByCode(obj);
//		Long id =0l;
//		if (existing != null) {
//			return Response.status(Response.Status.CONFLICT).build();
//		} else {
//			try{
//				HttpServletRequest test = request;
//			boolean check = test == null;
//			System.out.println(check);
//			obj.setCreatedUserId(objUser.getSysUserId());
//			obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
//			obj.setStatus(1L);
//			obj.setState(1L);
//			obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//			id = cntContractBusinessImpl.save(obj);
//			obj.setCntContractId(id);
//
//			for(UtilAttachDocumentDTO file : obj.getFileLst()){
//				file.setObjectId(id);
//				if(obj.getContractType()==8l) {
//					file.setType("HTCT_DV");
//					file.setDescription("File đính kèm hợp đồng đầu vào hạ tầng cho thuê");
//				} else {
//					file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_IN);
//					file.setDescription(Constants.FileDescription.get(file.getType()));
//				}
//				file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
//				file.setStatus("1");
//				utilAttachDocumentBusinessImpl.save(file);
//			}
//			//Huypq-20181108-start
////			List<CntContractDTO> orderMap = obj.getPurchaseLst(); ---Huypq-20190924-comment-start
////			for(CntContractDTO map : orderMap){
////				CntContractMapDTO cntMap = new CntContractMapDTO();
////				if(map!=null){
////					cntMap.setCntConstractInId(obj.getCntContractId());
////					cntMap.setCntConstractOutId(map.getCntContractId());
////					cntContractMapBusinessImpl.save(cntMap);
////				}
////			}  ---Huypq-comment-end
//			//Huypq-20181108-end
//			obj.setCntContractId(id);
//			}catch(Exception e){
//				kpiLogDTO.setReason(e.toString());
//				e.printStackTrace();
//			}
//
//			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//			kpiLogDTO.setTransactionCode(obj.getCode());
//
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
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//
//		CntContractDTO obj = (CntContractDTO) cntContractBusinessImpl
//				.getOneById(cnt.getCntContractId());
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			obj.setStatus(0L);
//			obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
//			Long id = 0l;
//			try {
//				id = cntContractBusinessImpl.update(obj);
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
//		String result = cntContractBusinessImpl.delete(ids,
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
//		List<CntContractDTO> results = cntContractBusinessImpl
//				.getForAutoComplete(obj);
//		if (obj.getIsSize()) {
//			CntContractDTO moreObject = new CntContractDTO();
//			moreObject.setCntContractId(0l);
//			;
//			results.add(moreObject);
//		}
//		return Response.ok(results).build();
//	}
////	hoanm1_20180303_start
//	@Override
//	public Response getForAutoComplete(CntContractDTO obj) {
//		List<CntContractDTO> results = cntContractBusinessImpl.getForAutoCompleteMap(obj);
//		return Response.ok(results).build();
//	}
//
//	@Override
//	public Response getForAutoCompleteKTTS(CntContractDTO obj) {
//		List<CntContractDTO> results = cntContractBusinessImpl.getForAutoCompleteKTTS(obj);
//		return Response.ok(results).build();
//	}
//
//	@Override
//	public Response mapContract(CntContractDTO obj) {
//
//		//Huypq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.MAP_CONTRACT);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
//		//Huypq-end
//
//		CntContractDTO lstContract = cntContractBusinessImpl.findByCode(obj);
//		CntContractDTO lstContractKTTS = cntContractBusinessImpl.findByCodeKTTS(obj.getCodeKtts());
//		lstContract.setContractCodeKtts(lstContractKTTS.getCode());
//		lstContract.setContent(lstContractKTTS.getContent());
//		lstContract.setPrice(lstContractKTTS.getPrice());
//		lstContract.setSignDate(lstContractKTTS.getSignDate());
//		Long id=0l;
//		try {
//			id = cntContractBusinessImpl.update(lstContract);
//		} catch(Exception e) {
//			kpiLogDTO.setReason(e.toString());
//		}
//		kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//		kpiLogDTO.setTransactionCode(obj.getCntContractParentCode());
//		if (id == 0l) {
//			kpiLogDTO.setStatus("0");
//			kpiLogBusinessImpl.save(kpiLogDTO);
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			kpiLogDTO.setStatus("1");
//			kpiLogBusinessImpl.save(kpiLogDTO);
//			return Response.ok(lstContract).build();
//		}
//	}
//	@Override
//	public Response getListContract(CntContractDTO obj) {
//		List<CntContractDTO> ls = cntContractBusinessImpl.getListContract(obj);
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
//	public Response getListContractKTTS(CntContractDTO obj) {
//		List<CntContractDTO> ls = cntContractBusinessImpl.getListContractKTTS(obj);
//		if (ls == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			DataListDTO data = new DataListDTO();
//			data.setData(ls);
//			data.setTotal(ls.size());
//			data.setSize(ls.size());
//			data.setStart(1);
//			return Response.ok(data).build();
//		}
//	}
////	hoanm1_20180303_end

	/**hoangnh start 03012019**/
	@Override
	public Response checkMapConstract(CntContractDTO obj){
		CntContractDTO dto = cntContractBusinessImpl.checkMapConstract(obj.getCode());
		if(dto.getContractCodeKtts() != null){
			return Response.ok(dto).build();
		} else {
			return Response.status(Response.Status.OK).build();
		}
	}
	/**hoangnh end 03012019**/
}
