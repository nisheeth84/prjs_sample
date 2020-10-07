package com.viettel.aio.rest;

import com.viettel.aio.business.CntContractBusinessImpl;
import com.viettel.aio.business.CntContractLiquidateBusinessImpl;
import com.viettel.aio.business.CntContractPaymentBusinessImpl;
import com.viettel.aio.dto.CntContractDTO;
import com.viettel.aio.dto.CntContractLiquidateDTO;
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
import viettel.passport.client.UserToken;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.sql.Timestamp;
import java.util.List;

/**
 * @author hailh10
 */

public class CntContractLiquidateRsServiceImpl implements CntContractLiquidateRsService {

    protected final Logger log = Logger.getLogger(CntContractLiquidateRsService.class);
    @Autowired
    CntContractLiquidateBusinessImpl cntContractLiquidateBusinessImpl;
    @Autowired
    CntContractPaymentBusinessImpl cntContractPaymentBusinessImpl;

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
    public Response doSearch(CntContractLiquidateDTO obj) {

        // HuyPq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_CONTRACT_LIQUIDATE);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_LIQUIDATE.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        List<CntContractLiquidateDTO> ls = cntContractLiquidateBusinessImpl.doSearch(obj);
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(obj.getTotalRecord());
            data.setSize(ls.size());
            data.setStart(1);
            //huypq-start
//			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//			kpiLogDTO.setTransactionCode(obj.getKeySearch());
//			kpiLogDTO.setStatus("1");
//			kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.ok(data).build();
            //huy-end
        }
    }


    @Override
    public Response update(CntContractLiquidateDTO obj) {
        CntContractLiquidateDTO originObj = (CntContractLiquidateDTO) cntContractLiquidateBusinessImpl.getOneById(obj.getCntContractLiquidateId());

        if (originObj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
            //lấy thông tin chưa sysgroupid
            obj.setUpdatedUserId(objUser.getSysUserId());
            obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());

            return doUpdate(obj);

        }

    }

    private Response doUpdate(CntContractLiquidateDTO obj) {

        // HuyPq-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_CONTRACT_LIQUIDATE);
        kpiLogDTO
                .setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_LIQUIDATE.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
        String fileType = "";
        if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
            fileType = Constants.FILETYPE.CONTRACT_OUT_LIQUIDATE;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
            fileType = Constants.FILETYPE.CONTRACT_IN_LIQUIDATE;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
            fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN_LIQUIDATE;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
            fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT_LIQUIDATE;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
            fileType = Constants.FILETYPE.CONTRACT_MATERIAL_LIQUIDATE;

        obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));

        UtilAttachDocumentDTO fileSearch = new UtilAttachDocumentDTO();
        fileSearch.setObjectId(obj.getCntContractLiquidateId());
        fileSearch.setType(fileType);
        List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentBusinessImpl.doSearch(fileSearch);
        if (fileLst != null)
            for (UtilAttachDocumentDTO file : fileLst) {
                if (file != null) {
                    utilAttachDocumentBusinessImpl.delete(file);
                }
            }

        if (obj.getAttachmentLst() != null)
            for (UtilAttachDocumentDTO file : obj.getAttachmentLst()) {
                file.setObjectId(obj.getCntContractLiquidateId());
                file.setType(fileType);
                file.setDescription(Constants.FileDescription.get(file.getType()));
                file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
                file.setStatus("1");
                utilAttachDocumentBusinessImpl.save(file);
            }
        Long id = 0l;
        try {
            id = cntContractLiquidateBusinessImpl.update(obj);
        } catch (Exception e) {
            kpiLogDTO.setReason(e.toString());
        }
        kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
        String contractLiquidateId = String.valueOf(obj.getCntContractLiquidateId());
        kpiLogDTO.setTransactionCode(contractLiquidateId);
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
    public Response add(CntContractLiquidateDTO obj) {

        // HuyPq-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_CONTRACT_LIQUIDATE);
        kpiLogDTO
                .setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_LIQUIDATE.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
        String fileType = "";
        if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
            fileType = Constants.FILETYPE.CONTRACT_OUT_LIQUIDATE;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
            fileType = Constants.FILETYPE.CONTRACT_IN_LIQUIDATE;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
            fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN_LIQUIDATE;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
            fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT_LIQUIDATE;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
            fileType = Constants.FILETYPE.CONTRACT_MATERIAL_LIQUIDATE;

        obj.setCreatedUserId(objUser.getSysUserId());
        obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
        obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        obj.setStatus(1l);
        Long id = cntContractLiquidateBusinessImpl.save(obj);
        for (UtilAttachDocumentDTO file : obj.getAttachmentLst()) {
            file.setObjectId(id);
            file.setType(fileType);
            file.setDescription(Constants.FileDescription.get(file.getType()));
            file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
            file.setStatus("1");
            utilAttachDocumentBusinessImpl.save(file);
        }
        obj.setCntContractLiquidateId(id);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            CntContractPaymentDTO criteria = new CntContractPaymentDTO();
            criteria.setCntContractId(obj.getCntContractId());
            List<CntContractPaymentDTO> lstPaymentDTOs = cntContractPaymentBusinessImpl.doSearch(criteria);
            Long ids = 0l;
            if (lstPaymentDTOs != null && lstPaymentDTOs.size() > 0) {
                if (contract != null) {
                    contract.setStatus(Constants.CONTRACT_STATUS.DATHANHLY);
                    try {
                        ids = cntContractBusinessImpl.update(contract);
                    } catch (Exception e) {
                        kpiLogDTO.setReason(e.toString());
                    }
                    kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
                    String contractLiquidateId = String.valueOf(obj.getCntContractLiquidateId());
                    kpiLogDTO.setTransactionCode(contractLiquidateId);
                    if (ids == 0l) {
                        kpiLogDTO.setStatus("0");
                        kpiLogBusinessImpl.save(kpiLogDTO);
                        return Response.status(Response.Status.BAD_REQUEST).build();
                    } else {
                        kpiLogDTO.setStatus("1");
                        kpiLogBusinessImpl.save(kpiLogDTO);
                        return Response.ok(obj).build();
                    }
                }
            }
            return Response.ok(obj).build();
        }

    }

    @Override
    public Response delete(CntContractLiquidateDTO id) {

        // HuyPq-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_CONTRACT_LIQUIDATE);
        kpiLogDTO
                .setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_LIQUIDATE.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        CntContractLiquidateDTO obj = (CntContractLiquidateDTO) cntContractLiquidateBusinessImpl.getOneById(id.getCntContractLiquidateId());
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
                ids = cntContractLiquidateBusinessImpl.update(obj);
            } catch (Exception e) {
                kpiLogDTO.setReason(e.toString());
            }
            kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
            String contractLiquidateId = String.valueOf(obj.getCntContractLiquidateId());
            kpiLogDTO.setTransactionCode(contractLiquidateId);
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
//
//	@Override
//	public Response findByAutoComplete(CntContractLiquidateDTO obj) {
//		List<CntContractLiquidateDTO> results = cntContractLiquidateBusinessImpl.getForAutoComplete(obj);
//		if (obj.getIsSize()){
//			CntContractLiquidateDTO moreObject = new CntContractLiquidateDTO();
//			moreObject.setCntContractLiquidateId(0l);;
//
//			results.add(moreObject);
//		}
//		return Response.ok(results).build();
//	}
}
