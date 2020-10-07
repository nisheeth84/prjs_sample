package com.viettel.coms.business;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import com.viettel.asset.dto.SysGroupDto;
import com.viettel.coms.bo.GoodsPlanBO;
import com.viettel.coms.dao.GoodsPlanDAO;
import com.viettel.coms.dao.GoodsPlanDetailDAO;
import com.viettel.coms.dto.AssetManagementRequestDetailDTO;
import com.viettel.coms.dto.GoodsPlanDTO;
import com.viettel.coms.dto.GoodsPlanDetailDTO;
import com.viettel.coms.dto.RequestGoodsDTO;
import com.viettel.coms.dto.RequestGoodsDetailDTO;
import com.viettel.coms.dto.SignVofficeDTO;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;

@Service("goodsPlanBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class GoodsPlanBusinessImpl extends BaseFWBusinessImpl<GoodsPlanDAO, GoodsPlanDTO, GoodsPlanBO>
implements GoodsPlanBusiness{
	@Autowired
	private GoodsPlanDAO goodsPlanDAO;
	
	@Autowired
	private GoodsPlanDetailDAO goodsPlanDetailDAO;
	
	public GoodsPlanBusinessImpl() {
		tModel = new GoodsPlanBO();
		tDAO = goodsPlanDAO;
	}
	
	@Override
	public GoodsPlanDAO gettDAO() {
		return goodsPlanDAO;
	}

	@Override
	public long count() {
		return goodsPlanDAO.count("GoodsPlanDetailBO", null);
	}
	
	/*public List<RequestGoodsDTO> doSearchPopupGoodsPlan(GoodsPlanDTO obj){
		List<RequestGoodsDTO> dto = goodsPlanDAO.doSearchPopupGoodsPlan(obj);
		return dto;
	}*/
	
	public DataListDTO doSearchPopupGoodsPlan(GoodsPlanDTO obj) {
		List<RequestGoodsDTO> ls = goodsPlanDAO.doSearchPopupGoodsPlan(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	
	
	public List<SysGroupDto> doSearchSysGroup(GoodsPlanDTO obj){
		List<SysGroupDto> dto = goodsPlanDAO.doSearchSysGroup(obj);
		return dto;
	}
	
	public List<RequestGoodsDetailDTO> doSearchReqGoodsDetail(GoodsPlanDTO obj){
		List<RequestGoodsDetailDTO> dto = goodsPlanDAO.doSearchReqGoodsDetail(obj);
		return dto;
	}
	
	public Long addGoodsPlan(GoodsPlanDTO obj) {
		boolean check = check(obj.getCode());
		if(!check){
			throw new IllegalArgumentException("Mã kế hoạch đã tồn tại !");
		}
		
		return goodsPlanDAO.saveObject(obj.toModel());
	}
	
	public Long updateGoodsPlan(GoodsPlanDTO obj) {
		return goodsPlanDAO.updateObject(obj.toModel());
	}
	
	public Long remove(GoodsPlanDTO obj) {
		return goodsPlanDAO.remove(obj);
	}
	
	public Long deleteGoodsPlanDetail(GoodsPlanDTO obj) {
		return goodsPlanDAO.deleteGoodsPlanDetail(obj);
	}
	
	public Long addGoodsPlanDetail(GoodsPlanDetailDTO obj) {
		return goodsPlanDetailDAO.saveObject(obj.toModel());
	}
	
	public void removeGoodsPlanDetail(GoodsPlanDTO obj) {
		goodsPlanDetailDAO.removeGoodsPlanDetail(obj);
	}
	
	public Boolean check(String code){
		GoodsPlanDTO obj = goodsPlanDAO.findByCode(code);
 	   if(code == null){
 		   if(obj==null){
 			   return true;
 		   } else {
 			   return false;
 		   }
 	   } else {
 		   if(obj!=null && obj.getCode().equals(code)) {
 			   return false;
 		   } else {
 			   return true;
 		   }
 	   }
    }
	
	public DataListDTO doSearchAll(GoodsPlanDTO obj) {
		List<GoodsPlanDTO> ls = goodsPlanDAO.doSearchAll(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	
	public DataListDTO doSearch(GoodsPlanDTO obj) {
		List<GoodsPlanDetailDTO> ls = goodsPlanDAO.doSearch(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	
	public List<SysUserDTO> filterSysUser(GoodsPlanDTO obj) {
		List<SysUserDTO> sysUserDTOs = goodsPlanDAO.filterSysUser(obj);
		return sysUserDTOs;
	}
	
	public SignVofficeDTO getInformationVO(String objectId){
		SignVofficeDTO signVofficeDTO = goodsPlanDAO.getInformationVO(objectId);
		return signVofficeDTO;
	}
	
	public void removeSignVO(Long signVofficeId){
		goodsPlanDAO.removeSignVO(signVofficeId);
	}
	
	public void removeSignDetailVO(Long signVofficeId){
		goodsPlanDAO.removeSignDetailVO(signVofficeId);
	}

}
