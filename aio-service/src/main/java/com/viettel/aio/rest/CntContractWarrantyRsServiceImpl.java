package com.viettel.aio.rest;

import com.viettel.aio.business.CntContractBusinessImpl;
import com.viettel.aio.business.CntContractWarrantyBusinessImpl;
import com.viettel.aio.dto.CntContractDTO;
import com.viettel.aio.dto.CntContractWarrantyDTO;
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

public class CntContractWarrantyRsServiceImpl implements CntContractWarrantyRsService {

    protected final Logger log = Logger.getLogger(CntContractWarrantyRsService.class);
    @Autowired
    CntContractWarrantyBusinessImpl cntContractWarrantyBusinessImpl;

    @Context
    HttpServletRequest request;
    @Autowired
    private UserRoleBusinessImpl userRoleBusinessImpl;
    @Autowired
    UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl;
    @Autowired
    CntContractBusinessImpl cntContractBusinessImpl;

    @Autowired
    private KpiLogBusinessImpl kpiLogBusinessImpl; //huypq-add

    @Override
    public Response doSearch(CntContractWarrantyDTO obj) {

        // HuyPq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_CONTRACT_WARRANTY);
//		kpiLogDTO
//				.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_WARRANTY.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        List<CntContractWarrantyDTO> ls = cntContractWarrantyBusinessImpl.doSearch(obj);
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
    public Response update(CntContractWarrantyDTO obj) {
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        //lấy thông tin chưa sysgroupid
        UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");
        obj.setUpdatedUserId(objUser.getSysUserId());
        obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());

        return doUpdate(obj);
    }

    private Response doUpdate(CntContractWarrantyDTO obj) {

        // HuyPq-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_CONTRACT_WARRANTY);
        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_WARRANTY.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));

        CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
        String fileType = "";
        if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
            fileType = Constants.FILETYPE.CONTRACT_OUT_WARRANTY;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
            fileType = Constants.FILETYPE.CONTRACT_IN_WARRANTY;

        UtilAttachDocumentDTO fileSearch = new UtilAttachDocumentDTO();
        fileSearch.setObjectId(obj.getCntContractWarrantyId());
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
                file.setObjectId(obj.getCntContractWarrantyId());
                file.setType(fileType);
                file.setDescription(Constants.FileDescription.get(file.getType()));
                file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
                file.setStatus("1");
                utilAttachDocumentBusinessImpl.save(file);
            }
        Long id = 0l;
        try {
            id = cntContractWarrantyBusinessImpl.update(obj);
        } catch (Exception e) {
            kpiLogDTO.setReason(e.toString());
        }
        kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
        String contractWarrantyId = String.valueOf(obj.getCntContractWarrantyId());
        kpiLogDTO.setTransactionCode(contractWarrantyId);
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
    public Response add(CntContractWarrantyDTO obj) {
        // HuyPq-start
//        KpiLogDTO kpiLogDTO = new KpiLogDTO();
//        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_CONTRACT_WARRANTY);
//        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_WARRANTY.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end
//		CntContractWarrantyDTO existing = (CntContractWarrantyDTO) cntContractWarrantyBusinessImpl.findByValue(obj.getContent());
//		if (existing != null) {
//			return Response.status(Response.Status.CONFLICT).build();
//		} else {
        UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");

        obj.setCreatedUserId(objUser.getSysUserId());
        obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
        obj.setStatus(1l);
        obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        Long id = cntContractWarrantyBusinessImpl.save(obj);

        CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
        String fileType = "";
        if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
            fileType = Constants.FILETYPE.CONTRACT_OUT_WARRANTY;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
            fileType = Constants.FILETYPE.CONTRACT_IN_WARRANTY;

        for (UtilAttachDocumentDTO file : obj.getAttachmentLst()) {
            file.setObjectId(id);
            file.setType(fileType);
            file.setDescription(Constants.FileDescription.get(file.getType()));
            file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
            file.setStatus("1");
            utilAttachDocumentBusinessImpl.save(file);
        }
        obj.setCntContractWarrantyId(id);
//        kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
        String contractWarrantyId = String.valueOf(obj.getCntContractWarrantyId());
//        kpiLogDTO.setTransactionCode(contractWarrantyId);
        if (id == 0l) {
//            kpiLogDTO.setStatus("0");
//            kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
//            kpiLogDTO.setStatus("1");
//            kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.ok(obj).build();
        }
//		}
    }

    @Override
    public Response delete(CntContractWarrantyDTO id) {

        // HuyPq-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_CONTRACT_WARRANTY);
        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_WARRANTY.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        CntContractWarrantyDTO obj = (CntContractWarrantyDTO) cntContractWarrantyBusinessImpl.getOneById(id.getCntContractWarrantyId());
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
                ids = cntContractWarrantyBusinessImpl.update(obj);
            } catch (Exception e) {
                kpiLogDTO.setReason(e.toString());
            }
            kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
            String contractWarrantyId = String.valueOf(obj.getCntContractWarrantyId());
            kpiLogDTO.setTransactionCode(contractWarrantyId);
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
    public Response findByAutoComplete(CntContractWarrantyDTO obj) {
        List<CntContractWarrantyDTO> results = cntContractWarrantyBusinessImpl.getForAutoComplete(obj);
        if (obj.getIsSize()) {
            CntContractWarrantyDTO moreObject = new CntContractWarrantyDTO();
            moreObject.setCntContractWarrantyId(0l);
            results.add(moreObject);
        }
        return Response.ok(results).build();
    }
}
