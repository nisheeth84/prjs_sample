package com.viettel.aio.rest;

import com.viettel.aio.business.CntContractAcceptanceBusinessImpl;
import com.viettel.aio.business.CntContractBusinessImpl;
import com.viettel.aio.dto.CntContractAcceptanceCstDTO;
import com.viettel.aio.dto.CntContractAcceptanceDTO;
import com.viettel.aio.dto.CntContractDTO;
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
import viettel.passport.client.UserToken;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.sql.Timestamp;
import java.util.List;

/**
 * @author hailh10
 */

public class CntContractAcceptanceRsServiceImpl implements CntContractAcceptanceRsService {

    protected final Logger log = Logger.getLogger(CntContractAcceptanceRsService.class);
    @Autowired
    CntContractAcceptanceBusinessImpl cntContractAcceptanceBusinessImpl;

    @Context
    HttpServletRequest request;
    @Autowired
    private UserRoleBusinessImpl userRoleBusinessImpl;

    @Autowired
    CntContractBusinessImpl cntContractBusinessImpl;

    @Autowired
    private UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl;

    @Autowired
    private KpiLogBusinessImpl kpiLogBusinessImpl; //huypq-add

    @Override
    public Response doSearch(CntContractAcceptanceDTO obj) {

        // HuyPq-start
//        KpiLogDTO kpiLogDTO = new KpiLogDTO();
//        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_CONTRACT_ACCEPTANCE);
//        kpiLogDTO.setDescription(
//                Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_ACCEPTANCE.toString()));
//        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        List<CntContractAcceptanceDTO> ls = cntContractAcceptanceBusinessImpl.doSearch(obj);
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

//    @Override
//    public Response getById(Long id) {
//        CntContractAcceptanceDTO obj = (CntContractAcceptanceDTO) cntContractAcceptanceBusinessImpl.getById(id);
//        if (obj == null) {
//            return Response.status(Response.Status.BAD_REQUEST).build();
//        } else {
//            return Response.ok(obj).build();
//        }
//    }

	@Override
	public Response update(CntContractAcceptanceDTO obj) {
//		CntContractAcceptanceDTO originObj = (CntContractAcceptanceDTO) cntContractAcceptanceBusinessImpl
//				.getOneById(obj.getCntContractAcceptanceId());

		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);

		//lấy thông tin chưa sysgroupid
//		UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");
		obj.setUpdatedUserId(objUser.getSysUserId());
		obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());

