package com.viettel.aio.rest;

import com.viettel.aio.business.CntContractAcceptanceBusinessImpl;
import com.viettel.aio.business.CntContractBusinessImpl;
import com.viettel.aio.business.CntContractPaymentBusinessImpl;
import com.viettel.aio.dto.CntContractDTO;
import com.viettel.aio.dto.CntContractPaymentCstDTO;
import com.viettel.aio.dto.CntContractPaymentDTO;
import com.viettel.cat.constant.Constants;
import com.viettel.coms.business.KpiLogBusinessImpl;
import com.viettel.coms.business.UtilAttachDocumentBusinessImpl;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.sql.Timestamp;
import java.util.List;

/**
 * @author hailh10
 */

public class CntContractPaymentRsServiceImpl implements CntContractPaymentRsService {

    protected final Logger log = Logger.getLogger(CntContractPaymentRsService.class);
    @Autowired
    CntContractPaymentBusinessImpl cntContractPaymentBusinessImpl;

    @Context
    HttpServletRequest request;
    @Autowired
    private UserRoleBusinessImpl userRoleBusinessImpl;
    @Autowired
    UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl;

    @Autowired
    CntContractAcceptanceBusinessImpl cntContractAcceptanceBusinessImpl;

    @Autowired
    CntContractBusinessImpl cntContractBusinessImpl;

    @Autowired
    private KpiLogBusinessImpl kpiLogBusinessImpl; //huypq-add

