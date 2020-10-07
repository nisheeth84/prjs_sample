package com.viettel.coms.rest;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import com.viettel.asset.dto.SysGroupDto;
import com.viettel.coms.business.GoodsPlanBusinessImpl;
import com.viettel.coms.business.UserConfigBusinessImpl;
import com.viettel.coms.business.YearPlanBusinessImpl;
import com.viettel.coms.dto.GoodsPlanDTO;
import com.viettel.coms.dto.GoodsPlanDetailDTO;
import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.coms.dto.RequestGoodsDetailDTO;
import com.viettel.coms.dto.UserConfigDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.security.PassTranformer;
import com.viettel.service.base.dto.DataListDTO;

public class GoodsPlanRsServiceImpl implements GoodsPlanRsService {
	protected final Logger log = Logger.getLogger(GoodsPlanRsServiceImpl.class);
	@Context
	HttpServletRequest request;

	@Context
	HttpServletResponse response;
	
	@Autowired
	private GoodsPlanBusinessImpl goodsPlanBusinessImpl;
	
	@Autowired
    YearPlanBusinessImpl yearPlanBusinessImpl;
	
	@Autowired
	UserConfigBusinessImpl userConfigBusinessImpl;
	
	@Value("${ca_encrypt_key}")
	private String ca_encrypt_key;
	
	@Override
    public Response doSearchPopupGoodsPlan(GoodsPlanDTO obj) throws Exception {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        DataListDTO data = goodsPlanBusinessImpl.doSearchPopupGoodsPlan(obj);
        return Response.ok(data).build();
    }
	
	@Override
	public Response doSearchSysGroup(GoodsPlanDTO obj) throws Exception {
		List<SysGroupDto> data = goodsPlanBusinessImpl.doSearchSysGroup(obj);
		return Response.ok(data).build();
	}
	
	@Override
	public Response doSearchReqGoodsDetail(GoodsPlanDTO obj) throws Exception {
		List<RequestGoodsDetailDTO> data = goodsPlanBusinessImpl.doSearchReqGoodsDetail(obj);
		return Response.ok(data).build();
	}
	public Response add(GoodsPlanDTO obj) throws Exception {
		try {
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			obj.setStatus("1");
			obj.setSignState("1");
			obj.setCreatedDate(new Date());
			obj.setCreatedUserId(objUser.getVpsUserInfo().getSysUserId());
			Long id=goodsPlanBusinessImpl.addGoodsPlan(obj);
			if (id == 0l) {
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				if(obj.getListData().size() > 0) {
				for(GoodsPlanDetailDTO dto : obj.getListData()) {
					dto.setGoodsPlanId(id);
					Date date = new Date(dto.getExpectedDate().getTime() + (1000 * 60 * 60 * 24));
					dto.setExpectedDate(date);
					goodsPlanBusinessImpl.addGoodsPlanDetail(dto);
				}
			}
				return Response.ok(Response.Status.CREATED).build();
			}
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}
	
	public Response update(GoodsPlanDTO obj) throws Exception {
		try {
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			obj.setUpdateDate(new Date());
			obj.setUpdateUserId(objUser.getVpsUserInfo().getSysUserId());
			Long id=goodsPlanBusinessImpl.updateGoodsPlan(obj);
			if (id == 0l) {
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				if(obj.getListData().size() > 0) {
					goodsPlanBusinessImpl.removeGoodsPlanDetail(obj);
				for(GoodsPlanDetailDTO dto : obj.getListData()) {
					dto.setGoodsPlanId(obj.getGoodsPlanId());
					Date date = new Date(dto.getExpectedDate().getTime() + (1000 * 60 * 60 * 24));
					dto.setExpectedDate(date);
					goodsPlanBusinessImpl.addGoodsPlanDetail(dto);
				}
			}
				return Response.ok(Response.Status.OK).build();
			}
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}
	
	public Response remove(GoodsPlanDTO obj) throws Exception {
		try {
			KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
			obj.setUpdateDate(new Date());
			obj.setUpdateUserId(objUser.getVpsUserInfo().getSysUserId());
			Long id=goodsPlanBusinessImpl.remove(obj);
			goodsPlanBusinessImpl.deleteGoodsPlanDetail(obj);
			if (id == 0l) {
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				return Response.ok(Response.Status.OK).build();
			}
		} catch (IllegalArgumentException e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}
	
	@Override
    public Response doSearchAll(GoodsPlanDTO obj) {
    	KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        KpiLogDTO objKpiLog = new KpiLogDTO();
        Date dStart = new Date();
        objKpiLog.setStartTime(dStart);
        objKpiLog.setCreateDatetime(dStart);
        objKpiLog.setFunctionCode("DOSEARCH_GOODS_PLAN");
        objKpiLog.setDescription("Kế hoạch sản xuất vật tư");
        objKpiLog.setCreateUserId(objUser.getVpsUserInfo().getSysUserId());
        DataListDTO data = goodsPlanBusinessImpl.doSearchAll(obj);
        Date dEnd = new Date();
        objKpiLog.setEndTime(dEnd);
        objKpiLog.setDuration((long)(dStart.getSeconds()-dEnd.getSeconds()));
        objKpiLog.setStatus("1");
        yearPlanBusinessImpl.addKpiLog(objKpiLog);
        return Response.ok(data).build();
    }
	
	@Override
	public Response doSearch(GoodsPlanDTO obj) throws Exception {
		DataListDTO data = goodsPlanBusinessImpl.doSearch(obj);
		return Response.ok(data).build();
	}
	
	@Override
	public Response filterSysUser(GoodsPlanDTO obj) {
		return Response.ok(goodsPlanBusinessImpl.filterSysUser(obj)).build();
	}
	
	@Override
	public Response saveVofficepass(UserConfigDTO obj) throws Exception {
		UserConfigDTO check = userConfigBusinessImpl.findByUser(obj.getVofficeUser());
		try {
			if (check == null) {
				PassTranformer.setInputKey(ca_encrypt_key);
				obj.setVofficePass(PassTranformer.encrypt(obj.getVofficePass()));
				userConfigBusinessImpl.saveObject(obj);
			} else {
				PassTranformer.setInputKey(ca_encrypt_key);
				check.setVofficePass(PassTranformer.encrypt(obj.getVofficePass()));
				userConfigBusinessImpl.updateObject(check);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new BusinessException("Lưu mật khẩu thất bại");
		}
		return Response.ok(Response.Status.OK).build();
	}
	

}