		return doUpdate(obj);
	}

	private Response doUpdate(CntContractAcceptanceDTO obj) {
		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_CONTRACT_ACCEPTANCE);
		kpiLogDTO.setDescription(
				Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_ACCEPTANCE.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end
		obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));

		CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
		String fileType = "";
		if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
			fileType = Constants.FILETYPE.CONTRACT_OUT_ACCEPTANCE;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
			fileType = Constants.FILETYPE.CONTRACT_IN_ACCEPTANCE;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
			fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN_ACCEPTANCE;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
			fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT_ACCEPTANCE;
		else if(contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
			fileType = Constants.FILETYPE.CONTRACT_MATERIAL_ACCEPTANCE;

		UtilAttachDocumentDTO fileSearch = new UtilAttachDocumentDTO();
		fileSearch.setObjectId(obj.getCntContractAcceptanceId());
		fileSearch.setType(fileType);
		List <UtilAttachDocumentDTO> fileLst =utilAttachDocumentBusinessImpl.doSearch(fileSearch);

		if(fileLst != null)
			for(UtilAttachDocumentDTO file : fileLst){
				if(file != null){
					utilAttachDocumentBusinessImpl.delete(file);
				}
			}

		if(obj.getAttachmentLst() != null)
			for(UtilAttachDocumentDTO file : obj.getAttachmentLst()){
				file.setObjectId(obj.getCntContractAcceptanceId());
				file.setType(fileType);
				file.setDescription(Constants.FileDescription.get(file.getType()));
				file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
				file.setStatus("1");
				utilAttachDocumentBusinessImpl.save(file);
		}
		List<CntContractAcceptanceCstDTO> lstCst = cntContractAcceptanceBusinessImpl.getAcceptanceCstByAcceptanceId(obj);
		cntContractAcceptanceBusinessImpl.removeAcceptanceCst(lstCst);
		cntContractAcceptanceBusinessImpl.addConstrucionAcceptance(obj);
		cntContractAcceptanceBusinessImpl.addGoodsAcceptance(obj);
		cntContractAcceptanceBusinessImpl.addStockTransAcceptance(obj);
		Long id=0l;
		try {
			id = cntContractAcceptanceBusinessImpl.update(obj);
		} catch(Exception e) {
			kpiLogDTO.setReason(e.toString());
		}
		kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
		kpiLogDTO.setTransactionCode(obj.getAcceptanceSigner());
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
    public Response add(CntContractAcceptanceDTO obj) {

        // HuyPq-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_CONTRACT_ACCEPTANCE);
        kpiLogDTO.setDescription(
                Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_ACCEPTANCE.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end
        obj.setCreatedUserId(objUser.getSysUserId());
        obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
        obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        obj.setStatus(1l);
        Long id = 0l;
        try {
            id = cntContractAcceptanceBusinessImpl.save(obj);
        } catch (Exception e) {
            kpiLogDTO.setReason(e.toString());
        }
        obj.setCntContractAcceptanceId(id);
        cntContractAcceptanceBusinessImpl.addConstrucionAcceptance(obj);
        cntContractAcceptanceBusinessImpl.addGoodsAcceptance(obj);
        cntContractAcceptanceBusinessImpl.addStockTransAcceptance(obj);

        CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
        for (UtilAttachDocumentDTO file : obj.getAttachmentLst()) {
            file.setObjectId(id);
            if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
                file.setType(Constants.FILETYPE.CONTRACT_OUT_ACCEPTANCE);
            else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
                file.setType(Constants.FILETYPE.CONTRACT_IN_ACCEPTANCE);
            else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
                file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN_ACCEPTANCE);
            else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
                file.setType(Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT_ACCEPTANCE);
            else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
                file.setType(Constants.FILETYPE.CONTRACT_MATERIAL_ACCEPTANCE);
            file.setDescription(Constants.FileDescription.get(file.getType()));
            file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
            file.setStatus("1");
            utilAttachDocumentBusinessImpl.save(file);
        }
        obj.setCntContractAcceptanceId(id);
        kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
        kpiLogDTO.setTransactionCode(obj.getAcceptanceSigner());
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
    public Response delete(CntContractAcceptanceDTO id) {

        // HuyPq-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_CONTRACT_ACCEPTANCE);
        kpiLogDTO.setDescription(
                Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_ACCEPTANCE.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        CntContractAcceptanceDTO obj = (CntContractAcceptanceDTO) cntContractAcceptanceBusinessImpl.getOneById(id.getCntContractAcceptanceId());
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            //lấy thông tin chưa sysgroupid
            UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");

            obj.setUpdatedUserId(objUser.getSysUserId());
            obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
            obj.setStatus(0l);
            obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
            Long ids = 0l;
            try {
                ids = cntContractAcceptanceBusinessImpl.update(obj);
            } catch (Exception e) {
                kpiLogDTO.setReason(e.toString());
            }
            kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
            String contractAcceptanceId = String.valueOf(obj.getCntContractAcceptanceId());
            kpiLogDTO.setTransactionCode(contractAcceptanceId);
            if (ids == 0l) {
                kpiLogDTO.setStatus("0");
            } else {
                kpiLogDTO.setStatus("1");
            }
            kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
//
//
//    @Override
//    public Response findByAutoComplete(CntContractAcceptanceDTO obj) {
//        List<CntContractAcceptanceDTO> results = cntContractAcceptanceBusinessImpl.getForAutoComplete(obj);
//        if (obj.getIsSize()) {
//            CntContractAcceptanceDTO moreObject = new CntContractAcceptanceDTO();
//            moreObject.setCntContractAcceptanceId(0l);
//            ;
//            results.add(moreObject);
//        }
//        return Response.ok(results).build();
//    }

}
