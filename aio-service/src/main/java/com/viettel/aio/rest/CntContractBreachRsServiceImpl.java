package com.viettel.aio.rest;

import com.viettel.aio.business.CntContractBreachBusinessImpl;
import com.viettel.aio.business.CntContractBusinessImpl;
import com.viettel.aio.dto.CntContractBreachDTO;
import com.viettel.aio.dto.CntContractDTO;
import com.viettel.cat.constant.Constants;
import com.viettel.coms.business.KpiLogBusinessImpl;
import com.viettel.coms.business.UtilAttachDocumentBusinessImpl;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.erp.dto.DataListDTO;
import com.viettel.ktts2.dto.KttsUserSession;
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

public class CntContractBreachRsServiceImpl implements CntContractBreachRsService {

    protected final Logger log = Logger.getLogger(CntContractBreachRsService.class);
    @Autowired
    CntContractBreachBusinessImpl cntContractBreachBusinessImpl;
    @Autowired
    CntContractBusinessImpl cntContractBusinessImpl;
    @Context
    HttpServletRequest request;
    @Autowired
    private UserRoleBusinessImpl userRoleBusinessImpl;

    @Autowired
    private UtilAttachDocumentBusinessImpl utilAttachDocumentBusinessImpl;

    @Autowired
    private KpiLogBusinessImpl kpiLogBusinessImpl; //huypq-add

    @Override
    public Response doSearch(CntContractBreachDTO obj) {

        // HuyPq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_CONTRACT_BREACH);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_BREACH.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        List<CntContractBreachDTO> ls = cntContractBreachBusinessImpl.doSearch(obj);
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
    public Response update(CntContractBreachDTO obj) {
        CntContractBreachDTO originObj = (CntContractBreachDTO) cntContractBreachBusinessImpl.getOneById(obj.getCntContractBreachId());

        if (originObj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
            //lấy thông tin chưa sysgroupid
            obj.setUpdatedUserId(objUser.getSysUserId());
            //sysgroup id

            obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());

//			if (obj.getUpdated() != null && obj.getUpdated().compareTo(originObj.getUpdated()) == -1) {
//				return Response.status(Response.Status.MOVED_PERMANENTLY).build();
//			} else {
//				if (!obj.getValue().equalsIgnoreCase(originObj.getValue())) {
//					CntContractBreachDTO check = cntContractBreachBusinessImpl.findByValue(obj.getValue());
//					if (check != null) {
//						return Response.status(Response.Status.CONFLICT).build();
//					} else {
            return doUpdate(obj);
//					}
//				} else {
//					return doUpdate(obj);
//				}
//			}
        }

    }

    private Response doUpdate(CntContractBreachDTO obj) {

        // HuyPq-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_CONTRACT_BREACH);
        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_BREACH.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
        String fileType = "";
        if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
            fileType = Constants.FILETYPE.CONTRACT_OUT_BREACH;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
            fileType = Constants.FILETYPE.CONTRACT_IN_BREACH;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
            fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN_BREACH;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
            fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT_BREACH;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
            fileType = Constants.FILETYPE.CONTRACT_MATERIAL_BREACH;

        obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));

        UtilAttachDocumentDTO fileSearch = new UtilAttachDocumentDTO();
        fileSearch.setObjectId(obj.getCntContractBreachId());
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
                file.setObjectId(obj.getCntContractBreachId());
                file.setType(fileType);
                file.setDescription(Constants.FileDescription.get(file.getType()));
                file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
                file.setStatus("1");
                utilAttachDocumentBusinessImpl.save(file);
            }
        Long id = 0l;
        try {
            id = cntContractBreachBusinessImpl.update(obj);
        } catch (Exception e) {
            kpiLogDTO.setReason(e.toString());
        }
        kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
        String contractBreachId = String.valueOf(obj.getCntContractBreachId());
        kpiLogDTO.setTransactionCode(contractBreachId);
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
    public Response add(CntContractBreachDTO obj) {

        // HuyPq-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_CONTRACT_BREACH);
        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_BREACH.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
        String fileType = "";
        if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
            fileType = Constants.FILETYPE.CONTRACT_OUT_BREACH;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN)
            fileType = Constants.FILETYPE.CONTRACT_IN_BREACH;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN)
            fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_IN_BREACH;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT)
            fileType = Constants.FILETYPE.CONTRACT_CONSTRUCTION_TM_OUT_BREACH;
        else if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_MATERIAL)
            fileType = Constants.FILETYPE.CONTRACT_MATERIAL_BREACH;

        UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");
        obj.setCreatedUserId(objUser.getSysUserId());
        obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
        obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        obj.setStatus(1l);

        Long id = cntContractBreachBusinessImpl.save(obj);

        for (UtilAttachDocumentDTO file : obj.getAttachmentLst()) {
            file.setObjectId(id);
            file.setType(fileType);
            file.setDescription(Constants.FileDescription.get(file.getType()));
            file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
            file.setStatus("1");
            utilAttachDocumentBusinessImpl.save(file);
        }

        obj.setCntContractBreachId(id);
        kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
        String contractBreachId = String.valueOf(obj.getCntContractBreachId());
        kpiLogDTO.setTransactionCode(contractBreachId);
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
    public Response delete(CntContractBreachDTO id) {

        // HuyPq-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_CONTRACT_BREACH);
        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_BREACH.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        CntContractBreachDTO obj = (CntContractBreachDTO) cntContractBreachBusinessImpl.getOneById(id.getCntContractBreachId());
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            //lấy thông tin chưa sysgroupid

            obj.setUpdatedUserId(objUser.getSysUserId());
            obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());

            obj.setStatus(0l);
            obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
            Long ids = 0l;
            try {
                ids = cntContractBreachBusinessImpl.update(obj);
            } catch (Exception e) {
                kpiLogDTO.setReason(e.toString());
            }
            kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
            String contractBreachId = String.valueOf(obj.getCntContractBreachId());
            kpiLogDTO.setTransactionCode(contractBreachId);
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
    public Response findByAutoComplete(CntContractBreachDTO obj) {
        List<CntContractBreachDTO> results = cntContractBreachBusinessImpl.getForAutoComplete(obj);
        if (obj.getIsSize()) {
            CntContractBreachDTO moreObject = new CntContractBreachDTO();
            moreObject.setCntContractBreachId(0l);

            results.add(moreObject);
        }
        return Response.ok(results).build();
    }

}