    @Override
    public Response doSearch(CntContractPaymentDTO obj) {

        // HuyPq-start
//        KpiLogDTO kpiLogDTO = new KpiLogDTO();
//        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_CONTRACT_PAYMENT);
//        kpiLogDTO.setDescription(
//                Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_PAYMENT.toString()));
//        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        List<CntContractPaymentDTO> ls = cntContractPaymentBusinessImpl.doSearch(obj);
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(obj.getTotalRecord());
            data.setSize(ls.size());
            data.setStart(1);
            //huypq-start
//            kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//            kpiLogDTO.setTransactionCode(obj.getKeySearch());
//            kpiLogDTO.setStatus("1");
//            kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.ok(data).build();
            //huy-end
        }
    }


	@Override
	public Response update(CntContractPaymentDTO obj) {
		CntContractPaymentDTO originObj = (CntContractPaymentDTO) cntContractPaymentBusinessImpl.getOneById(obj.getCntContractPaymentId());

		if (originObj == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
			//lấy thông tin chưa sysgroupid
			obj.setUpdatedUserId(objUser.getSysUserId());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());

//			if (!obj.getPaymentPhase().equalsIgnoreCase(originObj.getPaymentPhase())) {
//				CntContractPaymentDTO check = cntContractPaymentBusinessImpl.findByPaymentPhase(obj);
//				if (check != null) {
//					return Response.status(Response.Status.CONFLICT).build();
//				} else {
					return doUpdate(obj);
//				}
//			} else {
//				return doUpdate(obj);
//			}

		}

	}

	private Response doUpdate(CntContractPaymentDTO obj) {

		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_CONTRACT_PAYMENT);
		kpiLogDTO.setDescription(
				Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_PAYMENT.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end

		CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
		String fileType = "";
		if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
			fileType = Constants.FILETYPE.CONTRACT_OUT_PAYMENT;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
			fileType = Constants.FILETYPE.CONTRACT_IN_PAYMENT;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
			fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN_PAYMENT;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
			fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT_PAYMENT;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
			fileType = Constants.FILETYPE.CONTRACT_MATERIAL_PAYMENT;
		else if(contract.getContractType() == 7l)
			fileType = "HTCT_DR";
		else if(contract.getContractType() == 8l)
			fileType = "HTCT_DV";

		obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));

		UtilAttachDocumentDTO fileSearch = new UtilAttachDocumentDTO();
		fileSearch.setObjectId(obj.getCntContractPaymentId());
		fileSearch.setType(fileType);
		List <UtilAttachDocumentDTO> fileLst = utilAttachDocumentBusinessImpl.doSearch(fileSearch);
		if(fileLst != null)
			for(UtilAttachDocumentDTO file : fileLst){
				if(file != null){
					utilAttachDocumentBusinessImpl.delete(file);
				}
			}

		if(obj.getAttachmentLst() != null)
			for(UtilAttachDocumentDTO file : obj.getAttachmentLst()){
				file.setObjectId(obj.getCntContractPaymentId());
				file.setType(fileType);
				file.setDescription(Constants.FileDescription.get(file.getType()));
				file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
				file.setStatus("1");
				utilAttachDocumentBusinessImpl.save(file);
			}
		List<CntContractPaymentCstDTO> lstCst = cntContractPaymentBusinessImpl.getPaymentCstByPaymentId(obj);
		cntContractPaymentBusinessImpl.removePaymentCst(lstCst);
		cntContractPaymentBusinessImpl.addConstrucionPayment(obj);
		cntContractPaymentBusinessImpl.addGoodsPayment(obj);
		cntContractPaymentBusinessImpl.addStockTransPayment(obj);
		Long id=0l;
		try {
			id = cntContractPaymentBusinessImpl.update(obj);
		} catch(Exception e) {
			kpiLogDTO.setReason(e.toString());
		}
		kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
		kpiLogDTO.setTransactionCode(obj.getPaymentPhase());

		if (id == 0l) {
			kpiLogDTO.setStatus("0");
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			kpiLogDTO.setStatus("1");
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.ok(obj).build();
		}
	}

	@Override
	public Response add(CntContractPaymentDTO obj) {

		// HuyPq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_CONTRACT_PAYMENT);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_PAYMENT.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end

		CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
		String fileType = "";
		if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
			fileType = Constants.FILETYPE.CONTRACT_OUT_PAYMENT;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
			fileType = Constants.FILETYPE.CONTRACT_IN_PAYMENT;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
			fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN_PAYMENT;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
			fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT_PAYMENT;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
			fileType = Constants.FILETYPE.CONTRACT_MATERIAL_PAYMENT;
		else if(contract.getContractType() == 7l)
			fileType = "HTCT_DR";
		else if(contract.getContractType() == 8l)
			fileType = "HTCT_DV";

		CntContractPaymentDTO existing = (CntContractPaymentDTO) cntContractPaymentBusinessImpl.findByPaymentPhase(obj);
		if (existing != null) {
			return Response.status(Response.Status.CONFLICT).build();
		} else {
//			obj.setCreatedUserId(objUser.getSysUserId());
//			obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
			obj.setStatus(1l);
			obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
			Long id=0l;
			try {
				id = cntContractPaymentBusinessImpl.save(obj);
			} catch(Exception e) {
//				kpiLogDTO.setReason(e.toString());
			}
			obj.setCntContractPaymentId(id);
			cntContractPaymentBusinessImpl.addConstrucionPayment(obj);
			cntContractPaymentBusinessImpl.addGoodsPayment(obj);
			cntContractPaymentBusinessImpl.addStockTransPayment(obj);
			for(UtilAttachDocumentDTO file : obj.getAttachmentLst()){
				file.setObjectId(id);
				file.setType(fileType);
				file.setDescription(Constants.FileDescription.get(file.getType()));
				file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
				file.setStatus("1");
				utilAttachDocumentBusinessImpl.save(file);
			}
			obj.setCntContractPaymentId(id);
//			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//			kpiLogDTO.setTransactionCode(obj.getPaymentPhase());
			if (id == 0l) {
//				kpiLogDTO.setStatus("0");
//				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
//				kpiLogDTO.setStatus("1");
//				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.ok(obj).build();
			}
		}
	}

	@Override
	public Response delete(CntContractPaymentDTO id) {

		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_CONTRACT_PAYMENT);
		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_PAYMENT.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end

		CntContractPaymentDTO obj = (CntContractPaymentDTO) cntContractPaymentBusinessImpl.getOneById(id.getCntContractPaymentId());
		if (obj == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			//lấy thông tin chưa sysgroupid
			obj.setUpdatedUserId(objUser.getSysUserId());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
			obj.setStatus(0l);
			obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
			Long ids=0l;
			try {
				ids = cntContractPaymentBusinessImpl.update(obj);
			} catch(Exception e) {
				kpiLogDTO.setReason(e.toString());
			}
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			kpiLogDTO.setTransactionCode(obj.getPaymentPhase());
			if (ids == 0l) {
				kpiLogDTO.setStatus("0");
			} else {
				kpiLogDTO.setStatus("1");
			}
			kpiLogBusinessImpl.save(kpiLogDTO);
			return Response.ok(Response.Status.NO_CONTENT).build();
		}
	}

	@Override
	public Response findByAutoComplete(CntContractPaymentDTO obj) {
		List<CntContractPaymentDTO> results = cntContractPaymentBusinessImpl.getForAutoComplete(obj);
		if (obj.getIsSize()){
			CntContractPaymentDTO moreObject = new CntContractPaymentDTO();
			moreObject.setCntContractPaymentId(0l);;
			results.add(moreObject);
		}
		return Response.ok(results).build();
	}

}
