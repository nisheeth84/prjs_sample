/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.bo.GoodsPlanDetailBO;
import com.viettel.coms.business.AssetManagementRequestBusinessImpl;
//import com.viettel.coms.business.GoodsPlanDetailBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dao.ConstructionTaskDAO;
import com.viettel.coms.dto.AssetManageRequestEntityDetailDTO;
import com.viettel.coms.dto.AssetManagementRequestDetailDTO;
import com.viettel.coms.dto.GoodsPlanDetailDTO;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.YearPlanDTO;
import com.viettel.coms.dto.manufacturingVT_DTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * @author HungLQ9
 */
public class AssetManagementRequestRsServiceImpl implements AssetManagementRequestRsService {

    protected final Logger log = Logger.getLogger(AssetManagementRequestRsServiceImpl.class);
    @Autowired
    AssetManagementRequestBusinessImpl assetManagementRequestBusinessImpl;
    
//    @Autowired
//    GoodsPlanDetailBusinessImpl goodsPlanDetailBusinessImpl;
    
    @Autowired
    ConstructionTaskDAO constructionTaskDao;
    
    @Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
    
    @Context
    HttpServletRequest request;

    @Context
    HttpServletResponse response;

    @Autowired
    private UserRoleBusinessImpl userRoleBusinessImpl;
    

