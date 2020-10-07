package com.viettel.aio.rest;

import com.viettel.aio.business.CntContractAppendixBusinessImpl;
import com.viettel.aio.business.CntContractBusinessImpl;
import com.viettel.aio.dto.CntContractAppendixDTO;
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

public class CntContractAppendixRsServiceImpl implements CntContractAppendixRsService {

    protected final Logger log = Logger.getLogger(CntContractAppendixRsService.class);
    @Autowired
    CntContractAppendixBusinessImpl cntContractAppendixBusinessImpl;
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
    public Response doSearch(CntContractAppendixDTO obj) {

        // HuyPq-start
//		KpiLogDTO kpiLogDTO = new KpiLogDTO();
//		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_CONTRACT_APPENDIX);
//		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_APPENDIX.toString()));
//		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        List<CntContractAppendixDTO> ls = cntContractAppendixBusinessImpl.doSearch(obj);
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
    public Response update(CntContractAppendixDTO obj) {
        CntContractAppendixDTO originObj = (CntContractAppendixDTO) cntContractAppendixBusinessImpl.getOneById(obj.getCntContractAppendixId());

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
//					CntContractAppendixDTO check = cntContractAppendixBusinessImpl.findByValue(obj.getValue());
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

    private Response doUpdate(CntContractAppendixDTO obj) {

        // HuyPq-start
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_CONTRACT_APPENDIX);
        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_APPENDIX.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
        String fileType = "";
        if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
            fileType = Constants.FILETYPE.CONTRACT_OUT_APPENDIX;


        obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));

        UtilAttachDocumentDTO fileSearch = new UtilAttachDocumentDTO();
        fileSearch.setObjectId(obj.getCntContractAppendixId());
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
                file.setObjectId(obj.getCntContractAppendixId());
                file.setType(fileType);
                file.setDescription(Constants.FileDescription.get(file.getType()));
                file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
                file.setStatus("1");
                utilAttachDocumentBusinessImpl.save(file);
            }

        Long id = 0l;
        try {
            id = cntContractAppendixBusinessImpl.update(obj);
        } catch (Exception e) {
            kpiLogDTO.setReason(e.toString());
        }
        kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
        String contractAppendixId = String.valueOf(obj.getCntContractAppendixId());
        kpiLogDTO.setTransactionCode(contractAppendixId);
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
    public Response add(CntContractAppendixDTO obj) {

        // HuyPq-start
//        KpiLogDTO kpiLogDTO = new KpiLogDTO();
//        kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_CONTRACT_APPENDIX);
//        kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.CONTRACT_APPENDIX.toString()));
        KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//        kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//        kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        CntContractDTO contract = (CntContractDTO) cntContractBusinessImpl.getOneById(obj.getCntContractId());
        String fileType = "";
        if (contract.getContractType() == Constants.CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT)
            fileType = Constants.FILETYPE.CONTRACT_OUT_APPENDIX;

        UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");
        obj.setCreatedUserId(objUser.getSysUserId());
        obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
        obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        obj.setStatus(1l);

        Long id = cntContractAppendixBusinessImpl.save(obj);

        for (UtilAttachDocumentDTO file : obj.getAttachmentLst()) {
            file.setObjectId(id);
            file.setType(fileType);
            file.setDescription(Constants.FileDescription.get(file.getType()));
            file.setCreatedDate(new Timestamp(System.currentTimeMillis()));
            file.setStatus("1");
            utilAttachDocumentBusinessImpl.save(file);
        }

        obj.setCntContractAppendixId(id);
//        kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
        String contractAppendixId = String.valueOf(obj.getCntContractAppendixId());
//        kpiLogDTO.setTransactionCode(contractAppendixId);
        if (id == 0l) {
//            kpiLogDTO.setStatus("0");
//            kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
//            kpiLogDTO.setStatus("1");
//            kpiLogBusinessImpl.save(kpiLogDTO);
            return Response.ok(obj).build();
        }

    }

    @Override
    public Response delete(CntContractAppendixDTO id) {
        CntContractAppendixDTO obj = (CntContractAppendixDTO) cntContractAppendixBusinessImpl.getOneById(id.getCntContractAppendixId());
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
            //lấy thông tin chưa sysgroupid

            obj.setUpdatedUserId(objUser.getSysUserId());
            obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());

            obj.setStatus(0l);
            obj.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
            cntContractAppendixBusinessImpl.update(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }


    @Override
    public Response findByAutoComplete(CntContractAppendixDTO obj) {
        List<CntContractAppendixDTO> results = cntContractAppendixBusinessImpl.getForAutoComplete(obj);
        if (obj.getIsSize()) {
            CntContractAppendixDTO moreObject = new CntContractAppendixDTO();
            moreObject.setCntContractAppendixId(0l);
            ;

            results.add(moreObject);
        }
        return Response.ok(results).build();
    }

}