    @Override
    public Response doSearch(AssetManagementRequestDetailDTO obj) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_ASSET_MANAGEMENT_REQUEST_DETAIL");
        objKpiLog.setDescription("Quản lý yêu cầu thu hồi VTTB");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = assetManagementRequestBusinessImpl.doSearch(obj, request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dStart.getSeconds()-dEnd.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }
//    hungtd_20181225_start
    @Override
    public Response doSearchVT(manufacturingVT_DTO obj) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_ASSET_MANAGEMENT_REQUEST_DETAIL");
        objKpiLog.setDescription("Quản lý yêu cầu thu hồi VTTB");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = assetManagementRequestBusinessImpl.doSearchVT(obj, request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dStart.getSeconds()-dEnd.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }
    @Override
    public Response removeVT(manufacturingVT_DTO obj) {
        // TODO Auto-generated method stub
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
//        objKpiLog.setStartTime(dStart);
//        objKpiLog.setCreateDatetime(dStart);
//        objKpiLog.setFunctionCode("DELETE_YEAR_PLAN");
//        objKpiLog.setDescription("Kế hoạch năm");
//        objKpiLog.setTransactionCode(obj.getCode());
//        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        assetManagementRequestBusinessImpl.removeVT(obj);
//        Date dEnd = new Date();
//        objKpiLog.setEndTime(dEnd);
//        objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok().build();
    }
    @Override
    public Response openVT(manufacturingVT_DTO obj) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        assetManagementRequestBusinessImpl.openVT(obj);
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok().build();
    }
    @Override
    public Response doSearchPopup(manufacturingVT_DTO obj) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_ASSET_MANAGEMENT_REQUEST_DETAIL");
        objKpiLog.setDescription("Quản lý yêu cầu thu hồi VTTB");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = assetManagementRequestBusinessImpl.doSearchPopup(obj, request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dStart.getSeconds()-dEnd.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }
    @Override
    public Response doSearchdetail(Long requestgoodsId) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_ASSET_MANAGEMENT_REQUEST_DETAIL");
        objKpiLog.setDescription("Quản lý yêu cầu thu hồi VTTB");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = assetManagementRequestBusinessImpl.doSearchdetail(requestgoodsId,request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dStart.getSeconds()-dEnd.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }
    
    @Override
    public Response Search(Long requestgoodsId) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_ASSET_MANAGEMENT_REQUEST_DETAIL");
        objKpiLog.setDescription("Quản lý yêu cầu thu hồi VTTB");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = assetManagementRequestBusinessImpl.doSearchdetail(requestgoodsId,request);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dStart.getSeconds()-dEnd.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }
    
    public Response addVT(manufacturingVT_DTO obj) throws Exception {
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		try {
			obj.setStatus(1L);

			Long id=assetManagementRequestBusinessImpl.createLogin(obj);
			if (id == 0l) {
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				if(obj.getListData().size() > 0) {
				for(GoodsPlanDetailDTO dto : obj.getListData()) {
					dto.setGoodsPlanId(id);
					Long idDetail=assetManagementRequestBusinessImpl.createLoginDetail(dto);
				}
			}
				return Response.ok(Response.Status.CREATED).build();
			}
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
//		List<GoodsPlanDetailDTO> goodPlan = new ArrayList<>();
//		goodPlan=obj.getListData();
//		for(GoodsPlanDetailDTO objPlan : goodPlan) {
//			goodsPlanDetailBusinessImpl.List(obj);
//		}

	}
    
public Response updateVT(manufacturingVT_DTO obj) throws Exception{
	KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
    	try {
    		Long id=assetManagementRequestBusinessImpl.updateVT(obj);
    		if(id==0l){
    			return Response.status(Response.Status.BAD_REQUEST).build();
    		} else {
    			return Response.ok(Response.Status.CREATED).build();
    		}
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error",e.getMessage())).build();
		}
		
	}
//public Response updateVT(manufacturingVT_DTO obj) throws Exception{
//	
//	try {
//		Long id=assetManagementRequestBusinessImpl.updateVT(obj);
//		if(id==0l){
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(Response.Status.CREATED).build();
//		}
//	} catch (Exception e) {
//		return Response.ok().entity(Collections.singletonMap("error",e.getMessage())).build();
//	}
//	
//}
@Override
public Response Registry(manufacturingVT_DTO obj) {
    // TODO Auto-generated method stub
	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
    KpiLogDTO objKpiLog = new KpiLogDTO();
    Date dStart = new Date();
//    objKpiLog.setStartTime(dStart);
//    objKpiLog.setCreateDatetime(dStart);
//    objKpiLog.setFunctionCode("DELETE_YEAR_PLAN");
//    objKpiLog.setDescription("Kế hoạch năm");
//    objKpiLog.setTransactionCode(obj.getCode());
//    objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
    assetManagementRequestBusinessImpl.Registry(obj);
//    Date dEnd = new Date();
//    objKpiLog.setEndTime(dEnd);
//    objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
    objKpiLog.setStatus("1");
    yearPlanBusinessImpl.addKpiLog(objKpiLog);
    return Response.ok().build();
}
//    hunggtd_20181225_end

    @Override
    public Response add(AssetManagementRequestDetailDTO obj) throws Exception {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        //tanqn 20181116 start
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("INSERT_ASSET_MANAGEMENT_REQUEST_DETAIL");
        objKpiLog.setDescription("Quản lý yêu cầu thu hồi VTTB");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
			if(Integer.parseInt(objUser.getVpsUserInfo().getGroupLevel())  <= 3){ 
				obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
				obj.setUpdateGroupName(objUser.getVpsUserInfo().getName());
			} else{ // neu nguoi tao thuoc don vi co group lever > 3 => lay don vi cha cua group do 
				String[] pathId = objUser.getVpsUserInfo().getPath().split("/"); 
				Long parentGroupId = Long.parseLong(pathId[3]); 
				obj.setUpdatedGroupId(parentGroupId);
				obj.setUpdateGroupName(objUser.getVpsUserInfo().getGroupNameLevel3());
			}
            obj.setCreatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setStatus("1");
            obj.setCreatedDate(new Date());
            obj.setCreatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
            obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setUpdatedDate(new Date());
            obj.setUpdateFullName(objUser.getVpsUserInfo().getFullName());
            Long ids = assetManagementRequestBusinessImpl.add(obj, request);
            if (ids == 0l) {
            	Date dEnd = new Date();	
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dStart.getSeconds()-dEnd.getSeconds()));
                objKpiLog.setStatus("0");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
            	Date dEnd = new Date();
                objKpiLog.setEndTime(dEnd);
                objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
                objKpiLog.setStatus("1");
                yearPlanBusinessImpl.addKpiLog(objKpiLog);
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response delete(Long id) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Response update(AssetManagementRequestDetailDTO obj) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Response getById(AssetManagementRequestDetailDTO obj) throws Exception {
        // TODO Auto-generated method stub
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        try {
			if(Integer.parseInt(objUser.getVpsUserInfo().getGroupLevel())  <= 3){ 
				obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
				obj.setUpdateGroupName(objUser.getVpsUserInfo().getName());
			} else{ // neu nguoi tao thuoc don vi co group lever > 3 => lay don vi cha cua group do 
				String[] pathId = objUser.getVpsUserInfo().getPath().split("/"); 
				Long parentGroupId = Long.parseLong(pathId[3]); 
				obj.setUpdatedGroupId(parentGroupId);
				obj.setUpdateGroupName(objUser.getVpsUserInfo().getGroupNameLevel3());
			}
            obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setUpdatedDate(new Date());
            obj.setUpdateFullName(objUser.getVpsUserInfo().getFullName());
            AssetManagementRequestDetailDTO data = assetManagementRequestBusinessImpl.getById(obj);
            return Response.ok(data).build();
        } catch (Exception e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response updateHSHCItem(AssetManagementRequestDetailDTO obj) throws Exception {
        // TODO Auto-generated method stub
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
      
        try {
			if(Integer.parseInt(objUser.getVpsUserInfo().getGroupLevel())  <= 3){ 
				obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
				obj.setUpdateGroupName(objUser.getVpsUserInfo().getName());
			} else{ // neu nguoi tao thuoc don vi co group lever > 3 => lay don vi cha cua group do 
				String[] pathId = objUser.getVpsUserInfo().getPath().split("/"); 
				Long parentGroupId = Long.parseLong(pathId[3]); 
				obj.setUpdatedGroupId(parentGroupId);
				obj.setUpdateGroupName(objUser.getVpsUserInfo().getGroupNameLevel3());
			}
            obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setUpdatedDate(new Date());
            obj.setUpdateFullName(objUser.getVpsUserInfo().getFullName());
            Long ids = assetManagementRequestBusinessImpl.updateHSHCItem(obj, objUser.getFullName());
            if (ids == 0l) {
            	
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
            	
                return Response.ok(Response.Status.CREATED).build();
            }
        } catch (Exception e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }

    }

    @Override
    public Response removeTHVT(AssetManagementRequestDetailDTO obj) throws Exception {
        // TODO Auto-generated method stub
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        //tanqn 20181116 start
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("REMOVE_THVT");
        objKpiLog.setDescription("Quản lý yêu cầu thu hồi VTTB");
        objKpiLog.setTransactionCode(obj.getConstructionCode());
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        try {
            obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());
            obj.setUpdatedDate(new Date());
            obj.setUpdatedGroupId(objUser.getVpsUserInfo().getSysGroupId());
            assetManagementRequestBusinessImpl.removeTHVT(obj, objUser.getFullName());
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dStart.getSeconds()-dEnd.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok().build();
        } catch (Exception e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    public Response DSVT(AssetManagementRequestDetailDTO obj) throws Exception {
        // TODO Auto-generated method stub
        List<AssetManageRequestEntityDetailDTO> data = new ArrayList<AssetManageRequestEntityDetailDTO>();

        data = assetManagementRequestBusinessImpl.getDSVT(obj);
        return Response.ok(data).build();

    }

    public Response DSVTT(AssetManagementRequestDetailDTO obj) throws Exception {
        List<AssetManageRequestEntityDetailDTO> data = new ArrayList<AssetManageRequestEntityDetailDTO>();
        data = assetManagementRequestBusinessImpl.getDSVTT(obj);
        return Response.ok(data).build();
    }

    public Response DSTB(AssetManagementRequestDetailDTO obj) throws Exception {
        // TODO Auto-generated method stub
        List<AssetManageRequestEntityDetailDTO> data = new ArrayList<AssetManageRequestEntityDetailDTO>();

        data = assetManagementRequestBusinessImpl.getDSTB(obj);
        return Response.ok(data).build();

    }

    public Response DSTBT(AssetManagementRequestDetailDTO obj) throws Exception {
        // TODO Auto-generated method stub
        List<AssetManageRequestEntityDetailDTO> data = new ArrayList<AssetManageRequestEntityDetailDTO>();

        data = assetManagementRequestBusinessImpl.getDSTBT(obj);
        return Response.ok(data).build();

    }

    @Override
    public Response getCatReason() {
        return Response.ok(assetManagementRequestBusinessImpl.getCatReason()).build();
    }

    @Override
    public Response getStockTrans(Long id) {
        return Response.ok(assetManagementRequestBusinessImpl.getStockTrans(id)).build();
    }

    @Override
    public Response getSequence() throws Exception {
        // TODO Auto-generated method stub
        Long seq = assetManagementRequestBusinessImpl.getSequence();
        return Response.ok(seq).build();
    }

    @Override
    public Response getSequenceOrders() throws Exception {
        // TODO Auto-generated method stub
        Long seq = assetManagementRequestBusinessImpl.getSequenceOrders();
        return Response.ok(seq).build();
    }

    @Override
    public Response exportRetrievalTask(AssetManagementRequestDetailDTO obj) throws Exception {
    	//tanqn 20181113
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("EXPORT_RETRIEVAL_TASK");
        objKpiLog.setDescription("Quản lý yêu cầu thu hồi VTTB");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
    	try {
            String strReturn = assetManagementRequestBusinessImpl.exportRetrievalTask(obj);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("1");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
            Date dEnd = new Date();
            objKpiLog.setEndTime(dEnd);
            objKpiLog.setDuration((long)(dEnd.getSeconds() - dStart.getSeconds()));
            objKpiLog.setStatus("0");
            yearPlanBusinessImpl.addKpiLog(objKpiLog);
        }
        return null;
    }

    @Override
    public Response getLstConstruction(AssetManagementRequestDetailDTO obj) {
        List<AssetManagementRequestDetailDTO> lst = assetManagementRequestBusinessImpl.getLstConstruction(obj);
        return Response.ok(lst).build();
    }

    @Override
    public Response checkPermissionsAdd() {
        try {
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(assetManagementRequestBusinessImpl.checkPermissionsAdd(sysGroupId, request)).build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response checkPermissionsRemove(AssetManagementRequestDetailDTO obj) {
        try {
            // TODO Auto-generated method stub
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysGroupId = objUser.getVpsUserInfo().getSysGroupId();
            return Response.ok(assetManagementRequestBusinessImpl.checkPermissionsRemove(obj, sysGroupId, request))
                    .build();
        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

}
